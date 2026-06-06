import { useData } from '../../context/DataContext';
import styles from './RightPanel.module.css';

export default function RightPanel({ children, className = '' }) {
  return <aside className={`${styles.rightPanel} ${className}`.trim()}>{children}</aside>;
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
  const { users, currentUser } = useData();

  const friends = Object.values(users)
    .filter(u => u.id !== currentUser.id)
    .slice(0, 4)
    .map((u, i) => ({
      id: u.id,
      name: u.displayName,
      username: u.username,
      letter: u.avatar,
      status: i < 2 ? 'Online' : (i === 2 ? 'Away' : 'Offline'),
      online: i < 2
    }));

  return (
    <div className={styles.panelCard}>
      <h3 className={styles.panelTitle}>Online Friends</h3>
      {friends.map((f, i) => (
        <div key={i} className={styles.friendItem}>
          <div className={styles.friendAvatar}>
            {f.letter && f.letter.length > 1 ? (
              <img src={f.letter} alt={f.name} className={styles.friendAvatarImg} />
            ) : (
              f.letter
            )}
          </div>
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

export function UniversityEvents({ events, title = 'Ongoing Events' }) {
  if (!events || events.length === 0) return null;

  return (
    <div className={styles.panelCard}>
      <h3 className={styles.panelTitle}>{title}</h3>
      {events.map((e, i) => {
        const dateParts = e.date.split(' ');
        const month = dateParts[0];
        const day = dateParts[1] || '';
        
        return (
          <div key={i} className={styles.eventItem}>
            <div className={styles.eventDate}>{month}<br /><span>{day}</span></div>
            <div className={styles.eventDetail}>
              <div className={styles.eventName}>{e.title}</div>
              <div className={styles.eventMeta}>{e.time} • {e.location}</div>
              {e.desc && <div className={styles.eventDesc}>{e.desc}</div>}
              <button 
                className={styles.actionBtn} 
                style={{ marginTop: '0.4rem', padding: '0.3rem 0.5rem', justifyContent: 'center', background: 'rgba(109, 93, 252, 0.05)', color: 'var(--color-primary)' }}
                onClick={() => {}}
              >
                Register
              </button>
            </div>
          </div>
        );
      })}
      <button className={styles.viewAllBtn}>View All Events</button>
    </div>
  );
}

export function UniversityMembers({ members, title = 'Members' }) {
  if (!members || members.length === 0) return null;

  // Show max 5 members
  const displayMembers = members.slice(0, 5);

  return (
    <div className={styles.panelCard}>
      <h3 className={styles.panelTitle}>{title}</h3>
      {displayMembers.map((m, i) => (
        <div key={i} className={styles.friendItem}>
          <div className={styles.friendAvatar} style={{ background: m.avatar && m.avatar.length > 1 ? 'none' : (m.admin ? 'linear-gradient(135deg, #1D4ED8, #3B82F6)' : undefined) }}>
            {m.avatar && m.avatar.length > 1 ? (
              <img src={m.avatar} alt={m.name} className={styles.friendAvatarImg} />
            ) : (
              m.avatar
            )}
          </div>
          <div className={styles.friendInfo}>
            <div className={styles.friendName}>{m.name} {m.admin && '👑'}</div>
            <div className={styles.memberBranch}>{m.branch} • {m.year}</div>
            <div className={`${styles.friendStatus}${m.online ? ` ${styles.online}` : ''}`}>
              {m.online ? 'Online' : 'Offline'}
            </div>
          </div>
          <button 
            className={styles.actionBtn} 
            style={{ width: 'auto', padding: '0.3rem', marginBottom: 0 }}
            title="Follow / Connect"
            onClick={() => {}}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
          </button>
        </div>
      ))}
      {members.length > 5 && (
        <button className={styles.viewAllBtn}>View All Members</button>
      )}
    </div>
  );
}
