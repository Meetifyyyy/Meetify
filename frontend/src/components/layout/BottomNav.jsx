import { useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import GlobalSearch from '../search/GlobalSearch';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchQuery, setSearchQuery } = useData();

  const handleTabClick = (path) => {
    navigate(path);
  };

  const isHomeActive = location.pathname === '/home';
  const isCommunitiesActive = location.pathname.startsWith('/communities');
  const isMessagesActive = location.pathname.startsWith('/messages');
  const isCollegesActive = location.pathname.startsWith('/colleges');
  const isSearchActive = location.pathname.startsWith('/search');

  return (
    <div className={styles.bottomNav}>
      <button 
        className={`${styles.bottomNavItem}${isHomeActive ? ` ${styles.active}` : ''}`}
        onClick={() => handleTabClick('/home')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>Home</span>
      </button>

      <button 
        className={`${styles.bottomNavItem}${isCommunitiesActive ? ` ${styles.active}` : ''}`}
        onClick={() => handleTabClick('/communities')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <span>Communities</span>
      </button>

      <button 
        className={`${styles.bottomNavItem}${isSearchActive ? ` ${styles.active}` : ''}`}
        onClick={() => {
           if (location.pathname !== '/search') {
             navigate('/search');
           }
        }}
        title="Search"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span>Search</span>
      </button>

      <button 
        className={`${styles.bottomNavItem}${isMessagesActive ? ` ${styles.active}` : ''}`}
        onClick={() => handleTabClick('/messages')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
        <span>Messages</span>
      </button>

      <button 
        className={`${styles.bottomNavItem}${isCollegesActive ? ` ${styles.active}` : ''}`}
        onClick={() => navigate('/colleges')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
        <span>Colleges</span>
      </button>
    </div>
  );
}
