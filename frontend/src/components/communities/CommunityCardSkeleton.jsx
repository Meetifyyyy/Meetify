import styles from './CommunityCard.module.css';
import Skeleton from '../common/Skeleton';

export default function CommunityCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.cardCover}>
        <Skeleton type="rect" width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, borderRadius: 0 }} />
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardAvatar} style={{ border: 'none', background: 'transparent' }}>
          <Skeleton type="circle" width="58px" height="58px" style={{ border: '3px solid var(--color-bg-white)' }} />
        </div>
        <Skeleton type="text" width="60%" height="1.2rem" style={{ marginTop: '0.2rem' }} />
        <Skeleton type="text" width="100%" height="0.8rem" />
        <Skeleton type="text" width="80%" height="0.8rem" />
        
        <div className={styles.cardFooter} style={{ marginTop: 'auto', paddingTop: '1rem' }}>
          <Skeleton type="text" width="50%" height="0.8rem" style={{ marginBottom: 0 }} />
          <Skeleton type="rect" width="64px" height="28px" style={{ borderRadius: '100px' }} />
        </div>
      </div>
    </div>
  );
}
