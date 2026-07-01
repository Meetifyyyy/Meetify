import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { showToast } from '../../utils/toast';
import { isImageUrl } from '../../utils/avatar';
import DefaultAvatar from '../common/DefaultAvatar';
import Post from '../feed/Post';
import PostComposer from '../feed/PostComposer';
import CommunityMembersModal from './CommunityMembersModal';
import styles from './CommunityView.module.css';

function getActivityPhrase(comm) {
  if (comm.trending) return 'Growing Fast';
  if ((comm.discussionsToday || 0) >= 30) return 'Active Today';
  if ((comm.newMembersThisWeek || 0) >= 200) return 'Building Momentum';
  if (comm.members < 500) return 'Just Getting Started';
  if (comm.members < 2000) return 'Early Members Welcome';
  return 'Recently Active';
}

function formatCount(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}



function HeroSection({ comm, joined, onToggleJoin, onCreatePost, userCommunities, onViewMembers }) {
  const navigate = useNavigate();

  return (
    <div className={styles.heroSection}>
      <div className={styles.heroCover}>
        <img src={comm.coverImage} alt="" className={styles.heroCoverImg} />
        <div className={styles.heroCoverOverlay} />
      </div>
      <div className={styles.heroContent}>
        <div className={styles.heroTopRow}>
          <div className={styles.heroAvatar} style={{ background: comm.color }}>
            {isImageUrl(comm.avatar) ? (
              <img src={comm.avatar} alt={comm.name} className={styles.heroAvatarImg} />
            ) : (
              <DefaultAvatar />
            )}
          </div>
          <div className={styles.heroMeta}>
            <div className={styles.heroNameRow}>
              <h2 className={styles.heroName}>{comm.name}</h2>
              {comm.trending && (
                <span className={styles.trendingBadge}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                  Trending
                </span>
              )}
            </div>
            <div className={styles.heroCategories}>
              {comm.categories?.map((cat) => (
                <span key={cat} className={styles.heroCategory} style={{ background: `${comm.tagColor}18`, color: comm.tagColor }}>
                  {cat}
                </span>
              ))}
              {comm.categoryLabel && (
                <span className={styles.heroCategory} style={{ background: `${comm.tagColor}18`, color: comm.tagColor }}>
                  {comm.categoryLabel}
                </span>
              )}
            </div>
          </div>
          <div className={styles.heroActions}>
            <button className={styles.heroCreateBtn} onClick={onCreatePost}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create Post
            </button>
            <button
              className={`${styles.heroJoinBtn}${joined ? ` ${styles.joined}` : ''}`}
              onClick={onToggleJoin}
            >
              {joined ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Joined
                </>
              ) : (
                'Join Community'
              )}
            </button>
          </div>
        </div>
        <div className={styles.heroBottomRow}>
          <div 
            className={styles.memberStackClickable} 
            onClick={() => {
              console.log("Member stack clicked!");
              if (onViewMembers) onViewMembers();
            }} 
            style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', cursor: 'pointer' }}
            title="View members"
          >
            <div className={styles.memberStack}>
              {comm.memberAvatars?.slice(0, 4).map((initial, i) => (
                <div
                  key={i}
                  className={styles.memberAvatar}
                  style={{
                    background: `linear-gradient(135deg, hsl(${i * 60 + 200}, 70%, 60%), hsl(${i * 60 + 240}, 70%, 50%))`,
                    zIndex: 4 - i,
                    marginLeft: i === 0 ? 0 : -8,
                  }}
                >
                  {initial}
                </div>
              ))}
              {comm.members > 4 && (
                <div className={styles.memberOverflow} style={{ marginLeft: -8 }}>
                  +{formatCount(comm.members - 4)}
                </div>
              )}
            </div>
            <div className={styles.heroCounts}>
              <span className={styles.heroCount}>
                <strong>{formatCount(comm.members)}</strong> members
              </span>
              <span className={styles.heroCount}>
                <span className={styles.onlineDot} />
                <strong>{formatCount(comm.online)}</strong> active now
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function AboutCard({ comm }) {
  return (
    <div className={styles.aboutCard}>
      <h3 className={styles.aboutTitle}>About</h3>
      <p className={styles.aboutDesc}>{comm.desc}</p>

      {comm.interests && comm.interests.length > 0 && (
        <div className={styles.interestsSection}>
          <h4 className={styles.sectionLabel}>Interests</h4>
          <div className={styles.interestsTags}>
            {comm.interests.map((interest, i) => (
              <span key={i} className={styles.interestTag}>{interest}</span>
            ))}
          </div>
        </div>
      )}

      {comm.goals && comm.goals.length > 0 && (
        <div className={styles.goalsSection}>
          <h4 className={styles.sectionLabel}>Community Goals</h4>
          <ul className={styles.goalsList}>
            {comm.goals.map((goal, i) => (
              <li key={i} className={styles.goalItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {goal}
              </li>
            ))}
          </ul>
        </div>
      )}

      {comm.topContributors && comm.topContributors.length > 0 && (
        <div className={styles.contributorsSection}>
          <h4 className={styles.sectionLabel}>Top Contributors</h4>
          <div className={styles.contributorsList}>
            {comm.topContributors.map((c, i) => (
              <div key={i} className={styles.contributorRow}>
                <div className={styles.contributorAvatar} style={{ background: `linear-gradient(135deg, hsl(${i * 40 + 200}, 70%, 60%), hsl(${i * 40 + 240}, 70%, 50%))` }}>
                  {c.avatar}
                </div>
                <div className={styles.contributorInfo}>
                  <span className={styles.contributorName}>{c.name}</span>
                  <span className={styles.contributorCount}>{c.contributions} contributions</span>
                </div>
                <span className={styles.contributorRank}>#{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}



function SidebarCommunities({ title, communities, allComms }) {
  if (!communities || communities.length === 0) return null;

  return (
    <div className={styles.sidebarSection}>
      <h3 className={styles.sidebarTitle}>{title}</h3>
      <div className={styles.sidebarList}>
        {communities.slice(0, 4).map((item) => {
          const comm = typeof item === 'string' ? allComms[item] : item;
          if (!comm) return null;
          return (
            <div key={comm.id} className={styles.sidebarItem}>
              <div className={styles.sidebarItemAvatar} style={{ background: comm.color }}>
                {isImageUrl(comm.avatar) ? (
                  <img src={comm.avatar} alt={comm.name} className={styles.sidebarItemAvatarImg} />
                ) : (
                  <DefaultAvatar />
                )}
              </div>
              <div className={styles.sidebarItemInfo}>
                <span className={styles.sidebarItemName}>{comm.name}</span>
                <span className={styles.sidebarItemMeta}>
                  {formatCount(comm.members)} members
                  {comm.growth && <span className={styles.sidebarItemGrowth}> · {comm.growth}</span>}
                </span>
              </div>
              {comm.trending && <span className={styles.sidebarTrendingIcon}>🔥</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CommunityView({ communityId, onBack, onPostClick }) {
  const { posts, communities: allCommunities, users, currentUser, toggleJoinCommunity, addPost } = useData();
  const [showMembersModal, setShowMembersModal] = useState(false);
  const comm = allCommunities[communityId];

  if (!comm) return null;

  const userCommunities = users[currentUser?.username]?.communities || currentUser?.communities || [];
  const joined = userCommunities.includes(comm.name);
  const communityPosts = posts.filter(p => p.communityId === comm.id);

  const activityPhrase = getActivityPhrase(comm);

  // Compute sidebar communities
  const allCommValues = Object.values(allCommunities).filter(c => !c.isUniversity && c.id !== comm.id);
  const trendingComms = allCommValues.filter(c => c.trending).sort((a, b) => b.newMembersThisWeek - a.newMembersThisWeek);
  const recommendedComms = allCommValues.filter(c => !c.trending).sort((a, b) => b.members - a.members);
  const recentlyActive = [...allCommValues].sort((a, b) => (b.discussionsToday || 0) - (a.discussionsToday || 0));

  const handleToggleJoin = (e) => {
    e.stopPropagation();
    toggleJoinCommunity(communityId);
    if (!joined) {
      showToast(`Welcome to ${comm.name}! 🎉`);
    }
  };

  const handleCreatePostClick = () => {
    if (!joined) {
      toggleJoinCommunity(communityId);
    }
    setTimeout(() => {
      const inputEl = document.querySelector(`.${styles.composerWrap} input`);
      if (inputEl) {
        inputEl.focus();
        inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  return (
    <div className={styles.wrapper}>
      <HeroSection
        comm={comm}
        joined={joined}
        onToggleJoin={handleToggleJoin}
        onCreatePost={handleCreatePostClick}
        userCommunities={userCommunities}
        onViewMembers={() => {
          console.log("Setting showMembersModal to true");
          setShowMembersModal(true);
        }}
      />

      {showMembersModal && (
        <CommunityMembersModal
          members={comm.memberList}
          title={`${comm.name} Members`}
          onClose={() => setShowMembersModal(false)}
        />
      )}



      <div className={styles.main}>
        <div className={styles.leftColumn}>
          <div className={styles.feedHeader}>
            <h2 className={styles.feedTitle}>
              Posts
            </h2>
          </div>

          {joined && (
            <div className={styles.composerWrap}>
              <PostComposer onSubmit={(text, poll) => addPost(text, poll, comm.id)} />
            </div>
          )}

          <div className={styles.postsFeed}>
            {communityPosts.length === 0 ? (
              <div className={styles.emptyPosts}>
                <div className={styles.emptyPostsIcon}>
                  {comm.trending ? '🚀' : '💭'}
                </div>
                <h3 className={styles.emptyPostsTitle}>
                  {comm.trending ? 'Be Part of Something Growing' : 'Start the Conversation'}
                </h3>
                <p className={styles.emptyPostsDesc}>
                  {comm.trending
                    ? `This community is growing fast! Be the first to share something with ${formatCount(comm.members)} members.`
                    : `No posts yet in ${comm.name}. Share your thoughts, ask a question, or start a discussion!`}
                </p>
                {!joined && (
                  <button className={styles.emptyJoinBtn} onClick={handleToggleJoin}>
                    Join to Post
                  </button>
                )}
              </div>
            ) : (
              communityPosts.map((p, idx) => (
                <div key={p.id} className={styles.postWrapper}>
                  <div className={styles.postMetaRow}>
                    {p.authorId && users[p.authorId] && comm.memberList?.find(m => m.name === users[p.authorId]?.displayName)?.admin && (
                      <span className={styles.postAuthorBadge} style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#EC4899', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                        Admin
                      </span>
                    )}
                  </div>
                  <Post key={p.id} postData={p} onClick={() => onPostClick && onPostClick(p, 'community', comm.id)} />
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.rightColumn}>
          <AboutCard comm={comm} />
        </div>
      </div>
    </div>
  );
}