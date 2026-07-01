import { useData } from '../../context/DataContext';
import { useFollow } from '../../context/FollowContext';
import FollowButton from '../common/FollowButton';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../utils/toast';
import { isImageUrl } from '../../utils/avatar';
import DefaultAvatar from '../common/DefaultAvatar';
import styles from './ProfileHeader.module.css';

export default function ProfileHeader({ profileUsername, onViewFollowers, onViewFollowing, onBack }) {
  const { getUserByUsername, currentUser, communities, startConversation } = useData();
  const { following } = useFollow();
  const navigate = useNavigate();
  
  // Fetch real mock user profile
  const targetUsername = profileUsername || currentUser.username;
  const profileUser = getUserByUsername(targetUsername) || currentUser;

  const displayName = profileUser.displayName;
  const isCurrentUser = profileUser.username === currentUser.username;
  const isFollowing = following.includes(profileUser.username);

  // Get college info
  const college = profileUser.collegeId ? communities[profileUser.collegeId] : null;

  const handleMessageClick = async () => {
    if (isCurrentUser) return; // Optional: maybe don't message self, or do
    const convId = await startConversation(profileUser);
    navigate(`/messages/${convId}`);
  };

  // Stats come directly from state
  const followersCount = profileUser.followers || 0;
  const followingCount = profileUser.following || 0;

  // We can use UI faces or just initials for the mock
  // For the mockup we will use an image if available or initials
  const avatarContent = isImageUrl(profileUser.avatar) 
    ? <img src={profileUser.avatar} alt="avatar" className={styles.avatarImg} />
    : <DefaultAvatar />;
    
  // Override for the specific "David Chen" mockup look if needed, but we'll stick to dynamic
  // Let's assume we want to show dynamic image if it's not a single char. 
  // In mockData, they are single chars ('A', 'M', etc), but we will style it to look like the mockup.
  
  return (
    <div className={styles.profileCard}>
      {onBack && (
        <button className={styles.profileBackBtn} onClick={onBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      <div className={styles.profileAvatarContainer}>
        {college && college.avatar ? (
          <div className={styles.avatarFlipCard}>
            <div className={styles.avatarFlipInner}>
              <div className={styles.avatarFront}>
                {avatarContent}
              </div>
              <div className={styles.avatarBack} title={college.name}>
                <img src={college.avatar} alt={college.name} className={styles.collegeBackLogo} />
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.profileAvatarLarge}>
            {avatarContent}
          </div>
        )}
      </div>

      <div className={styles.profileInfo}>
        <h2 className={styles.profileName}>{displayName}</h2>
        <p className={styles.profileUsername}>@{profileUser.username}</p>
        
        <p className={styles.profileTagline}>
          {profileUser.bio}
        </p>
        
        <div className={styles.profileStats}>
          <div className={styles.stat} onClick={onViewFollowers} style={{ cursor: 'pointer' }}>
            <div className={styles.statValue}>{followersCount}</div>
            <div className={styles.statLabel}>Followers</div>
          </div>
          <div className={styles.stat} onClick={onViewFollowing} style={{ cursor: 'pointer' }}>
            <div className={styles.statValue}>{followingCount}</div>
            <div className={styles.statLabel}>Following</div>
          </div>
        </div>

        <div className={styles.profileActions}>
          <div className={styles.followBtnWrapper}>
            {isCurrentUser ? (
              <button className={styles.editProfileBtn} onClick={() => navigate('/settings')}>Edit Profile</button>
            ) : (
              <FollowButton targetUsername={profileUser.username} />
            )}
          </div>
          {isCurrentUser ? (
            <button className={styles.messageBtn} aria-label="Settings" onClick={() => navigate('/settings')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
          ) : (
            <button className={styles.messageBtn} aria-label="Message" onClick={handleMessageClick}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
