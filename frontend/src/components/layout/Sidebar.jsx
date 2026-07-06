import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { isImageUrl } from '../../utils/avatar';
import DefaultAvatar from '../common/DefaultAvatar';
import styles from './Sidebar.module.css';
import {
  HomeIcon as HomeOutline,
  MagnifyingGlassIcon as SearchOutline,
  ChatBubbleOvalLeftEllipsisIcon as MessagesOutline,
  UserGroupIcon as CommunitiesOutline,
  UserIcon as ProfileOutline,
  Cog6ToothIcon as SettingsOutline,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeSolid,
  MagnifyingGlassIcon as SearchSolid,
  ChatBubbleOvalLeftEllipsisIcon as MessagesSolid,
  UserGroupIcon as CommunitiesSolid,
  UserIcon as ProfileSolid,
  Cog6ToothIcon as SettingsSolid,
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

export default function Sidebar({ onCommunityClick }) {
  const { initial, currentUser } = useAuth();
  const { communities } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCommunitiesMenuOpen, setIsCommunitiesMenuOpen] = useState(false);

  const username = currentUser?.username || '';
  
  const joinedCommunityObjects = (currentUser?.communities || []).map(commName => {
    return Object.values(communities).find(c => c.name === commName) || { name: commName, id: commName.toLowerCase().replace(/\s+/g, ''), avatar: commName.charAt(0) };
  });

  return (
    <aside className={styles.sidebar}>
      

      {/* 2. Navigation Card */}
      <div className={`${styles.sidebarCard} ${styles.navCard}`}>
        <nav className={styles.sidebarNav}>
          <a
            href="#"
            className={`${styles.sidebarLink}${location.pathname === '/home' ? ` ${styles.active}` : ''}`}
            onClick={(e) => { e.preventDefault(); navigate('/home'); }}
          >
            {location.pathname === '/home' ? (
              <HomeSolid />
            ) : (
              <HomeOutline />
            )}
            <span className={styles.linkText}>Home</span>
          </a>
          
          <a
            href="#"
            className={`${styles.sidebarLink}${location.pathname.startsWith('/feed') || location.pathname.startsWith('/search') ? ` ${styles.active}` : ''}`}
            onClick={(e) => { e.preventDefault(); navigate('/search'); }}
          >
            {location.pathname.startsWith('/feed') || location.pathname.startsWith('/search') ? (
              <SearchSolid />
            ) : (
              <SearchOutline />
            )}
            <span className={styles.linkText}>Search</span>
          </a>

          <a
            href="#"
            className={`${styles.sidebarLink}${location.pathname.startsWith('/messages') ? ` ${styles.active}` : ''}`}
            onClick={(e) => { e.preventDefault(); navigate('/messages'); }}
          >
            {location.pathname.startsWith('/messages') ? (
              <MessagesSolid />
            ) : (
              <MessagesOutline />
            )}
            <span className={styles.linkText}>Messages</span>
          </a>

          <a
            href="#"
            className={`${styles.sidebarLink}${location.pathname.startsWith('/crew') ? ` ${styles.active}` : ''}`}
            onClick={(e) => { e.preventDefault(); navigate('/crew'); }}
          >
            {location.pathname.startsWith('/crew') ? (
              <CompassSolid />
            ) : (
              <CompassOutline />
            )}
            <span className={styles.linkText}>Find your crew</span>
          </a>
          
          <a
            href="#"
            className={`${styles.sidebarLink}${location.pathname.startsWith('/profile') ? ` ${styles.active}` : ''}`}
            onClick={(e) => { e.preventDefault(); navigate(`/profile/${username}`); }}
          >
            {location.pathname.startsWith('/profile') ? (
              <ProfileSolid />
            ) : (
              <ProfileOutline />
            )}
            <span className={styles.linkText}>Profile</span>
          </a>

          <a
            href="#"
            className={`${styles.sidebarLink}${location.pathname.startsWith('/settings') ? ` ${styles.active}` : ''}`}
            onClick={(e) => { e.preventDefault(); navigate('/settings'); }}
          >
            {location.pathname.startsWith('/settings') ? (
              <SettingsSolid />
            ) : (
              <SettingsOutline />
            )}
            <span className={styles.linkText}>Settings</span>
          </a>
        </nav>
      </div>

      {/* Communities Boxed Menu */}
      <div className={styles.communitiesBox}>
        <div 
          className={styles.communitiesHeader} 
          onClick={() => setIsCommunitiesMenuOpen(!isCommunitiesMenuOpen)}
        >
          <span>COMMUNITIES</span>
          {isCommunitiesMenuOpen ? (
            <ChevronUpIcon className={styles.chevronIcon} />
          ) : (
            <ChevronDownIcon className={styles.chevronIcon} />
          )}
        </div>
        
        {isCommunitiesMenuOpen && (
          <div className={styles.communitiesList}>
            {joinedCommunityObjects.map(comm => (
              <a
                key={comm.id}
                href="#"
                className={styles.communityItem}
                onClick={(e) => { e.preventDefault(); navigate(`/communities/${comm.id}`); }}
              >
                <div 
                  className={styles.communityAvatar}
                  style={comm.avatar && comm.avatar.startsWith('/') ? { background: 'transparent' } : { background: comm.color || 'var(--color-primary)' }}
                >
                  {comm.avatar && comm.avatar.startsWith('/') ? (
                    <img src={comm.avatar} alt={comm.name} />
                  ) : (
                    comm.avatar || comm.name.charAt(0)
                  )}
                </div>
                <span>{comm.name}</span>
              </a>
            ))}
            
            <a
              href="#"
              className={styles.exploreMore}
              onClick={(e) => { e.preventDefault(); navigate('/communities'); }}
            >
              <CommunitiesOutline className={styles.exploreIcon} />
              <span>Explore more...</span>
            </a>
          </div>
        )}
      </div>
    </aside>
  );
}
