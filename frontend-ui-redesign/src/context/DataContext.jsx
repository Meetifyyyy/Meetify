import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { initialUsers, initialPosts } from '../data/mockData';
import { communities as initialCommunities } from '../data/communities';
import { initialMessages } from '../data/messages';
import { generateCrewActivities } from '../components/crew/crewData';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { currentUser, updateCurrentUser } = useAuth();

  // Compute once, not at module level, so it's inside React lifecycle
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('meetify_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const initialized = { ...initialUsers };
    Object.keys(initialized).forEach(username => {
      const u = initialized[username];
      if (!u.followingList) u.followingList = [];
      if (!u.followersList) u.followersList = [];
    });
    return initialized;
  });

  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('meetify_posts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const commPosts = Object.values(initialCommunities).flatMap(comm =>
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
    return [...initialPosts, ...commPosts];
  });

  const [communitiesState, setCommunitiesState] = useState(() => {
    const saved = localStorage.getItem('meetify_communities');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialCommunities;
  });

  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('meetify_conversations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialMessages;
  });

  const [crewActivities, setCrewActivities] = useState(() => {
    const saved = localStorage.getItem('meetify_crew_activities');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return generateCrewActivities(initialUsers);
  });

  // Persist states to localStorage when changed
  useEffect(() => {
    localStorage.setItem('meetify_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('meetify_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('meetify_communities', JSON.stringify(communitiesState));
  }, [communitiesState]);

  useEffect(() => {
    localStorage.setItem('meetify_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('meetify_crew_activities', JSON.stringify(crewActivities));
  }, [crewActivities]);

  // Sync: merge currentUser changes from AuthContext into DataContext users list
  useEffect(() => {
    if (currentUser && currentUser.username) {
      setUsers(prev => {
        const existing = prev[currentUser.username];
        if (!existing) {
          return {
            ...prev,
            [currentUser.username]: {
              followingList: [],
              followersList: [],
              ...currentUser
            }
          };
        } else {
          // Compare only non-list fields to prevent erasing followingList/followersList
          const comp1 = { ...currentUser };
          const comp2 = { ...existing };
          delete comp2.followingList;
          delete comp2.followersList;
          if (JSON.stringify(comp1) !== JSON.stringify(comp2)) {
            return {
              ...prev,
              [currentUser.username]: {
                ...existing,
                ...currentUser
              }
            };
          }
        }
        return prev;
      });
    }
  }, [currentUser]);

  // Sync: push DataContext users list changes for current user back to AuthContext
  useEffect(() => {
    if (currentUser && currentUser.username && updateCurrentUser) {
      const liveUser = users[currentUser.username];
      if (liveUser) {
        if (JSON.stringify(liveUser) !== JSON.stringify(currentUser)) {
          updateCurrentUser(liveUser);
        }
      }
    }
  }, [users, currentUser, updateCurrentUser]);

  // Notification callback — set by NotificationBridge to avoid circular deps
  const onNotifyRef = useRef(null);
  const setOnNotify = useCallback((fn) => { onNotifyRef.current = fn; }, []);
  const notify = useCallback((type, payload) => {
    if (onNotifyRef.current) onNotifyRef.current(type, payload);
  }, []);

  const enrichCommunity = useCallback((comm) => {
    if (!comm) return comm;
    return {
      ...comm,
      get growth() { return comm.newMembersThisWeek > 0 ? `+${comm.newMembersThisWeek} this week` : ''; }
    };
  }, []);

  const enrichUser = useCallback((user) => {
    if (!user) return user;
    return {
      ...user,
      get communitiesJoined() { return user.communities?.length || 0; },
      get eventsAttended() { return user.activityLog?.filter(a => a.type === 'event').length || 0; },
      get postsThisMonth() { return posts.filter(p => p.authorId === user.id).length; }
    };
  }, [posts]);

  const getUserByUsername = useCallback((uName) => {
    const u = Object.values(users).find(u => u.username === uName) || null;
    return enrichUser(u);
  }, [users, enrichUser]);

  const getUserById = useCallback((id) => {
    const u = Object.values(users).find(u => u.id === id) || null;
    return enrichUser(u);
  }, [users, enrichUser]);

  const getPostById = useCallback((postId) => {
    return posts.find(p => p.id === postId) || null;
  }, [posts]);

  const getUserPosts = useCallback((authorId) => {
    return posts.filter(p => p.authorId === authorId);
  }, [posts]);

  const likePost = useCallback(async (postId) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    setPosts(prev => {
      const updated = prev.map(p => {
        if (p.id === postId) {
          const likedBy = p.likedBy || [];
          const isLiked = likedBy.includes(currentUser?.id);
          const newLikedBy = isLiked 
            ? likedBy.filter(id => id !== currentUser?.id)
            : [...likedBy, currentUser?.id];

          // Notify on like (not unlike), and not on own posts
          if (!isLiked && p.authorId !== currentUser?.id) {
            notify('like', { postId, actorId: currentUser?.id, postAuthorId: p.authorId, text: 'liked your post' });
          }

          const diff = isLiked ? -1 : 1;

          return { 
            ...p, 
            likedBy: newLikedBy,
            likes: Math.max(0, (p.likes || 0) + diff),
            isLikedByMe: !isLiked
          };
        }
        return p;
      });
      return updated;
    });
  }, [currentUser, notify]);

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
      likedBy: [],
      likes: 0,
      comments: 0,
      replies: [],
      communityId: communityId || undefined
    };
    
    if (!Object.values(users).find(u => u.id === currentUser.id)) {
      setUsers(prev => ({ ...prev, [currentUser.username]: currentUser }));
    }

    setPosts(prev => [newPost, ...prev]);
  }, [currentUser, users]);

  const deletePost = useCallback(async (postId) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    setPosts(prev => prev.filter(p => p.id !== postId));
  }, []);

  const editPost = useCallback(async (postId, newText) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, text: newText };
      }
      return p;
    }));
  }, []);

  const addComment = useCallback(async (postId, text, parentCommentId = null) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;

      // Notify post author about the comment (not on own posts)
      if (p.authorId !== currentUser.id) {
        notify('comment', { postId, actorId: currentUser.id, postAuthorId: p.authorId, text: 'replied to your post' });
      }

      const newReply = {
        id: `r_${Date.now()}`,
        authorId: currentUser.id,
        time: 'Just now',
        text,
        likedBy: [],
        likes: 0,
        isLikedByMe: false,
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

    if (!Object.values(users).find(u => u.id === currentUser.id)) {
      setUsers(prev => ({ ...prev, [currentUser.username]: currentUser }));
    }
  }, [currentUser, users, notify]);

  const likeComment = useCallback(async (postId, commentId) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;

      const toggleLikeInNode = (nodes) => {
        return nodes.map(node => {
          if (node.id === commentId) {
            const likedBy = node.likedBy || [];
            const isLiked = likedBy.includes(currentUser?.id);
            const newLikedBy = isLiked 
              ? likedBy.filter(id => id !== currentUser?.id)
              : [...likedBy, currentUser?.id];

            const diff = isLiked ? -1 : 1;

            return {
              ...node,
              likedBy: newLikedBy,
              likes: Math.max(0, (node.likes || 0) + diff),
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
  }, [currentUser]);

  const deleteComment = useCallback(async (postId, commentId) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;

      let removed = false;
      const filterNode = (nodes) => {
        const filtered = nodes.filter(node => {
          if (node.id === commentId) {
            removed = true;
            return false;
          }
          return true;
        });

        return filtered.map(node => {
          if (node.replies && node.replies.length > 0) {
            return {
              ...node,
              replies: filterNode(node.replies)
            };
          }
          return node;
        });
      };

      const newReplies = filterNode(p.replies || []);
      return {
        ...p,
        comments: removed ? Math.max(0, p.comments - 1) : p.comments,
        replies: newReplies
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

      // Notify on join (not leave)
      if (!isJoined) {
        notify('community_join', { communityId, actorId: currentUser?.id, text: `joined ${commName}` });
      }

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
  }, [currentUser, users, notify]);

  const addCommunity = useCallback(async (communityData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const id = 'c_' + Date.now();
    const newComm = {
      id,
      ...communityData,
      members: 1,
      isUniversity: false,
    };
    setCommunities(prev => ({ ...prev, [id]: newComm }));
    return id;
  }, []);

  const updateFollowerCount = useCallback((targetUsername, isFollowingNow) => {
    setUsers(prevUsers => {
      const targetUser = prevUsers[targetUsername];
      const me = prevUsers[currentUser?.username] || currentUser;
      if (!targetUser || !me) return prevUsers;

      return {
        ...prevUsers,
        [targetUsername]: {
          ...targetUser,
          followers: Math.max(0, (targetUser.followers || 0) + (isFollowingNow ? 1 : -1))
        },
        [me.username]: {
          ...me,
          following: Math.max(0, (me.following || 0) + (isFollowingNow ? 1 : -1))
        }
      };
    });
  }, [currentUser]);

  const toggleFollow = useCallback((targetUsername) => {
    if (!currentUser || !currentUser.username || targetUsername === currentUser.username) return;

    setUsers(prevUsers => {
      const me = prevUsers[currentUser.username] || currentUser;
      const target = prevUsers[targetUsername];
      if (!me || !target) return prevUsers;

      const myFollowing = me.followingList || [];
      const targetFollowers = target.followersList || [];
      const isFollowingNow = !myFollowing.includes(targetUsername);

      const nextMyFollowing = isFollowingNow
        ? [...myFollowing, targetUsername]
        : myFollowing.filter(u => u !== targetUsername);

      const nextTargetFollowers = isFollowingNow
        ? [...targetFollowers, me.username]
        : targetFollowers.filter(u => u !== me.username);

      // Notify on follow
      if (isFollowingNow) {
        notify('follow', { targetUsername, actorId: me.id, text: 'started following you' });
      }

      return {
        ...prevUsers,
        [me.username]: {
          ...me,
          followingList: nextMyFollowing,
          following: Math.max(0, (me.following || 0) + (isFollowingNow ? 1 : -1))
        },
        [targetUsername]: {
          ...target,
          followersList: nextTargetFollowers,
          followers: Math.max(0, (target.followers || 0) + (isFollowingNow ? 1 : -1))
        }
      };
    });
  }, [currentUser, notify]);

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
    const targetUsername = targetUser.username || targetUser.id || targetName;
    const targetAvatar = targetUser.avatar || (targetName ? targetName.charAt(0).toUpperCase() : '?');

    await new Promise(resolve => setTimeout(resolve, 300));

    // Match by username/id first (stable), fall back to name for legacy conversations
    const existingConv = conversations.find(c => 
      (c.username && c.username === targetUsername) || 
      (!c.username && c.name === targetName)
    );
    if (existingConv) return existingConv.id;

    const newId = Date.now();
    const newConv = {
      id: newId,
      name: targetName,
      username: targetUsername,
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

  const joinCrewActivity = useCallback(async (activityId) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    setCrewActivities(prev => prev.map(a => {
      if (a.id !== activityId) return a;
      const alreadyJoined = a.participants.includes(currentUser?.id);
      if (alreadyJoined) return a;

      notify('crew_join', { activityId, actorId: currentUser?.id, text: `joined ${a.title}` });

      return {
        ...a,
        slotsFilled: Math.min(a.slotsFilled + 1, a.slotsNeeded),
        participants: [...a.participants, currentUser?.id]
      };
    }));
  }, [currentUser, notify]);

  const addCrewActivity = useCallback((newActivity) => {
    setCrewActivities(prev => [newActivity, ...prev]);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const liveCurrentUser = enrichUser(users[currentUser?.username] || currentUser);
  
  // Enrich all communities before providing them
  const enrichedCommunities = Object.keys(communitiesState).reduce((acc, key) => {
    acc[key] = enrichCommunity(communitiesState[key]);
    return acc;
  }, {});

  return (
    <DataContext.Provider value={{
      users,
      posts,
      communities: enrichedCommunities,
      conversations,
      crewActivities,
      currentUser: liveCurrentUser,
      searchQuery,
      setSearchQuery,
      getUserByUsername,
      getUserById,
      getPostById,
      getUserPosts,
      likePost,
      addPost,
      deletePost,
      editPost,
      addCommunity,
      addComment,
      deleteComment,
      likeComment,
      voteInPoll,
      toggleJoinCommunity,
      updateFollowerCount,
      toggleFollow,
      sendDirectMessage,
      reactToMessage,
      clearChat,
      toggleBlockUser,
      startConversation,
      joinCrewActivity,
      addCrewActivity,
      setOnNotify
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
