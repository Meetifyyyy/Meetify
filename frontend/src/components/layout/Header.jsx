import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { showToast } from '../../utils/toast';
import { isImageUrl } from '../../utils/avatar';
import DefaultAvatar from '../common/DefaultAvatar';
import GlobalSearch from '../search/GlobalSearch';
import NotificationsMenu from './NotificationsMenu';
import { useNotifications } from '../../context/NotificationContext';
import styles from './Header.module.css';

export default function Header({ variant = 'dashboard' }) {
  const { initial, logout, currentUser } = useAuth();
  const { searchQuery, setSearchQuery, communities } = useData();
  const { unreadCount } = useNotifications();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.startsWith('/messages') ? 'messages' : '';
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const close = () => {
      setDropdownOpen(false);
      setNotifOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Only show college button if the user actually has a college
  const userCollege = currentUser?.collegeId ? communities[currentUser.collegeId] : null;

  return (
    <header className={`${styles.header} ${activeTab === 'messages' ? styles.headerMessages : ''}`}>
      <div className={styles.navLeft}>
        <button className={styles.hamburgerBtn} onClick={() => setDrawerOpen(true)}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <span className={styles.brand} onClick={() => navigate('/home')} style={{cursor: 'pointer'}}>Meetify</span>
      </div>

      {/* Mobile Drawer */}
      <div className={`${styles.mobileDrawer} ${drawerOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <span className={styles.brand}>Meetify</span>
          <button className={styles.closeDrawerBtn} onClick={() => setDrawerOpen(false)}>✕</button>
        </div>
        <div className={styles.drawerLinks}>
          <button onClick={() => { navigate('/home'); setDrawerOpen(false); }}>Home</button>
          <button onClick={() => { navigate('/communities'); setDrawerOpen(false); }}>Communities</button>
          <button onClick={() => { navigate('/messages'); setDrawerOpen(false); }}>Messages</button>
          <button onClick={() => { navigate('/search'); setDrawerOpen(false); }}>Search</button>
          <button onClick={() => { navigate('/crew'); setDrawerOpen(false); }}>Find your crew</button>

          <button onClick={() => { navigate('/profile'); setDrawerOpen(false); }}>Profile</button>
          <button onClick={() => { navigate('/settings'); setDrawerOpen(false); }}>Settings</button>
        </div>
      </div>
      {drawerOpen && <div className={styles.drawerOverlay} onClick={() => setDrawerOpen(false)} />}

      {variant === 'dashboard' && (
        <div className={styles.headerSearch}>
          <GlobalSearch />
        </div>
      )}

      {variant === 'dashboard' ? (
        <nav className={styles.nav}>
          {userCollege && (
            <button className={styles.collegeBtn} onClick={() => navigate(`/colleges/${currentUser.collegeId}`)}>
              {isImageUrl(userCollege.avatar) && (
                <img src={userCollege.avatar} alt={userCollege.name} />
              )}
              <span>{userCollege.name}</span>
            </button>
          )}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              className={styles.notifIcon}
              aria-label="Notifications"
              title="Notifications"
              onClick={(e) => { e.stopPropagation(); setNotifOpen(!notifOpen); setDropdownOpen(false); }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {/* Unread badge — only shown when there are unread notifications */}
              {unreadCount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  minWidth: 16,
                  height: 16,
                  padding: '0 4px',
                  background: 'var(--color-primary)',
                  borderRadius: 8,
                  border: '2px solid var(--color-bg-white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: '#fff',
                  lineHeight: 1,
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </div>
              )}
            </button>
            <NotificationsMenu isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
          </div>
          <div className={styles.avatarWrap}>
            <div
              className={styles.userAvatar}
              onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
              role="button"
              aria-label="User menu"
              aria-expanded={dropdownOpen}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}}
            >
              {isImageUrl(currentUser?.avatar) ? (
                <img src={currentUser.avatar} alt={currentUser?.displayName || 'user avatar'} className={styles.userAvatarImg} />
              ) : (
                <DefaultAvatar />
              )}
            </div>
            <div className={`${styles.dropdown}${dropdownOpen ? ` ${styles.open}` : ''}`} ref={dropdownRef}>
              <button onClick={() => navigate('/profile')}>Profile</button>
              <button onClick={() => showToast('Account details coming soon')}>Account</button>
              <button onClick={() => navigate('/settings')}>Settings</button>
              <div className={styles.divider} />
              <button className={styles.logoutBtn} onClick={handleLogout}>Log out</button>
            </div>
          </div>
        </nav>
      ) : (
        <nav className={styles.nav}>
          <a href="/">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      )}
    </header>
  );
}
