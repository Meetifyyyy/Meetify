import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { showToast } from '../../utils/toast';
import styles from './ProfileActivity.module.css';

export default function ProfileActivity() {
  const { username, initial } = useAuth();
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  const posts = [
    { time: '2 days ago', text: 'Just pushed a new open-source project — a real-time whiteboard collab tool! Built with WebSockets and Canvas API. Check it out on my GitHub 🚀', likes: 12, comments: 4 },
    { time: '1 week ago', text: 'Had an amazing session at the NYC Hackathon this weekend! Met 10+ devs from Meetify and we ended up building a working prototype together. This community is unreal 🔥', likes: 34, comments: 11 },
  ];

  return (
    <div className={styles.profileSection}>
      <h2 className={styles.sectionTitle}>Recent Activity</h2>
      {posts.map((p, i) => (
        <div key={i} className={styles.profilePost}>
          <div className={styles.profilePostHeader}>
            <div className={styles.profilePostAvatar}>{initial}</div>
            <div className={styles.profilePostUser}>
              <div className={styles.profilePostName}>{username}</div>
              <div className={styles.profilePostTime}>{p.time}</div>
            </div>
            <div className={styles.menuWrapper}>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setOpenMenuIndex(openMenuIndex === i ? null : i); 
                }}
                className={styles.menuBtn}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="19" cy="12" r="1.5" />
                  <circle cx="5" cy="12" r="1.5" />
                </svg>
              </button>
              {openMenuIndex === i && (
                <div className="dropdown open" style={{ right: 0, top: '100%', width: '120px' }}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); showToast('Reported'); setOpenMenuIndex(null); }} 
                    className={styles.reportBtn}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                    Report
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className={styles.profilePostBody}>{p.text}</div>
          <div className={styles.profilePostActions}>
            <div className={styles.actionItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>{p.likes} Likes</span>
            </div>
            <div className={styles.actionItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <span>{p.comments} Comments</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
