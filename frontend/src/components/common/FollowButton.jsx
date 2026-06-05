import { useFollow } from '../../context/FollowContext';
import { useAuth } from '../../context/AuthContext';

export default function FollowButton({ targetUsername, size = 'md' }) {
  const { following, toggleFollow } = useFollow();
  const { username } = useAuth();

  if (!targetUsername || targetUsername === username) {
    return null; // Don't show follow button for yourself
  }

  const isFollowing = following.includes(targetUsername);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFollow(targetUsername);
  };

  const btnStyle = {
    padding: size === 'sm' ? '0.25rem 0.75rem' : '0.45rem 1.1rem',
    fontSize: size === 'sm' ? '0.75rem' : '0.8rem',
    fontFamily: 'Manrope, sans-serif',
    fontWeight: 600,
    borderRadius: '100px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: isFollowing ? '1px solid rgba(24, 24, 27, 0.15)' : 'none',
    background: isFollowing ? 'transparent' : 'linear-gradient(135deg, #6D5DFC, #A855F7)',
    color: isFollowing ? '#18181B' : '#fff',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
  };

  return (
    <button onClick={handleClick} style={btnStyle} className="follow-btn">
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}
