import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

export default function Sidebar({ onCommunityClick }) {
  const { username, initial } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const communityItems = [
    { id: 'design', name: 'Design Buddies', letter: 'D', members: '12.4k', gradient: 'linear-gradient(135deg, #EC4899, #F97316)' },
    { id: 'aiml', name: 'AI/ML Enthusiasts', letter: 'A', members: '8.2k', gradient: 'linear-gradient(135deg, #3B82F6, #06B6D4)' },
    { id: 'startup', name: 'Startup Hub', letter: 'S', members: '6.7k', gradient: 'linear-gradient(135deg, #22C55E, #10B981)' },
    { id: 'hackathon', name: 'Hackathon Heroes', letter: 'H', members: '4.1k', gradient: 'linear-gradient(135deg, #A855F7, #EC4899)' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarUser}>
        <div className={styles.sidebarAvatar}>{initial}</div>
        <div>
          <div className={styles.sidebarName}>{username}</div>
          <div className={styles.sidebarUsername}>@{username}</div>
          <div className={styles.sidebarStatus}>Online</div>
        </div>
      </div>

      <nav className={styles.sidebarNav}>
        <a
          href="#"
          className={`${styles.sidebarLink}${location.pathname === '/home' ? ` ${styles.active}` : ''}`}
          onClick={(e) => { e.preventDefault(); navigate('/home'); }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Home
        </a>
        <a
          href="#"
          className={`${styles.sidebarLink}${location.pathname.startsWith('/communities') ? ` ${styles.active}` : ''}`}
          onClick={(e) => { e.preventDefault(); navigate('/communities'); }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Communities
        </a>
        <a
          href="#"
          className={`${styles.sidebarLink}${location.pathname.startsWith('/messages') ? ` ${styles.active}` : ''}`}
          onClick={(e) => { e.preventDefault(); navigate('/messages'); }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          Messages
        </a>
      </nav>

      <div className={styles.sidebarSection}>
        <div className={styles.sidebarSectionTitle}>Top Communities</div>
        {communityItems.map((c) => (
          <div key={c.id} className={styles.communityItem} onClick={() => onCommunityClick(c.id)}>
            <div className={styles.communityAvatar} style={{ background: c.gradient }}>{c.letter}</div>
            <div className={styles.communityInfo}>
              <div className={styles.communityName}>{c.name}</div>
              <div className={styles.communityMeta}>{c.members} members</div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
