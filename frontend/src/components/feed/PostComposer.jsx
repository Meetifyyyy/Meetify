import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function PostComposer({ onSubmit }) {
  const { initial } = useAuth();
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  const handlePost = () => {
    const text = value.trim();
    if (!text) return;
    onSubmit(text);
    setValue('');
  };

  return (
    <div className="post-composer">
      <div className="composer-avatar">{initial}</div>
      <div className="composer-input-wrap">
        <input
          ref={inputRef}
          type="text"
          className="composer-input"
          placeholder="What's on your mind?"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handlePost(); }}
        />
        <div className="composer-actions">
          <div className="composer-actions-left" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button className="composer-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              Photo
            </button>
            <button className="composer-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
              Video
            </button>
            <button className="composer-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Event
            </button>
          </div>
          <button className="composer-btn composer-btn-primary" onClick={handlePost}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
