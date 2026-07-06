import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import GlobalSearch from '../search/GlobalSearch';
import styles from './BottomNav.module.css';
import {
  HomeIcon as HomeOutline,
  MagnifyingGlassIcon as SearchOutline,
  ChatBubbleOvalLeftEllipsisIcon as MessagesOutline,
  UserGroupIcon as CommunitiesOutline,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolid,
  MagnifyingGlassIcon as SearchSolid,
  ChatBubbleOvalLeftEllipsisIcon as MessagesSolid,
  UserGroupIcon as CommunitiesSolid,
} from '@heroicons/react/24/solid';

const CompassOutline = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const CompassSolid = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchQuery, setSearchQuery } = useData();

  const handleTabClick = (path) => {
    navigate(path);
  };

  const { currentUser } = useAuth();
  const username = currentUser?.username || '';
  
  const isHomeActive = location.pathname === '/home';
  const isSearchActive = location.pathname.startsWith('/search');
  const isMessagesActive = location.pathname.startsWith('/messages');
  const isCommunitiesActive = location.pathname.startsWith('/communities');
  const isCrewActive = location.pathname.startsWith('/crew');

  return (
    <div className={styles.bottomNav}>
      <button 
        className={`${styles.bottomNavItem}${isHomeActive ? ` ${styles.active}` : ''}`}
        onClick={() => handleTabClick('/home')}
      >
        {isHomeActive ? <HomeSolid /> : <HomeOutline />}
        <span>Home</span>
      </button>

      <button 
        className={`${styles.bottomNavItem}${isSearchActive ? ` ${styles.active}` : ''}`}
        onClick={() => {
           if (location.pathname !== '/search') navigate('/search');
        }}
      >
        {isSearchActive ? <SearchSolid /> : <SearchOutline />}
        <span>Search</span>
      </button>

      <button 
        className={`${styles.bottomNavItem}${isMessagesActive ? ` ${styles.active}` : ''}`}
        onClick={() => handleTabClick('/messages')}
      >
        {isMessagesActive ? <MessagesSolid /> : <MessagesOutline />}
        <span>Messages</span>
      </button>

      <button 
        className={`${styles.bottomNavItem}${isCommunitiesActive ? ` ${styles.active}` : ''}`}
        onClick={() => handleTabClick('/communities')}
      >
        {isCommunitiesActive ? <CommunitiesSolid /> : <CommunitiesOutline />}
        <span>Communities</span>
      </button>

      <button 
        className={`${styles.bottomNavItem}${isCrewActive ? ` ${styles.active}` : ''}`}
        onClick={() => handleTabClick('/crew')}
      >
        {isCrewActive ? <CompassSolid /> : <CompassOutline />}
        <span>Crew</span>
      </button>
    </div>
  );
}
