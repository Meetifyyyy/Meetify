import { isImageUrl } from '../../utils/avatar';
import DefaultAvatar from '../common/DefaultAvatar';
import styles from './CrewCard.module.css';

export default function CrewCard({ activity, onClick }) {
  const { 
    title, coverImage, dateLabel, time, location,
    hostName, hostAvatar, slotsNeeded, slotsFilled 
  } = activity;

  const filled = Math.min(slotsFilled, slotsNeeded);
  const spotsLeft = slotsNeeded - filled;

  return (
    <article className={styles.card} onClick={onClick}>
      <div className={styles.imageContainer}>
        <img src={coverImage} alt={title} className={styles.image} />
        <div className={styles.dateBadge}>
          {dateLabel}
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {time}
          </div>
          <div className={styles.detailItem}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {location}
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.host}>
            {isImageUrl(hostAvatar) ? (
              <img src={hostAvatar} alt={hostName} className={styles.avatar} />
            ) : (
              <DefaultAvatar className={styles.avatar} />
            )}
            <span className={styles.hostName}>{hostName}</span>
          </div>
          <div className={styles.spots}>
            {spotsLeft > 0 ? `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left` : 'Full'}
          </div>
        </div>
      </div>
    </article>
  );
}
