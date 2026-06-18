import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { isImageUrl } from '../../utils/avatar';
import DefaultAvatar from '../common/DefaultAvatar';
import styles from './Sidebar.module.css';

export default function Sidebar({ onCommunityClick }) {
  const { initial, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const displayName = currentUser?.displayName || currentUser?.username || '';
  const username = currentUser?.username || '';

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarUser}>
        <div className={styles.sidebarAvatar}>
          {isImageUrl(currentUser?.avatar) ? (
            <img src={currentUser.avatar} alt={displayName} className={styles.sidebarAvatarImg} />
          ) : (
            <DefaultAvatar />
          )}
        </div>
        <div>
          <div className={styles.sidebarName}>{displayName}</div>
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
        <a
          href="#"
          className={`${styles.sidebarLink}${location.pathname.startsWith('/search') ? ` ${styles.active}` : ''}`}
          onClick={(e) => { e.preventDefault(); navigate('/search'); }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Search
        </a>
        <a
          href="#"
          className={`${styles.sidebarLink}${location.pathname.startsWith('/crew') ? ` ${styles.active}` : ''}`}
          onClick={(e) => { e.preventDefault(); navigate('/crew'); }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
          Find your crew
        </a>

      </nav>
    </aside>
  );
}
