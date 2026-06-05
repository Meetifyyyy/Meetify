import styles from './CommunityCard.module.css';

export default function CommunityCard({ comm, onClick }) {
  return (
    <div className={styles.commGridCard} onClick={onClick}>
      <div className={styles.commGridCover} style={{ background: comm.color }}>
        <div className={styles.commGridAvatar} style={{ background: comm.color }}>{comm.avatar}</div>
      </div>
      <div className={styles.commGridBody}>
        <div className={styles.commGridNameRow}>
          <span className={styles.commGridOnlineDot} />
          <h3 className={styles.commGridTitle}>{comm.name}</h3>
        </div>
        <p className={styles.commGridDesc}>{comm.desc}</p>
        <div className={styles.commGridFooter}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          </svg>
          <span>{comm.members.toLocaleString()} members</span>
          <span className={styles.commGridOnlineCount}>{comm.online} online</span>
        </div>
      </div>
    </div>
  );
}
