import { useFollow } from '../../context/FollowContext';
import { useAuth } from '../../context/AuthContext';
import FollowButton from './FollowButton';
import styles from './UserListModal.module.css';

export default function UserListModal({ type, profileUsername, onClose }) {
  const { following } = useFollow();
  const { username: currentUser } = useAuth();
  const isFollowingTarget = following.includes(profileUsername);

  let users = [];
  if (type === 'followers') {
    users = [
      { name: 'Alice', username: 'alice', role: 'Designer' },
      { name: 'Marcus', username: 'marcus', role: 'Developer' },
      { name: 'Priya', username: 'priya', role: 'Product Manager' },
      { name: 'Jordan', username: 'jordan', role: 'Engineer' }
    ];
    if (profileUsername !== currentUser && isFollowingTarget) {
      users.unshift({
        name: currentUser.charAt(0).toUpperCase() + currentUser.slice(1),
        username: currentUser,
        role: 'You'
      });
    }
  } else {
    // following
    if (profileUsername === currentUser) {
      users = following.map(u => ({
        name: u.charAt(0).toUpperCase() + u.slice(1),
        username: u,
        role: 'Community Member'
      }));
    } else {
      users = [
        { name: 'Marcus', username: 'marcus', role: 'Developer' },
        { name: 'Priya', username: 'priya', role: 'Product Manager' }
      ];
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
          {users.length === 0 ? (
            <div className={styles.empty}>
              No {type} yet.
            </div>
          ) : (
            users.map((user, i) => (
              <div key={i} className={styles.userItem}>
                <div className={styles.userAvatar}>
                  {user.name.charAt(0)}
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
