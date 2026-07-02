import { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { showToast } from '../../utils/toast';
import { isImageUrl } from '../../utils/avatar';
import DefaultAvatar from '../common/DefaultAvatar';
import { useData } from '../../context/DataContext';
import { timeAgo } from '../../utils/time';
import styles from './Post.module.css';

function PollCard({ poll, postId }) {
  const { voteInPoll, currentUser } = useData();

  // Derive voted state and votes from the shared DataContext poll object
  const myVotes = poll.selectedUsers?.[currentUser?.id] || [];
  const hasVoted = myVotes.length > 0;
  const votes = poll.votes || poll.options.map(() => 0);
  const totalVotes = votes.reduce((a, b) => a + b, 0);

  // Local state only for multi-select pre-submission selection
  const [pendingSelection, setPendingSelection] = useState([]);

  const handleVote = (idx) => {
    if (hasVoted) return;

    if (poll.multiSelect) {
      setPendingSelection((prev) =>
        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
      );
    } else {
      voteInPoll(postId, [idx]);
    }
  };

  const confirmMultiVote = () => {
    if (pendingSelection.length === 0 || hasVoted) return;
    voteInPoll(postId, pendingSelection);
    setPendingSelection([]);
  };

  const showResults = hasVoted;
  const selected = hasVoted ? myVotes : pendingSelection;

  return (
    <div className={styles.pollCard}>
      <div className={styles.pollCardHeader}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="9" y1="8" x2="9" y2="16" />
          <line x1="12" y1="11" x2="12" y2="16" />
          <line x1="15" y1="6" x2="15" y2="16" />
        </svg>
        <span className={styles.pollCardQuestion}>{poll.question}</span>
        {poll.multiSelect && <span className={styles.pollMultiBadge}>Multi</span>}
      </div>
      <div className={styles.pollCardOptions}>
        {poll.options.map((opt, i) => {
          const pct = showResults && totalVotes > 0 ? Math.round((votes[i] / totalVotes) * 100) : 0;
          const isSelected = selected.includes(i);

          return (
            <button
              key={i}
              className={`${styles.pollCardOption}${isSelected ? ` ${styles.selected}` : ''}${showResults ? ` ${styles.voted}` : ''}`}
              onClick={() => handleVote(i)}
              disabled={showResults}
            >
              <div className={styles.pollOptionFill} style={{ width: showResults ? `${pct}%` : '0%' }} />
              <span className={styles.pollOptionLabel}>
                {poll.multiSelect && !showResults && (
                  <span className={`${styles.pollCheckbox}${isSelected ? ` ${styles.checked}` : ''}`}>
                    {isSelected && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><polyline points="20 6 9 17 4 12" /></svg>}
                  </span>
                )}
                {opt}
              </span>
              {showResults && <span className={styles.pollOptionPct}>{pct}%</span>}
            </button>
          );
        })}
      </div>
      <div className={styles.pollCardFooter}>
        {poll.multiSelect && !hasVoted && pendingSelection.length > 0 && (
          <button className={styles.pollConfirmBtn} onClick={confirmMultiVote}>Confirm</button>
        )}
        <span className={styles.pollVoteCount}>{totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}</span>
      </div>
    </div>
  );
}

function Post({ postData, communityTag, onClick }) {
  const { getUserById, getPostById, likePost, communities, currentUser, deletePost, editPost } = useData();
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');

  const livePost = postData ? (getPostById(postData.id) || postData) : null;
  if (!livePost) return null;

  const { id, authorId, time, text, poll, likes, comments, isLikedByMe: rawIsLiked } = livePost;
  const isLikedByMe = livePost.likedBy ? livePost.likedBy.includes(currentUser?.id) : !!rawIsLiked;
  const author = getUserById(authorId) || { displayName: 'Unknown', username: 'unknown', avatar: '?' };
  const authorCollege = author.collegeId ? communities[author.collegeId] : null;

  const toggleLike = (e) => {
    e.stopPropagation();
    likePost(id);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/post/${id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => showToast('Link copied!')).catch(() => showToast('Link copied!'));
    } else {
      showToast('Link copied!');
    }
  };

  return (
    <div className={styles.post} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className={styles.postHeader}>
        <Link to={`/profile/${author.username}`} style={{ textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>
          <div className={styles.postAvatar}>
            {isImageUrl(author.avatar) ? (
              <img src={author.avatar} alt={author.displayName} className={styles.postAvatarImg} />
            ) : (
              <DefaultAvatar />
            )}
          </div>
        </Link>
        <div className={styles.postUser}>
          <Link to={`/profile/${author.username}`} style={{ textDecoration: 'none', color: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }} onClick={(e) => e.stopPropagation()}>
            <div className={`hover-underline ${styles.postName}`}>{author.displayName}</div>

            {authorCollege && (
              <img
                src={authorCollege.avatar}
                alt={authorCollege.name}
                className={styles.postCollegeIcon}
                title={authorCollege.name}
              />
            )}
          </Link>
          <div className={styles.postTime} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span>{livePost.createdAt ? timeAgo(livePost.createdAt) : time}</span>
          </div>
        </div>

        <div className={styles.postMenuWrapper}>
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            aria-label="Post options"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.2rem', borderRadius: '50%' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="19" cy="12" r="1.5" />
              <circle cx="5" cy="12" r="1.5" />
            </svg>
          </button>
          {showMenu && (
            <div className="dropdown open" style={{ right: 0, top: '100%', width: '120px' }}>
              {currentUser && authorId === currentUser.id && (() => {
                const postTimestamp = id.startsWith('post_') ? parseInt(id.split('_')[1], 10) : 0;
                const canDelete = (Date.now() - postTimestamp) <= 5 * 60 * 1000;
                
                return canDelete ? (
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      if (deletePost) await deletePost(id);
                    }}
                    style={{ color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Delete
                  </button>
                ) : null;
              })()}
              <button
                onClick={(e) => { e.stopPropagation(); showToast('Reported'); setShowMenu(false); }}
                style={{ color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                Report
              </button>
            </div>
          )}
        </div>
      </div>
      {isEditing ? (
        <div className={styles.postBody} onClick={(e) => e.stopPropagation()}>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            style={{ width: '100%', minHeight: '60px', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', fontFamily: 'inherit', fontSize: '1rem' }}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
            <button onClick={() => { setIsEditing(false); }} style={{ padding: '0.35rem 0.75rem', cursor: 'pointer', background: 'var(--color-bg-white)', border: '1px solid var(--color-border)', borderRadius: '4px', fontWeight: 500 }}>Cancel</button>
            <button onClick={async () => {
              if (editPost) await editPost(id, editText);
              setIsEditing(false);
            }} style={{ padding: '0.35rem 0.75rem', cursor: 'pointer', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 500 }}>Save</button>
          </div>
        </div>
      ) : (
        text && <div className={styles.postBody}>{text}</div>
      )}
      {livePost.media && (
        <div className={styles.postMedia} onClick={(e) => e.stopPropagation()}>
          {livePost.media.type === 'image' ? (
            <img src={livePost.media.url} alt="Post attachment" className={styles.mediaItem} />
          ) : (
            <video src={livePost.media.url} controls className={styles.mediaItem} />
          )}
        </div>
      )}
      {poll && <div onClick={(e) => e.stopPropagation()}><PollCard poll={poll} postId={id} /></div>}
      <div className={styles.postActions} style={{ marginTop: '0.5rem', paddingTop: '0' }}>
        <button className={`${styles.postActionBtn} ${isLikedByMe ? styles.liked : ''}`} onClick={toggleLike} style={{ ...(isLikedByMe ? { color: 'var(--color-primary)' } : {}) }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isLikedByMe ? 'var(--color-primary)' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{likes}</span>
        </button>
        <button className={styles.postActionBtn} onClick={(e) => { e.stopPropagation(); if(onClick) onClick(); }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          </svg>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{comments}</span>
        </button>
        <button className={styles.postActionBtn} onClick={handleShare}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <span className={styles.shareText} style={{ fontSize: '0.85rem', fontWeight: 600 }}>Share</span>
        </button>
      </div>
    </div>
  );
}

export default memo(Post);
