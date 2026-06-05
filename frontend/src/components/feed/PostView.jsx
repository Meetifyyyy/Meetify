import { useState } from 'react';
import Post from './Post';
import CommentNode from './CommentNode';
import styles from './PostView.module.css';

const mockReplies = [
  { 
    id: 'r1', 
    user: 'Sammy Doe', 
    avatar: 'S', 
    time: '1 hour ago', 
    text: 'Totally agree with this! The transition to glassmorphism is making things look so much cleaner.', 
    likes: 5,
    liked: false,
    replies: [
      {
        id: 'r1_1',
        user: 'Alex Q.',
        avatar: 'A',
        time: '45 mins ago',
        text: 'I think neumorphism still has its place, especially for hardware-like interfaces, but glassmorphism is definitely more modern.',
        likes: 2,
        liked: false,
        replies: []
      }
    ]
  },
  { 
    id: 'r3', 
    user: 'Chris B.', 
    avatar: 'C', 
    time: '20 mins ago', 
    text: 'Can you share the Figma file? Would love to see how you set up the layer blurs!', 
    likes: 8,
    liked: false,
    replies: []
  },
];

export default function PostView({ post, onBack }) {
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState(mockReplies);

  if (!post) return null;

  // Handles adding a reply to the main post
  const handleMainReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const newReply = {
      id: `r_${Date.now()}`,
      user: 'You',
      avatar: 'Y',
      time: 'Just now',
      text: replyText,
      likes: 0,
      liked: false,
      replies: []
    };
    setReplies([newReply, ...replies]);
    setReplyText('');
  };

  // Handles adding a reply to a specific comment recursively
  const handleCommentReplySubmit = (parentId, text) => {
    const addReplyToNode = (nodes) => {
      return nodes.map(node => {
        if (node.id === parentId) {
          return {
            ...node,
            replies: [
              ...(node.replies || []),
              {
                id: `r_${Date.now()}`,
                user: 'You',
                avatar: 'Y',
                time: 'Just now',
                text: text,
                likes: 0,
                liked: false,
                replies: []
              }
            ]
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

    setReplies(addReplyToNode(replies));
  };

  return (
    <div className={styles.postViewContainer}>
      
      {/* Top Bar */}
      <div className={styles.postViewTopbar}>
        <button onClick={onBack} className={styles.postBackBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
        </button>
        <h2 className={styles.postViewTitle}>Post</h2>
      </div>

      {/* Main Post */}
      <div className={`${styles.postViewMain} comm-feed-integrated`}>
        <Post {...post} onClick={() => document.getElementById('reply-composer').focus()} />
      </div>

      {/* Reply Composer (Top Level) */}
      <div className={styles.postViewComposer}>
        <div className={styles.composerAvatar}>Y</div>
        <form onSubmit={handleMainReplySubmit} className={styles.replyForm}>
          <textarea 
            id="reply-composer"
            placeholder="Post your reply..." 
            value={replyText}
            onChange={(e) => {
              setReplyText(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = (e.target.scrollHeight) + 'px';
            }}
            rows={1}
            className={styles.replyTextarea}
          />
          <div className={styles.replyActions}>
            <button 
              type="submit" 
              disabled={!replyText.trim()} 
              className={`${styles.replyBtn} ${replyText.trim() ? styles.replyBtnActive : styles.replyBtnDisabled}`}
            >
              Reply
            </button>
          </div>
        </form>
      </div>

      {/* Replies List */}
      <div className={styles.postViewReplies}>
        {replies.map((reply, idx) => (
          <CommentNode 
            key={reply.id} 
            comment={reply} 
            onReplySubmit={handleCommentReplySubmit} 
            level={0}
            isLastInThread={idx === replies.length - 1 && (!reply.replies || reply.replies.length === 0)}
          />
        ))}
      </div>
    </div>
  );
}
