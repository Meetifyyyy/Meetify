import styles from './Post.module.css';

export default function PostSkeleton() {
  const bar = { backgroundColor: '#E7E3DC', borderRadius: '4px', animation: 'skeletonPulse 1.5s infinite' };
  return (
    <div className={styles.post}>
      <div className={styles.postHeader}>
        <div className={styles.postAvatar} style={{ animation: 'skeletonPulse 1.5s infinite', backgroundColor: '#E7E3DC', background: 'none' }}></div>
        <div className={styles.postUser}>
          <div style={{ height: '14px', width: '120px', ...bar, marginBottom: '6px' }}></div>
          <div style={{ height: '10px', width: '80px', ...bar }}></div>
        </div>
      </div>
      <div className={styles.postBody}>
        <div style={{ height: '12px', width: '100%', ...bar, marginBottom: '8px' }}></div>
        <div style={{ height: '12px', width: '85%', ...bar, marginBottom: '8px' }}></div>
        <div style={{ height: '12px', width: '40%', ...bar }}></div>
      </div>
      <div className={styles.postActions}>
        <div style={{ height: '32px', width: '70px', ...bar, borderRadius: '16px' }}></div>
        <div style={{ height: '32px', width: '90px', ...bar, borderRadius: '16px' }}></div>
      </div>
    </div>
  );
}
