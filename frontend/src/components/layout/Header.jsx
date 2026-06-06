import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { showToast } from '../../utils/toast';
import logo from '../../assets/images/logo.webp';
import glaCrest from '../../assets/images/gla-crest.png';
import GlobalSearch from '../search/GlobalSearch';
import styles from './Header.module.css';

export default function Header({ variant = 'dashboard' }) {
  const { username, initial, logout, currentUser } = useAuth();
  const { searchQuery, setSearchQuery } = useData();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.startsWith('/messages') ? 'messages' : '';
  const dropdownRef = useRef(null);

  useEffect(() => {
    const close = () => setDropdownOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };



  return (
    <header className={`${styles.header} ${activeTab === 'messages' ? styles.headerMessages : ''}`}>
      <div className={styles.navLeft} onClick={() => navigate('/home')}>
        <span className={styles.brand}>Meetify</span>
      </div>

      {variant === 'dashboard' && (
        <div className={styles.headerSearch}>
          <GlobalSearch />
        </div>
      )}

      {variant === 'dashboard' ? (
        <nav className={styles.nav}>
          <button className={styles.collegeBtn} onClick={() => navigate('/colleges/gla')}>
            <img src="/images/gla-logo.png" alt="GLA University" />
            <span>GLA University</span>
          </button>
          <div className={styles.notifIcon} title="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className={styles.notifBadge}>3</span>
          </div>
          <div className={styles.avatarWrap}>
            <div
              className={styles.userAvatar}
              onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}
            >
              {currentUser?.avatar && currentUser.avatar.length > 1 ? (
                <img src={currentUser.avatar} alt="user avatar" className={styles.userAvatarImg} />
              ) : (
                initial
              )}
            </div>
            <div className={`${styles.dropdown}${dropdownOpen ? ` ${styles.open}` : ''}`} ref={dropdownRef}>
              <button onClick={() => navigate('/profile')}>Profile</button>
              <button onClick={() => showToast('Account details coming soon')}>Account</button>
              <button onClick={() => showToast('Settings coming soon')}>Settings</button>
              <div className={styles.divider} />
              <button className={styles.logoutBtn} onClick={handleLogout}>Log out</button>
            </div>
          </div>
        </nav>
      ) : (
        <nav className={styles.nav}>
          <a href="/">Home</a>
          <a href="#">Features</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>
      )}
    </header>
  );
}
