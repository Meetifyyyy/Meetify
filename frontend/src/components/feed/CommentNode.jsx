import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../utils/toast';
import styles from './CommentNode.module.css';

export default function CommentNode({ comment, onReplySubmit, level = 0, isLastInThread = false }) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [likes, setLikes] = useState(comment.likes);
  const [liked, setLiked] = useState(comment.liked);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/profile/${comment.user.toLowerCase().replace(/\s+/g, '')}`);
  };

  const handleReplyClick = () => {
    setIsReplying(!isReplying);
    setReplyText(''); // Clear input when toggling
  };

  const handleCancelReply = () => {
    setIsReplying(false);
    setReplyText('');
  };

  const handleSubmit = () => {
    if (!replyText.trim()) return;
    onReplySubmit(comment.id, replyText);
    setIsReplying(false);
    setReplyText('');
  };

  const handleLike = () => {
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
  };

  return (
    <div className={`${styles.nodeContainer} ${level === 0 ? styles.level0 : styles.levelN}`}>
      {/* Thread Line connecting this comment to its children */}
      {!isLastInThread && (
        <div className={styles.threadLine} />
      )}

      <div className={styles.replyWrapper}>
        <div 
          className={styles.replyAvatar} 
          onClick={handleProfileClick}
        >
          {comment.avatar}
        </div>
        
        <div className={styles.replyContent}>
          <div className={styles.replyHeader}>
            <span 
              onClick={handleProfileClick}
              className={`hover-underline ${styles.username}`}
            >
              {comment.user}
            </span>
            <span className={styles.handle}>@{comment.user.toLowerCase().replace(/\s+/g, '')}</span>
            <span className={styles.time}>• {comment.time}</span>
            <div className={styles.menuWrapper}>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                className={styles.menuBtn}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="19" cy="12" r="1.5" />
                  <circle cx="5" cy="12" r="1.5" />
                </svg>
              </button>
              {showMenu && (
                <div className="dropdown open" style={{ right: 0, top: '100%', width: '120px' }}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); showToast('Reported'); setShowMenu(false); }} 
                    className={styles.reportBtn}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                    Report
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className={styles.replyText}>
            {comment.text}
          </div>
          <div className={styles.replyActionsRow}>
            <button 
              onClick={handleLike}
              className={`${styles.actionBtn} ${liked ? styles.actionBtnLiked : ''}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={liked ? 'var(--color-danger)' : 'none'} stroke="currentColor" strokeWidth="2.5"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
              {likes}
            </button>
            <button 
              onClick={handleReplyClick}
              className={styles.actionBtn}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 14 20 9 15 4" /><path d="M4 20v-7a4 4 0 0 1 4-4h12" /></svg>
              Reply
            </button>
          </div>

          {/* Inline Reply Composer */}
          {isReplying && (
            <div className={styles.inlineComposerContainer}>
              <textarea 
                placeholder={`Reply to u/${comment.user.replace(/\s+/g, '')}`}
                value={replyText}
                onChange={(e) => {
                  setReplyText(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = (e.target.scrollHeight) + 'px';
                }}
                rows={1}
                className={styles.inlineTextarea}
                autoFocus
              />
              <div className={styles.inlineActions}>
                <button 
                  onClick={handleCancelReply}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={!replyText.trim()} 
                  className={`${styles.submitBtn} ${replyText.trim() ? styles.submitBtnActive : styles.submitBtnDisabled}`}
                >
                  Comment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Render children comments indented */}
      {comment.replies && comment.replies.length > 0 && (
        <div className={styles.repliesContainer}>
          {comment.replies.map((childReply, idx) => (
            <CommentNode 
              key={childReply.id} 
              comment={childReply} 
              onReplySubmit={onReplySubmit} 
              level={level + 1}
              isLastInThread={idx === comment.replies.length - 1 && (!childReply.replies || childReply.replies.length === 0)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
