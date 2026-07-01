import { useState, useEffect, useCallback, memo } from 'react';
import { useData } from '../../context/DataContext';
import PostComposer from './PostComposer';
import Post from './Post';
import PostSkeleton from './PostSkeleton';
import styles from './Feed.module.css';

function Feed({ onPostClick }) {
  const { posts, addPost, searchQuery, getUserById, communities } = useData();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Stable reference so PostComposer (React.memo) doesn't re-render when
  // unrelated DataContext slices change
  const handleNewPost = useCallback((text, pollData) => {
    if (pollData || text) {
      addPost(text, pollData);
    }
  }, [addPost]);

  const filteredPosts = posts.filter((p) => {
    if (!searchQuery) return true;
    const author = getUserById(p.authorId);
    return (
      p.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      author?.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      author?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className={styles.feed}>
      <PostComposer onSubmit={handleNewPost} />
      {initialLoading ? (
        <>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </>
      ) : filteredPosts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--color-text-muted)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', opacity: 0.5 }}>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>It's quiet here...</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Join communities or follow people to see their updates.</p>
          <button 
            style={{ padding: '0.6rem 1.2rem', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 500 }}
            onClick={() => window.location.href='/communities'}
          >
            Discover Communities
          </button>
        </div>
      ) : (
        filteredPosts.map((p) => {
          const cTag = p.communityId ? communities[p.communityId] : null;
          return (
            <Post key={p.id} postData={p} communityTag={cTag} onClick={() => onPostClick && onPostClick(p, 'feed')} />
          );
        })
      )}
    </div>
  );
}

export default memo(Feed);
