import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { showToast } from '../../utils/toast';
import { isImageUrl } from '../../utils/avatar';
import DefaultAvatar from '../common/DefaultAvatar';
import GlobalSearch from '../search/GlobalSearch';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './Header.module.css';

export default function Header({ variant = 'dashboard' }) {
  const { initial, logout, currentUser } = useAuth();
  const { searchQuery, setSearchQuery, communities } = useData();
  const { unreadCount } = useNotifications();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.startsWith('/messages') ? 'messages' : '';
  const isHomePage = location.pathname === '/home' || location.pathname === '/';
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const avatarRef = useRef(null);

  useEffect(() => {
    const close = () => {
      setDropdownOpen(false);
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
    <header className={`${styles.header} ${activeTab === 'messages' ? styles.headerMessages : ''} ${!isHomePage ? styles.hideOnMobile : ''}`}>
      <div className={styles.navLeft}>
        <span className={styles.brand} onClick={() => navigate('/home')} style={{cursor: 'pointer'}}>Meetifyy</span>
      </div>

      {/* Mobile Drawer */}
      <div className={`${styles.mobileDrawer} ${drawerOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <span className={styles.brand}>Meetifyy</span>
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
          <button
            className={`${styles.notifIcon} ${styles.themeToggleBtn}`}
            aria-label="Toggle theme"
            title="Toggle theme"
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              className={styles.notifIcon}
              aria-label="Notifications"
              title="Notifications"
              onClick={(e) => { e.stopPropagation(); navigate('/notifications'); setDropdownOpen(false); }}
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

          </div>
          <div className={styles.avatarWrap}>
            <div
              ref={avatarRef}
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
            <div className={`${styles.dropdown} ${dropdownOpen ? styles.dropdownOpen : ''}`} ref={dropdownRef}>
              <button 
                onClick={() => { navigate('/profile'); setDropdownOpen(false); }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Profile
              </button>
              
              <button 
                onClick={(e) => { 
                  // Instantly hide the menu synchronously so it is NOT captured in the old screenshot
                  if (dropdownRef.current) {
                    dropdownRef.current.style.display = 'none';
                  }
                  
                  // Wait for the next paint frame so the hidden menu is registered
                  requestAnimationFrame(() => {
                    let x = e.clientX;
                    let y = e.clientY;
                    
                    // Use avatar as the center of the radial sweep
                    if (avatarRef.current) {
                      const rect = avatarRef.current.getBoundingClientRect();
                      x = rect.left + rect.width / 2;
                      y = rect.top + rect.height / 2;
                    }
                    
                    // Pass a mock event object with the correct coordinates
                    toggleTheme({ clientX: x, clientY: y });
                    
                    // Cleanup state
                    setDropdownOpen(false);
                    if (dropdownRef.current) {
                      dropdownRef.current.style.display = '';
                    }
                  });
                }}
              >
                {theme === 'light' ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                )}
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
              
              <div className={styles.divider} />
              
              <button className={styles.logoutBtn} onClick={handleLogout}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Log out
              </button>
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
