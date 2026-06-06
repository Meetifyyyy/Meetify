import { useFollow } from '../../context/FollowContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import FollowButton from './FollowButton';
import styles from './UserListModal.module.css';

export default function UserListModal({ type, profileUsername, onClose }) {
  const { following } = useFollow();
  const { username: currentUser } = useAuth();
  const { users: allUsers, getUserByUsername } = useData();
  const isFollowingTarget = following.includes(profileUsername);

  let usersList = [];
  if (type === 'followers') {
    const otherUsers = Object.values(allUsers).filter(u => u.username !== profileUsername);
    usersList = otherUsers.slice(0, 4).map(u => ({
      name: u.displayName,
      username: u.username,
      role: u.role,
      avatar: u.avatar
    }));
    if (profileUsername !== currentUser && isFollowingTarget) {
      const meUser = getUserByUsername(currentUser);
      if (meUser && !usersList.some(u => u.username === currentUser)) {
        usersList.unshift({
          name: meUser.displayName,
          username: meUser.username,
          role: meUser.role || 'You',
          avatar: meUser.avatar
        });
      }
    }
  } else {
    // following
    if (profileUsername === currentUser) {
      usersList = following.map(uName => {
        const u = getUserByUsername(uName);
        return u ? {
          name: u.displayName,
          username: u.username,
          role: u.role,
          avatar: u.avatar
        } : {
          name: uName.charAt(0).toUpperCase() + uName.slice(1),
          username: uName,
          role: 'Member',
          avatar: uName.charAt(0).toUpperCase()
        };
      });
    } else {
      const otherUsers = Object.values(allUsers).filter(u => u.username !== profileUsername);
      usersList = otherUsers.slice(2, 5).map(u => ({
        name: u.displayName,
        username: u.username,
        role: u.role,
        avatar: u.avatar
      }));
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>{type}</h3>
          <button onClick={onClose} className={styles.closeBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          {usersList.length === 0 ? (
            <div className={styles.empty}>
              No {type} yet.
            </div>
          ) : (
            usersList.map((user, i) => (
              <div key={i} className={styles.userItem}>
                <div className={styles.userAvatar}>
                  {user.avatar && user.avatar.length === 1 ? user.avatar : <img src={user.avatar} alt="avatar" className={styles.avatarImg} />}
                </div>
                <div className={styles.userInfo}>
                  <div className={styles.userName}>{user.name}</div>
                  <div className={styles.userUsername}>@{user.username}</div>
                </div>
                <FollowButton targetUsername={user.username} size="sm" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
