import { useFollow } from '../../context/FollowContext';
import { useAuth } from '../../context/AuthContext';
import FollowButton from './FollowButton';

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
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }} onClick={onClose}>
      <div 
        style={{
          background: '#fff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '400px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(24, 24, 27, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#18181B', textTransform: 'capitalize' }}>
            {type}
          </h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#71717A', cursor: 'pointer', display: 'flex'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div style={{
          padding: '1.5rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {users.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#71717A', padding: '2rem 0' }}>
              No {type} yet.
            </div>
          ) : (
            users.map((user, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(109, 93, 252, 0.2), rgba(168, 85, 247, 0.2))',
                  color: '#6D5DFC',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '1rem', flexShrink: 0
                }}>
                  {user.name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: '#18181B', fontSize: '0.9rem' }}>{user.name}</div>
                  <div style={{ color: '#71717A', fontSize: '0.8rem' }}>@{user.username}</div>
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
