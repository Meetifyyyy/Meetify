import { useState, useRef, useEffect } from 'react';
import { isImageUrl } from '../../utils/avatar';
import DefaultAvatar from '../common/DefaultAvatar';
import { useData } from '../../context/DataContext';
import ShareActivityModal from './ShareActivityModal';
import styles from './CrewCard.module.css';

export default function CrewCard({ activity, onClick }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const { 
    title, description, dateLabel, time, location,
    hostName, hostAvatar, slotsNeeded, slotsFilled, category
  } = activity;

  const { savedActivities, toggleSaveActivity, joinCrewActivity, requestToJoinActivity, currentUser } = useData();
  
  const hasRequested = activity.pendingRequests?.includes(currentUser?.id);
  const isSaved = savedActivities?.includes(activity.id);
  const isJoined = activity.participants?.includes(currentUser?.id);
  const isApproval = activity.participationType === 'approval';

  const handleSave = (e) => {
    e.stopPropagation();
    toggleSaveActivity(activity.id);
  };

  const filled = Math.min(slotsFilled, slotsNeeded);

  // Helper to determine icon and badge based on category or tags
  const getIcon = () => {
    switch (category) {
      case 'Sports':
      case 'Health & Fitness':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line>
          </svg>
        );
      case 'Gaming':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="6" y1="12" x2="10" y2="12"></line><line x1="8" y1="10" x2="8" y2="14"></line><line x1="15" y1="13" x2="15.01" y2="13"></line><line x1="18" y1="11" x2="18.01" y2="11"></line><rect x="2" y="6" width="20" height="12" rx="2"></rect>
          </svg>
        );
      case 'Creative':
      case 'Event':
      case 'Social':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
        );
      default:
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        );
    }
  };

  const getBadge = () => {
    if (category === 'Health & Fitness') return { text: 'Easy', class: styles.badgeGreen };
    if (category === 'Gaming') return { text: 'Casual', class: styles.badgeBlue };
    if (category === 'Creative') return { text: 'Anyone', class: styles.badgePurple };
    return { text: 'Open', class: styles.badgeGray };
  };

  const badge = getBadge();

  return (
    <article className={styles.card} onClick={onClick}>
      
      <div className={styles.iconContainer}>
        {getIcon()}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        
        <div className={styles.metaRow}>
          <div className={styles.metaItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>{dateLabel}</span>
          </div>
          <span className={styles.dot}>•</span>
          <div className={styles.metaItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>{time}</span>
          </div>
          <span className={styles.dot}>•</span>
          <div className={styles.metaItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{location}</span>
          </div>
        </div>
        
        <div className={styles.metaRow}>
          <div className={styles.metaItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>{filled} / {slotsNeeded} joined</span>
          </div>
          <span className={`${styles.badge} ${badge.class}`}>{badge.text}</span>
        </div>
      </div>

      <div className={styles.rightColumn}>
        <div className={styles.menuContainer} ref={menuRef}>
          <button className={styles.moreBtn} aria-label="More options" onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>
            </svg>
          </button>
          {showMenu && (
            <div className={styles.dropdownMenu}>
              <button className={styles.dropdownItem} onClick={(e) => { e.stopPropagation(); alert('Host reported.'); setShowMenu(false); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                Report Host
              </button>
              <button className={styles.dropdownItem} onClick={(e) => { e.stopPropagation(); alert('Activities hidden.'); setShowMenu(false); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                Hide activities from this person
              </button>
              <button className={styles.dropdownItem} onClick={(e) => { e.stopPropagation(); setShowShareModal(true); setShowMenu(false); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                Share
              </button>
            </div>
          )}
        </div>

        <div className={styles.hostInfo}>
          <span className={styles.hostLabel}>Organized by</span>
          <div className={styles.hostProfile}>
            {isImageUrl(hostAvatar) ? (
              <img src={hostAvatar} alt={hostName} className={styles.avatar} />
            ) : (
              <DefaultAvatar className={styles.avatar} />
            )}
            <span className={styles.hostName}>{hostName}</span>
          </div>
        </div>

        <div className={styles.actionRow}>
          <button 
            className={`${styles.joinBtn} ${(isJoined || hasRequested) ? styles.joinedBtn : ''}`} 
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (isJoined || hasRequested) return;
              if (isApproval) {
                requestToJoinActivity(activity.id);
              } else {
                joinCrewActivity(activity.id);
              }
            }}
          >
            {isJoined ? 'Joined' : hasRequested ? 'Requested' : isApproval ? 'Request' : 'Join'}
          </button>
          <button className={styles.saveBtn} aria-label={isSaved ? "Unsave" : "Save"} onClick={handleSave}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isSaved ? styles.savedIcon : ""}>
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </div>
      </div>

      <ShareActivityModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        activity={activity}
      />
    </article>
  );
}
