import { createContext, useContext, useState, useCallback } from 'react';
import { initialUsers, initialPosts } from '../data/mockData';
import { communities as initialCommunities } from '../data/communities';
import { initialMessages } from '../data/messages';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

const allCommPosts = Object.values(initialCommunities).flatMap(comm => 
  comm.posts.map((p, i) => ({
    id: p.id || `c_post_${comm.id}_${i}`,
    authorId: p.authorId || 'u1',
    time: p.time,
    text: p.text,
    likes: p.likes || 0,
    comments: p.comments || 0,
    isLikedByMe: false,
    replies: [],
    communityId: comm.id
  }))
);

export function DataProvider({ children }) {
  const [users, setUsers] = useState(initialUsers);
  const [posts, setPosts] = useState([...initialPosts, ...allCommPosts]);
  const [communitiesState, setCommunitiesState] = useState(initialCommunities);
  const [conversations, setConversations] = useState(initialMessages);
  const { currentUser } = useAuth();

  const getUserByUsername = useCallback((uName) => {
    return Object.values(users).find(u => u.username === uName) || null;
  }, [users]);

  const getUserById = useCallback((id) => {
    return Object.values(users).find(u => u.id === id) || null;
  }, [users]);

  const getPostById = useCallback((postId) => {
    return posts.find(p => p.id === postId) || null;
  }, [posts]);

  const getUserPosts = useCallback((authorId) => {
    return posts.filter(p => p.authorId === authorId);
  }, [posts]);

  const likePost = useCallback(async (postId) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = p.isLikedByMe;
        return { 
          ...p, 
          likes: isLiked ? p.likes - 1 : p.likes + 1,
          isLikedByMe: !isLiked
        };
      }
      return p;
    }));
  }, []);

  const addPost = useCallback(async (text, poll, communityId = null) => {
    await new Promise(resolve => setTimeout(resolve, 600));

    const newPost = {
      id: `post_${Date.now()}`,
      authorId: currentUser.id,
      time: 'Just now',
      text,
      poll: poll ? {
        ...poll,
        votes: poll.options.map(() => 0),
        selectedUsers: {}
      } : undefined,
      likes: 0,
      comments: 0,
      replies: [],
      communityId: communityId || undefined
    };
    
    if (!users[currentUser.username]) {
      setUsers(prev => ({ ...prev, [currentUser.username]: currentUser }));
    }

    setPosts(prev => [newPost, ...prev]);
  }, [currentUser, users]);

  const addComment = useCallback(async (postId, text, parentCommentId = null) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;

      const newReply = {
        id: `r_${Date.now()}`,
        authorId: currentUser.id,
        time: 'Just now',
        text,
        likes: 0,
        replies: []
      };

      if (!parentCommentId) {
        return {
          ...p,
          comments: p.comments + 1,
          replies: [newReply, ...(p.replies || [])]
        };
      }

      const addReplyToNode = (nodes) => {
        return nodes.map(node => {
          if (node.id === parentCommentId) {
            return {
              ...node,
              replies: [...(node.replies || []), newReply]
            };
          } else if (node.replies && node.replies.length > 0) {
            return {
              ...node,
              replies: addReplyToNode(node.replies)
            };
          }
          return node;
        });
      };

      return {
        ...p,
        comments: p.comments + 1,
        replies: addReplyToNode(p.replies || [])
      };
    }));

    if (!users[currentUser.username]) {
      setUsers(prev => ({ ...prev, [currentUser.username]: currentUser }));
    }
  }, [currentUser, users]);

  const likeComment = useCallback(async (postId, commentId) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;

      const toggleLikeInNode = (nodes) => {
        return nodes.map(node => {
          if (node.id === commentId) {
            const isLiked = node.isLikedByMe;
            return {
              ...node,
              likes: isLiked ? node.likes - 1 : node.likes + 1,
              isLikedByMe: !isLiked
            };
          } else if (node.replies && node.replies.length > 0) {
            return {
              ...node,
              replies: toggleLikeInNode(node.replies)
            };
          }
          return node;
        });
      };

      return {
        ...p,
        replies: toggleLikeInNode(p.replies || [])
      };
    }));
  }, []);

  const voteInPoll = useCallback(async (postId, optionIndices) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    setPosts(prev => prev.map(p => {
      if (p.id !== postId || !p.poll) return p;
      
      const currentSelected = p.poll.selectedUsers?.[currentUser.id] || [];
      if (currentSelected.length > 0) return p;

      const nextVotes = [...(p.poll.votes || p.poll.options.map(() => 0))];
      optionIndices.forEach(idx => {
        nextVotes[idx] += 1;
      });

      return {
        ...p,
        poll: {
          ...p.poll,
          votes: nextVotes,
          selectedUsers: {
            ...(p.poll.selectedUsers || {}),
            [currentUser.id]: optionIndices
          }
        }
      };
    }));
  }, [currentUser]);

  const toggleJoinCommunity = useCallback(async (communityId) => {
    await new Promise(resolve => setTimeout(resolve, 400));

    setCommunitiesState(prevComm => {
      const commToUpdate = prevComm[communityId];
      if (!commToUpdate) return prevComm;

      const userCommunities = users[currentUser.username]?.communities || currentUser.communities || [];
      const commName = commToUpdate.name;
      const isJoined = userCommunities.includes(commName);

      setUsers(prevUsers => {
        const user = prevUsers[currentUser.username] || currentUser;
        const nextCommunities = isJoined
          ? (user.communities || []).filter(c => c !== commName)
          : [...(user.communities || []), commName];
        return {
          ...prevUsers,
          [currentUser.username]: {
            ...user,
            communities: nextCommunities
          }
        };
      });

      return {
        ...prevComm,
        [communityId]: {
          ...commToUpdate,
          members: isJoined ? commToUpdate.members - 1 : commToUpdate.members + 1
        }
      };
    });
  }, [currentUser, users]);

  const sendDirectMessage = useCallback(async (convId, text, replyTo = null) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const now = new Date();
    const timeStr = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();

    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              messages: [
                ...c.messages,
                { from: 'me', text, time: timeStr, replyTo: replyTo ? { text: replyTo.text, from: replyTo.from } : null }
              ],
              lastMsg: text,
              time: 'now',
            }
          : c
      )
    );
  }, []);

  const reactToMessage = useCallback(async (convId, messageIndex, reaction) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        const updatedMessages = c.messages.map((m, idx) => {
          if (idx !== messageIndex) return m;
          const currentReactions = m.reactions || [];
          const exists = currentReactions.includes(reaction);
          const newReactions = exists
            ? currentReactions.filter((r) => r !== reaction)
            : [...currentReactions, reaction];
          return { ...m, reactions: newReactions };
        });
        return { ...c, messages: updatedMessages };
      })
    );
  }, []);

  const clearChat = useCallback(async (convId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? { ...c, messages: [], lastMsg: 'Chat cleared', time: 'now' }
          : c
      )
    );
  }, []);

  const toggleBlockUser = useCallback(async (convId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? { ...c, blocked: !c.blocked }
          : c
      )
    );
  }, []);

  const startConversation = useCallback(async (targetUser) => {
    const targetName = targetUser.displayName || targetUser.name;
    const targetAvatar = targetUser.avatar || (targetName ? targetName.charAt(0).toUpperCase() : '?');

    await new Promise(resolve => setTimeout(resolve, 300));

    const existingConv = conversations.find(c => c.name === targetName);
    if (existingConv) return existingConv.id;

    const newId = Date.now();
    const newConv = {
      id: newId,
      name: targetName,
      avatar: targetAvatar,
      color: 'var(--color-primary)',
      online: true,
      lastMsg: 'Say hi!',
      time: 'Just now',
      unread: 0,
      messages: []
    };
    
    setConversations(prev => [newConv, ...prev]);
    return newId;
  }, [conversations]);

  const [searchQuery, setSearchQuery] = useState('');
  const liveCurrentUser = users[currentUser?.username] || currentUser;

  return (
    <DataContext.Provider value={{
      users,
      posts,
      communities: communitiesState,
      conversations,
      currentUser: liveCurrentUser,
      searchQuery,
      setSearchQuery,
      getUserByUsername,
      getUserById,
      getPostById,
      getUserPosts,
      likePost,
      addPost,
      addComment,
      likeComment,
      voteInPoll,
      toggleJoinCommunity,
      sendDirectMessage,
      reactToMessage,
      clearChat,
      toggleBlockUser,
      startConversation
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
