import styles from './RightPanel.module.css';

export default function RightPanel({ children }) {
  return <aside className={styles.rightPanel}>{children}</aside>;
}

export function QuickActions({ actions }) {
  return (
    <div className={styles.panelCard}>
      <h3 className={styles.panelTitle}>Quick Actions</h3>
      {actions.map((a, i) => (
        <button key={i} className={styles.actionBtn} onClick={a.onClick}>
          {a.icon}
          {a.label}
        </button>
      ))}
    </div>
  );
}

export function OnlineFriends() {
  const friends = [
    { name: 'Alice', letter: 'A', status: 'Online', online: true },
    { name: 'Bob', letter: 'B', status: 'Online', online: true },
    { name: 'Charlie', letter: 'C', status: 'Away', online: false },
    { name: 'Diana', letter: 'D', status: 'Offline', online: false },
  ];

  return (
    <div className={styles.panelCard}>
      <h3 className={styles.panelTitle}>Online Friends</h3>
      {friends.map((f, i) => (
        <div key={i} className={styles.friendItem}>
          <div className={styles.friendAvatar}>{f.letter}</div>
          <div className={styles.friendInfo}>
            <div className={styles.friendName}>{f.name}</div>
            <div className={`${styles.friendStatus}${f.online ? ` ${styles.online}` : ''}`}>{f.status}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function UpcomingEvents() {
  return (
    <div className={styles.panelCard}>
      <h3 className={styles.panelTitle}>Upcoming</h3>
      <div className={styles.eventItem}>
        <div className={styles.eventDate}>Today<br /><span>3PM</span></div>
        <div className={styles.eventDetail}>
          <div className={styles.eventName}>Team Standup</div>
          <div className={styles.eventMeta}>30 min</div>
        </div>
      </div>
      <div className={styles.eventItem}>
        <div className={styles.eventDate}>Fri<br /><span>11AM</span></div>
        <div className={styles.eventDetail}>
          <div className={styles.eventName}>Design Review</div>
          <div className={styles.eventMeta}>1 hr</div>
        </div>
      </div>
    </div>
  );
}
