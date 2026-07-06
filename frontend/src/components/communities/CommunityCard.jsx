import { useData } from '../../context/DataContext';
import CommunityCoverArt from './CommunityCoverArt';
import { isImageUrl } from '../../utils/avatar';
import DefaultAvatar from '../common/DefaultAvatar';
import styles from './CommunityCard.module.css';

function formatNum(n) {
  if (n === undefined || n === null) return '0';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

const avatarColors = [
  'linear-gradient(135deg, #2563EB, #3B82F6)',
  'linear-gradient(135deg, #7C3AED, #8B5CF6)',
  'linear-gradient(135deg, #10B981, #34D399)',
  'linear-gradient(135deg, #FF6B35, #F97316)',
  'linear-gradient(135deg, #F59E0B, #FBBF24)',
];

function MemberAvatarStack({ avatars, max = 4 }) {
  if (!avatars || avatars.length === 0) return null;
  const display = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={styles.avatarStack}>
      {display.map((letter, i) => (
        <div
          key={i}
          className={styles.stackAvatar}
          style={{ background: avatarColors[i % avatarColors.length], zIndex: display.length - i }}
        >
          <span>{letter}</span>
        </div>
      ))}
      {remaining > 0 && (
        <div className={styles.stackRemaining}>+{remaining}</div>
      )}
    </div>
  );
}

function isNonZero(val) {
  return val != null && val !== '' && val !== 0 && Number(val) > 0;
}



const BADGE_THRESHOLDS = {
  trending: { minGrowth: 20, minMembers: 500 },
};

export default function CommunityCard({ comm, onClick }) {
  const { toggleJoinCommunity, currentUser } = useData();
  const isJoined = currentUser?.communities?.includes(comm.name);

  const showTrending = comm.trending && isNonZero(comm.newMembersThisWeek) && comm.newMembersThisWeek >= BADGE_THRESHOLDS.trending.minGrowth && comm.members >= BADGE_THRESHOLDS.trending.minMembers;

  const showOnline = isNonZero(comm.online);

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.cardCover}>
        {comm.coverImage ? (
          <img src={comm.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <CommunityCoverArt coverTheme={comm.coverTheme} />
        )}



      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardAvatar} style={{ background: comm.color }}>
          {isImageUrl(comm.avatar) ? (
            <img src={comm.avatar} alt={comm.name} className={styles.cardAvatarImg} />
          ) : (
            comm.name ? comm.name.charAt(0).toUpperCase() : ''
          )}
        </div>
        <h3 className={styles.cardTitle}>{comm.name}</h3>
        <p className={styles.cardDesc}>{comm.desc}</p>





        <div className={styles.cardFooter}>
          <div className={styles.cardStats}>
            <div className={styles.memberCountIcon}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>{formatNum(comm.members)} members</span>
            </div>
            {showOnline && (
              <div className={styles.onlineIndicator}>
                <span className={styles.onlineDot} />
                <span>{formatNum(comm.online)} active</span>
              </div>
            )}
          </div>
          <button
            className={`${styles.joinBtn} ${isJoined ? styles.joined : ''}`}
            onClick={(e) => { e.stopPropagation(); toggleJoinCommunity(comm.id); }}
          >
            {isJoined ? 'Joined' : 'Join'}
          </button>
        </div>
      </div>
    </div>
  );
}
