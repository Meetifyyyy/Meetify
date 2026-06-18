import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useFollow } from '../../context/FollowContext';
import { showToast } from '../../utils/toast';
import { isImageUrl } from '../../utils/avatar';
import DefaultAvatar from '../common/DefaultAvatar';
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
    .map((u) => ({
      id: u.id,
      name: u.displayName,
      username: u.username,
      avatar: u.avatar,
      avatarUrl: u.avatarUrl,
      status: u.recentlyActive ? 'Online' : 'Offline',
      online: !!u.recentlyActive
    }));

  return (
    <div className={styles.panelCard}>
      <h3 className={styles.panelTitle}>Online Friends</h3>
      {friends.length === 0 ? (
        <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '1rem 0' }}>
          No friends online yet. <br/>
          <span style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 500 }} onClick={() => window.location.href='/search'}>Find people to connect with!</span>
        </div>
      ) : (
        friends.map((f, i) => (
          <div key={i} className={styles.friendItem}>
            <div className={styles.friendAvatar}>
              {isImageUrl(f.avatarUrl || f.avatar) ? (
                <img src={f.avatarUrl || f.avatar} alt={f.name} className={styles.friendAvatarImg} />
              ) : (
                <DefaultAvatar />
              )}
            </div>
            <div className={styles.friendInfo}>
              <div className={styles.friendName}>{f.name}</div>
              <div className={`${styles.friendStatus}${f.online ? ` ${styles.online}` : ''}`}>{f.status}</div>
            </div>
          </div>
        ))
      )}
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

export function UniversityEvents({ events, title = 'Ongoing Events', onViewAll }) {
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
            </div>
          </div>
        );
      })}
      <button className={styles.viewAllBtn} onClick={onViewAll}>View All Events</button>
    </div>
  );
}

export function UniversityMembers({ members, title = 'Members', onViewAll }) {
  const { currentUser, startConversation } = useData();
  const { isFollowing, toggleFollow } = useFollow();
  const navigate = useNavigate();
  if (!members || members.length === 0) return null;

  const displayMembers = members.slice(0, 5);

  return (
    <div className={styles.panelCard}>
      <h3 className={styles.panelTitle}>{title}</h3>
      {displayMembers.map((m, i) => {
        const targetUsername = m.username || m.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const isFollowingUser = isFollowing(targetUsername);
        const isSelf = targetUsername === currentUser?.username;
        return (
          <div key={i} className={styles.friendItem}>
            <div className={styles.friendAvatar} style={{ cursor: 'pointer', background: isImageUrl(m.avatar) ? 'none' : (m.admin ? 'linear-gradient(135deg, #1D4ED8, #3B82F6)' : undefined) }} onClick={() => navigate(`/profile/${targetUsername}`)}>
              {isImageUrl(m.avatar) ? (
                <img src={m.avatar} alt={m.name} className={styles.friendAvatarImg} />
              ) : (
                <DefaultAvatar />
              )}
            </div>
            <div className={styles.friendInfo} style={{ cursor: 'pointer' }} onClick={() => navigate(`/profile/${targetUsername}`)}>
              <div className={styles.friendName}>{m.name} {m.admin && '👑'}</div>
              <div className={styles.memberBranch}>{m.branch} • {m.year}</div>
              <div className={`${styles.friendStatus}${m.online ? ` ${styles.online}` : ''}`}>
                {m.online ? 'Online' : 'Offline'}
              </div>
            </div>
            {!isSelf && (
              <button 
                className={`${styles.actionBtn}${isFollowingUser ? ` ${styles.followingBtn}` : ''}`} 
                style={{ width: 'auto', padding: '0.3rem 0.5rem', marginBottom: 0 }}
                title={isFollowingUser ? 'Following' : 'Follow'}
                onClick={() => toggleFollow(targetUsername)}
              >
                {isFollowingUser ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        );
      })}
      {members.length > 5 && (
        <button className={styles.viewAllBtn} onClick={onViewAll}>View All Members</button>
      )}
    </div>
  );
}
