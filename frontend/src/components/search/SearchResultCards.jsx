import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchResultCards.module.css';

// Helper component to render highlighted text from Fuse.js matches
const HighlightedText = ({ text, matches, keyName }) => {
  if (!matches || matches.length === 0) return <>{text}</>;

  const match = matches.find(m => m.key === keyName);
  if (!match) return <>{text}</>;

  // Construct highlighted string
  let lastIndex = 0;
  const elements = [];
  
  match.indices.forEach(([start, end], idx) => {
    // Add text before match
    if (start > lastIndex) {
      elements.push(<span key={`text-${idx}`}>{text.substring(lastIndex, start)}</span>);
    }
    // Add highlighted match
    elements.push(
      <span key={`highlight-${idx}`} className={styles.highlight}>
        {text.substring(start, end + 1)}
      </span>
    );
    lastIndex = end + 1;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    elements.push(<span key="text-last">{text.substring(lastIndex)}</span>);
  }

  return <>{elements}</>;
};

export function PostResult({ result, isSelected, onClick }) {
  const { item, matches } = result;
  
  return (
    <button 
      className={styles.resultCard} 
      data-selected={isSelected} 
      onClick={() => onClick(`/post/${item.id}`)}
      onKeyDown={(e) => e.key === 'Enter' && onClick(`/post/${item.id}`)}
    >
      <div className={styles.content}>
        <div className={styles.postText}>
          <HighlightedText text={item.text} matches={matches} keyName="text" />
        </div>
        <div className={styles.postMeta}>
          <span className={styles.subtitle}>
            {item.authorName}
          </span>
          {item.communityName && (
            <>
              <span className={styles.dot} />
              <span className={styles.postCommunity}>{item.communityName}</span>
            </>
          )}
          <span className={styles.dot} />
          <span>{item.likes} likes</span>
        </div>
      </div>
    </button>
  );
}

export function CommunityResult({ result, isSelected, onClick }) {
  const { item, matches } = result;
  
  return (
    <button 
      className={styles.resultCard} 
      data-selected={isSelected} 
      onClick={() => onClick(`/communities/${item.id}`)}
    >
      <div 
        className={styles.avatar} 
        style={item.color ? { background: item.color } : {}}
      >
        {item.avatar && item.avatar.includes('/') ? (
           <img src={item.avatar} alt={item.name} className={styles.avatar} />
        ) : (
          item.avatar || item.name.charAt(0)
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.title}>
          <HighlightedText text={item.name} matches={matches} keyName="name" />
        </div>
        <div className={styles.subtitle}>
          {item.members} members
        </div>
      </div>
    </button>
  );
}

export function UserResult({ result, isSelected, onClick }) {
  const { item, matches } = result;
  
  return (
    <button 
      className={styles.resultCard} 
      data-selected={isSelected} 
      onClick={() => onClick(`/profile/${item.username}`)}
    >
      <div className={styles.avatar}>
        {item.avatar && item.avatar.length > 2 ? (
          <img src={item.avatar} alt={item.displayName} className={styles.avatar} />
        ) : (
          item.avatar || item.displayName?.charAt(0) || 'U'
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.title}>
          <HighlightedText text={item.displayName} matches={matches} keyName="displayName" />
        </div>
        <div className={styles.subtitle}>
          @{item.username}
          {item.course && (
            <>
              <span className={styles.dot} />
              {item.course}
            </>
          )}
        </div>
      </div>
    </button>
  );
}

export function CollegeResult({ result, isSelected, onClick }) {
  const { item, matches } = result;
  
  return (
    <button 
      className={styles.resultCard} 
      data-selected={isSelected} 
      onClick={() => onClick(`/colleges/${item.id}`)}
    >
      <div 
        className={`${styles.avatar} ${styles.collegeAvatar}`} 
        style={item.color ? { background: item.color } : {}}
      >
        {item.avatar && item.avatar.includes('/') ? (
           <img src={item.avatar} alt={item.name} className={`${styles.avatar} ${styles.collegeAvatar}`} />
        ) : (
          item.avatar || item.name.charAt(0)
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.title}>
          <HighlightedText text={item.name} matches={matches} keyName="name" />
        </div>
        <div className={styles.subtitle}>
          {item.members} members
          {item.posts && (
            <>
              <span className={styles.dot} />
              {item.posts.length} communities
            </>
          )}
        </div>
      </div>
    </button>
  );
}
