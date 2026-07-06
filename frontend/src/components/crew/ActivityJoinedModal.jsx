import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import styles from './ActivityJoinedModal.module.css';

export default function ActivityJoinedModal({ activity, isOpen, onClose }) {
  const overlayRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && overlayRef.current) {
      requestAnimationFrame(() => overlayRef.current?.classList.add(styles.open));
    }
  }, [isOpen]);

  if (!isOpen || !activity) return null;

  const handleClose = () => {
    overlayRef.current?.classList.remove(styles.open);
    setTimeout(onClose, 200);
  };

  const handleOpenGroup = () => {
    overlayRef.current?.classList.remove(styles.open);
    setTimeout(() => {
      onClose();
      const chatId = String(activity.id).startsWith('act_') ? activity.id : `act_${activity.id}`;
      navigate(`/messages/${chatId}`);
    }, 150);
  };

  return createPortal(
    <div 
      className={styles.overlay} 
      ref={overlayRef} 
      onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}
    >
      <div className={styles.modal}>
        <div className={styles.iconWrapper}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        </div>

        <h3 className={styles.title}>Activity Joined!</h3>
        <p className={styles.subtitle}>
          A temporary group chat has been created in Messages to coordinate with the host and other participants.
        </p>

        <div className={styles.detailsBox}>
          <div className={styles.actTitle}>{activity.title}</div>
          
          {activity.hostName && (
            <div className={styles.detailRow}>
              <span className={styles.detailIcon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <span>Hosted by {activity.hostName}</span>
            </div>
          )}

          {(activity.dateLabel || activity.time) && (
            <div className={styles.detailRow}>
              <span className={styles.detailIcon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </span>
              <span>{[activity.dateLabel, activity.time].filter(Boolean).join(' • ')}</span>
            </div>
          )}

          {activity.location && (
            <div className={styles.detailRow}>
              <span className={styles.detailIcon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </span>
              <span>{activity.location}</span>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button className={styles.btnOkay} onClick={handleClose}>
            Okay
          </button>
          <button className={styles.btnOpen} onClick={handleOpenGroup}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            Open Group
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
