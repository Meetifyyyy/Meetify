import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isImageUrl } from '../../utils/avatar';
import DefaultAvatar from '../common/DefaultAvatar';
import { useData } from '../../context/DataContext';
import ShareActivityModal from './ShareActivityModal';
import ActivityJoinedModal from './ActivityJoinedModal';
import styles from './CrewCard.module.css';

export default function CrewCard({ activity, onClick }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showJoinedModal, setShowJoinedModal] = useState(false);
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
    hostName, hostAvatar, hostUsername, slotsNeeded, slotsFilled,
    category
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



  return (
    <article className={styles.card} onClick={onClick}>
      
      <div 
        className={`${styles.avatarCol} ${styles.clickable}`} 
        onClick={(e) => { e.stopPropagation(); navigate(`/profile/${hostUsername}`); }} 
        style={{ cursor: 'pointer' }}
      >
        {isImageUrl(hostAvatar) ? (
          <img src={hostAvatar} alt={hostName} className={styles.hostAvatar} />
        ) : (
          <DefaultAvatar className={styles.hostAvatar} />
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.topRow}>
          <div className={styles.titleCol}>
            {category && <span className={styles.categoryTag}>{category}</span>}
            <h3 className={styles.title}>{title}</h3>
          </div>
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
        </div>

        <p className={styles.description}>{description}</p>

        <div className={styles.metaRow}>
          <div className={styles.metaLine}>
            <span className={styles.metaItem}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span className={styles.metaText}>{dateLabel}</span>
            </span>
            <span className={styles.metaItem}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span className={styles.metaText}>{time}</span>
            </span>
          </div>
          <div className={styles.metaLine}>
            <span className={styles.metaItem}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span className={styles.metaText}>{location}</span>
            </span>
            <span className={styles.metaItem}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span className={styles.metaText}>{filled}/{slotsNeeded}</span>
            </span>
          </div>
        </div>

        <div className={styles.bottomRow}>
          <div className={styles.byLine}>
            <span 
              className={`${styles.hostName} ${styles.clickable}`} 
              onClick={(e) => { e.stopPropagation(); navigate(`/profile/${hostUsername}`); }}
              style={{ cursor: 'pointer' }}
            >
              {isImageUrl(hostAvatar) ? (
                <img src={hostAvatar} alt={hostName} className={styles.hostAvatarMini} />
              ) : (
                <DefaultAvatar className={styles.hostAvatarMini} />
              )}
              {hostName}
            </span>
          </div>
          
          <div className={styles.actionsGroup}>
            <button 
              className={`${styles.joinBtn} ${(isJoined || hasRequested) ? styles.joinedBtn : ''}`} 
              onClick={async (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (hasRequested) return;
                if (isJoined) {
                  const chatId = String(activity.id).startsWith('act_') ? activity.id : `act_${activity.id}`;
                  navigate(`/messages/${chatId}`);
                  return;
                }
                if (isApproval) {
                  requestToJoinActivity(activity.id);
                } else {
                  await joinCrewActivity(activity.id);
                  setShowJoinedModal(true);
                }
              }}
            >
              {isJoined ? 'Joined' : hasRequested ? 'Requested' : isApproval ? 'Request' : 'Join'}
            </button>
            <button className={`${styles.saveBtn} ${isSaved ? styles.saved : ''}`} aria-label={isSaved ? "Unsave" : "Save"} onClick={handleSave}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <ShareActivityModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        activity={activity}
      />
      <ActivityJoinedModal
        isOpen={showJoinedModal}
        onClose={() => setShowJoinedModal(false)}
        activity={activity}
      />
    </article>
  );
}
