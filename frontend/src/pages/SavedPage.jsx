import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSmartBack } from '../hooks/useSmartBack';
import { Bookmark, List, Grid, ArrowLeft } from 'lucide-react';
import { useData } from '../context/DataContext';
import Post from '../components/feed/Post';
import Avatar from '../components/common/Avatar';
import styles from './SavedPage.module.css';
import { showToast } from '../utils/toast';

/**
 * SavedPage displays the user's saved posts.
 * It supports two display modes: "compact" and "expanded".
 * The selected mode is persisted in localStorage under the key 'saved_view_mode'.
 */
export default function SavedPage() {
  const navigate = useNavigate();
  const goBack = useSmartBack();
  const { savedPosts = [], getPostById, getUserById, toggleSavePost } = useData();
  
  // Keep posts in the list for the current session even if unbookmarked
  const [sessionSavedPostIds, setSessionSavedPostIds] = useState(savedPosts);

  useEffect(() => {
    // Add any newly bookmarked posts to the session list, but don't remove unbookmarked ones
    const newIds = savedPosts.filter(id => !sessionSavedPostIds.includes(id));
    if (newIds.length > 0) {
      setSessionSavedPostIds(prev => [...newIds, ...prev]);
    }
  }, [savedPosts, sessionSavedPostIds]);

  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('saved_view_mode') || 'expanded';
  });

  useEffect(() => {
    localStorage.setItem('saved_view_mode', viewMode);
  }, [viewMode]);

  const handleToggleSaved = (e, postId) => {
    e.stopPropagation();
    e.preventDefault();
    if (toggleSavePost) {
        toggleSavePost(postId);
    }
    // TODO: call DELETE /saved/:postId or POST /saved/:postId depending on state
    const isCurrentlySaved = savedPosts.includes(postId);
    showToast(isCurrentlySaved ? 'Post removed from saved' : 'Post saved');
  };

  const fullPosts = sessionSavedPostIds.map(id => getPostById ? getPostById(id) : null).filter(Boolean);

  return (
    <main className="centre animate-in">
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.headerSquareBtn} onClick={() => goBack('/home')} title="Back">
            <ArrowLeft size={20} />
          </button>
          <h1 className={styles.title}>Saved</h1>
        </div>
        
        {fullPosts.length > 0 && (
          <div className={styles.viewToggleGroup}>
            <button 
              className={`${styles.viewToggleBtn} ${viewMode === 'compact' ? styles.active : ''}`}
              onClick={() => setViewMode('compact')}
              title="Compact View"
            >
              <List size={18} />
            </button>
            <button 
              className={`${styles.viewToggleBtn} ${viewMode === 'expanded' ? styles.active : ''}`}
              onClick={() => setViewMode('expanded')}
              title="Expanded View"
            >
              <Grid size={18} />
            </button>
          </div>
        )}
      </header>

      <div className={`${styles.content} ${viewMode === 'expanded' ? styles.expandedLayout : styles.compactLayout}`}>
        {fullPosts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconWrapper}>
              <Bookmark size={48} strokeWidth={1} />
            </div>
            <h2>Nothing saved yet</h2>
            <p>Tap the bookmark on any post to save it here</p>
          </div>
        ) : viewMode === 'expanded' ? (
          <div className={styles.expandedContainer}>
            {fullPosts.map(post => {
              const isSaved = savedPosts.includes(post.id);
              return (
                <div key={post.id} className={styles.postWrapper}>
                  <Post postData={post} hideCommunityTag={false} />
                  <button 
                    className={styles.removeExpandedBtn} 
                    onClick={(e) => handleToggleSaved(e, post.id)}
                    title={isSaved ? "Remove from saved" : "Save post"}
                  >
                    <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.compactContainer}>
            {fullPosts.map(post => {
              const author = getUserById ? getUserById(post.authorId) : null;
              const displayName = author?.displayName || author?.username || 'Unknown';
              const avatar = author?.avatar;
              const previewText = post.text?.length > 80 ? post.text.substring(0, 80) + '...' : post.text;
              const isSaved = savedPosts.includes(post.id);

              return (
                <div key={post.id} className={styles.compactRow} onClick={() => navigate(`/post/${post.id}`)}>
                  <div className={styles.compactAvatar}>
                    <Avatar 
                      src={avatar} 
                      name={displayName} 
                      size="36px" 
                    />
                  </div>
                  <div className={styles.compactInfo}>
                    <div className={styles.compactHeader}>
                      <span className={styles.compactAuthorName}>{displayName}</span>
                      {author?.username && <span className={styles.compactUsername}>@{author.username}</span>}
                    </div>
                    <span className={styles.compactPreview}>{previewText}</span>
                  </div>
                  <button 
                    className={`${styles.removeCompactBtn} ${isSaved ? styles.compactSaved : ''}`} 
                    onClick={(e) => handleToggleSaved(e, post.id)}
                    title={isSaved ? "Remove from saved" : "Save post"}
                  >
                    <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} stroke={isSaved ? "none" : "currentColor"} strokeWidth={2} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
