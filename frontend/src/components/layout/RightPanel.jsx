import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useFollow } from '../../context/FollowContext';
import { useNotifications } from '../../context/NotificationContext';
import { showToast } from '../../utils/toast';
import { isImageUrl } from '../../utils/avatar';
import DefaultAvatar from '../common/DefaultAvatar';
import styles from './RightPanel.module.css';

export default function RightPanel({ children, className = '' }) {
  return <aside className={`${styles.rightPanel} ${className}`.trim()}>{children}</aside>;
}

export function NotificationsActivity() {
  const { notifications, timeAgo } = useNotifications();
  const { users } = useData();
  const navigate = useNavigate();
  const { isFollowing, toggleFollow } = useFollow();

  const displayNotifs = notifications.slice(0, 4);

  return (
    <div className={styles.panelCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 className={styles.panelTitle} style={{ marginBottom: 0 }}>Activity</h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', cursor: 'pointer', fontWeight: 500 }} onClick={() => navigate('/notifications')}>See all</span>
      </div>
      
      {displayNotifs.length === 0 ? (
        <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '1rem 0' }}>
          No recent activity.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {displayNotifs.map((n) => {
            const actor = Object.values(users).find(u => u.id === n.actorId) || users[n.actorId];
            const isFollow = n.type === 'follow';
            const targetUsername = actor?.username || (actor?.displayName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const followingUser = isFollowing(targetUsername);

            // Format time ago for shorter output (e.g., "5m" instead of "5m ago")
            const timeStr = timeAgo(n.createdAt).replace(' ago', '').replace('Yesterday', '1D').replace('just now', 'now');

            return (
              <div key={n.id} className={styles.friendItem} style={{ borderBottom: 'none', alignItems: 'center' }}>
                <div className={styles.friendAvatar} style={{ width: '36px', height: '36px' }} onClick={() => targetUsername && navigate(`/profile/${targetUsername}`)}>
                  {actor && isImageUrl(actor.avatarUrl || actor.avatar) ? (
                    <img src={actor.avatarUrl || actor.avatar} alt={actor?.displayName || 'User'} className={styles.friendAvatarImg} style={{ cursor: 'pointer' }} />
                  ) : (
                    <DefaultAvatar />
                  )}
                </div>
                
                <div className={styles.friendInfo} style={{ paddingLeft: '0.25rem' }}>
                  <div style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
                    <span style={{ color: 'var(--color-text-main)', fontWeight: 700, cursor: 'pointer' }} onClick={() => targetUsername && navigate(`/profile/${targetUsername}`)}>
                      {actor?.displayName || 'Someone'}
                    </span>
                    <span style={{ color: 'var(--color-text-muted)' }}> {n.text}. {timeStr}</span>
                  </div>
                </div>

                {isFollow ? (
                  <button 
                    onClick={() => toggleFollow(targetUsername)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: followingUser ? 'var(--color-text-muted)' : 'var(--color-primary)',
                      fontWeight: 600,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      transition: 'opacity 0.2s'
                    }}
                  >
                    {followingUser ? 'Following' : 'Follow'}
                  </button>
                ) : (
                  <div className={styles.postPreview}>
                    {/* Placeholder image for like/comment */}
                    <img src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100&q=80" alt="post" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function OnlineFriends() {
  const { users, currentUser } = useData();
  const navigate = useNavigate();

  const friends = Object.values(users)
    .filter(u => u.id !== currentUser.id)
    .slice(0, 6)
    .map((u) => ({
      id: u.id,
      name: u.displayName,
      username: u.username,
      avatar: u.avatar,
      avatarUrl: u.avatarUrl,
      status: u.recentlyActive ? 'Online' : 'Offline',
      online: !!u.recentlyActive
    }));

  if (friends.length === 0) return null;

  return (
    <div className={styles.panelCard}>
      <h3 className={styles.panelTitle} style={{ marginBottom: '1rem' }}>Online Friends</h3>
      <div className={styles.onlineFriendsContainer} style={{ gap: '0.5rem', justifyContent: 'flex-start' }}>
        {friends.map((f, i) => (
          <div 
            key={i} 
            title={f.name}
            style={{ 
              cursor: 'pointer', 
              transition: 'transform 0.2s', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '4px',
              width: '56px'
            }}
            onClick={() => f.username && navigate(`/profile/${f.username}`)}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div className={styles.friendAvatarWrapper}>
              <div className={styles.friendAvatar} style={{ width: '48px', height: '48px' }}>
                {isImageUrl(f.avatarUrl || f.avatar) ? (
                  <img src={f.avatarUrl || f.avatar} alt={f.name} className={styles.friendAvatarImg} />
                ) : (
                  <DefaultAvatar />
                )}
              </div>
              {f.online && <span className={styles.onlineStatusDot} style={{ width: '12px', height: '12px', bottom: '2px', right: '2px', border: '2px solid var(--color-bg-base)' }} />}
            </div>
            <span style={{ 
              fontSize: '0.65rem', 
              color: 'var(--color-text-muted)', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap', 
              width: '100%', 
              textAlign: 'center',
              lineHeight: '1.1'
            }}>
              {f.username.length > 8 ? f.username.slice(0, 7) + '...' : f.username}
            </span>
          </div>
        ))}
      </div>
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
