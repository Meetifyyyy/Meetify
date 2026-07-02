import { useCallback, memo } from 'react';
import { useData } from '../../context/DataContext';
import { useSimulatedFetch } from '../../hooks/useSimulatedFetch';
import { EmptyState, ErrorState } from '../common/StateViews';
import PostComposer from './PostComposer';
import Post from './Post';
import PostSkeleton from './PostSkeleton';
import styles from './Feed.module.css';

function Feed({ onPostClick }) {
  const { posts, addPost, searchQuery, getUserById, communities } = useData();

  const filteredPosts = posts.filter((p) => {
    if (!searchQuery) return true;
    const author = getUserById(p.authorId);
    return (
      p.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      author?.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      author?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const { isLoading, data, error, retry } = useSimulatedFetch(filteredPosts, 800);

  // Stable reference so PostComposer (React.memo) doesn't re-render when
  // unrelated DataContext slices change
  const handleNewPost = useCallback((text, pollData, mediaData) => {
    if (pollData || text || mediaData) {
      addPost(text, pollData, null, mediaData);
    }
  }, [addPost]);

  return (
    <div className={styles.feed}>
      <PostComposer onSubmit={handleNewPost} />
      
      {isLoading && (
        <>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </>
      )}

      {!isLoading && error && (
        <ErrorState onRetry={retry} />
      )}

      {!isLoading && !error && data && data.length === 0 && (
        <EmptyState 
          title="It's quiet here..."
          message="Join communities or follow people to see their updates."
          icon={
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', opacity: 0.5 }}>
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          }
        />
      )}

      {!isLoading && !error && data && data.length > 0 && data.map((p) => {
        const cTag = p.communityId ? communities[p.communityId] : null;
        return (
          <Post key={p.id} postData={p} communityTag={cTag} onClick={() => onPostClick && onPostClick(p, 'feed')} />
        );
      })}
    </div>
  );
}

export default memo(Feed);
