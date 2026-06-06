import { useData } from '../../context/DataContext';
import styles from './ProfileAbout.module.css';

export default function ProfileAbout({ profileUsername }) {
  const { getUserByUsername, currentUser } = useData();
  
  const targetUsername = profileUsername || currentUser?.username;
  const profileUser = getUserByUsername(targetUsername) || currentUser;

  if (!profileUser) return null;

  const aboutItems = [
    { 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      text: 'Joined January 2025' 
    },
    { 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ), 
      text: profileUser.location || 'Earth' 
    },
    { 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ), 
      text: profileUser.role || 'New User' 
    },
    { 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ), 
      text: profileUser.email || `${profileUser.username}@meetify.app` 
    },
  ];

  return (
    <div className={styles.profileSection}>
      <h2 className={styles.sectionTitle}>About Me</h2>
      <p className={styles.aboutText}>
        {profileUser.bio || 'Building cool stuff & meeting awesome people on Meetify!'}
      </p>
      <div className={styles.aboutDetails}>
        {aboutItems.map((item, i) => (
          <div key={i} className={styles.aboutItem}>
            {item.icon}
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
