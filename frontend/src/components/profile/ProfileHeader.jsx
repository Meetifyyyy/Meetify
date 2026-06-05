import { useAuth } from '../../context/AuthContext';
import { useFollow } from '../../context/FollowContext';
import FollowButton from '../common/FollowButton';
import { useNavigate } from 'react-router-dom';
import styles from './ProfileHeader.module.css';

export default function ProfileHeader({ profileUsername, onViewFollowers, onViewFollowing, onBack }) {
  const { username: currentUser } = useAuth();
  const { following } = useFollow();
  const navigate = useNavigate();
  
  // In a real app, you'd fetch the user profile data. Here we mock it based on the name.
  const displayUsername = profileUsername || currentUser;
  const initial = displayUsername ? displayUsername.charAt(0).toUpperCase() : '?';
  const displayName = displayUsername ? displayUsername.charAt(0).toUpperCase() + displayUsername.slice(1) : '';

  const isCurrentUser = displayUsername === currentUser;
  const isFollowing = following.includes(displayUsername);

  // Mock stats
  let followersCount = isCurrentUser ? 156 : 42;
  if (!isCurrentUser && isFollowing) followersCount += 1;
  const followingCount = isCurrentUser ? following.length : 18;

  return (
    <div className={styles.profileCard}>
      <div className={styles.profileCover}>
        {onBack && (
          <button className={styles.profileBackBtn} onClick={onBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
        <div className={styles.profileAvatarLarge}>{initial}</div>
      </div>

      <div className={styles.profileInfo}>
        <div className={styles.profileInfoHeader}>
          <div>
            <h1 className={styles.profileName}>{displayName}</h1>
            <p className={styles.profileUsername}>@{displayUsername}</p>
          </div>
          {!isCurrentUser && (
            <FollowButton targetUsername={displayUsername} />
          )}
        </div>
        
        <p className={styles.profileTagline}>
          Building cool stuff & meeting awesome people. I love experimenting with new technologies, creating unique user experiences, and exploring the unknown.
        </p>
        
        <div className={styles.profileSubtitleRow}>
          <div className={styles.subtitleItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Based in New York
          </div>
          <div className={styles.subtitleItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Full-stack Developer
          </div>
          <div className={styles.subtitleItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            {displayUsername}@meetify.app
          </div>
        </div>
        
        <div className={styles.profileStats}>
          <div className={styles.stat} onClick={onViewFollowers} style={{ cursor: 'pointer' }}>
            <div className={styles.statValue}>{followersCount}</div>
            <div className={styles.statLabel}>Followers</div>
          </div>
          <div className={styles.stat} onClick={onViewFollowing} style={{ cursor: 'pointer' }}>
            <div className={styles.statValue}>{followingCount}</div>
            <div className={styles.statLabel}>Following</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>43</div>
            <div className={styles.statLabel}>Posts</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>12</div>
            <div className={styles.statLabel}>Communities</div>
          </div>
        </div>
      </div>
    </div>
  );
}
