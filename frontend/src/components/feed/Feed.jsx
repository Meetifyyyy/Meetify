import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import PostComposer from './PostComposer';
import Post from './Post';
import PostSkeleton from './PostSkeleton';
import styles from './Feed.module.css';

export default function Feed({ onPostClick }) {
  const { posts, addPost, searchQuery, getUserById, communities } = useData();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleNewPost = (text, pollData) => {
    if (pollData || text) {
      addPost(text, pollData);
    }
  };

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
