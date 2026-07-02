import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useSimulatedFetch } from '../../hooks/useSimulatedFetch';
import { showToast } from '../../utils/toast';
import { isImageUrl } from '../../utils/avatar';
import DefaultAvatar from '../common/DefaultAvatar';
import Skeleton from '../common/Skeleton';
import { ErrorState } from '../common/StateViews';
import Post from '../feed/Post';
import PostComposer from '../feed/PostComposer';
import PostSkeleton from '../feed/PostSkeleton';
import CommunityMembersModal from './CommunityMembersModal';
import CommunityAdminModal from './CommunityAdminModal';
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
  if (n === undefined || n === null) return '0';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

function HeroSection({ comm, joined, onToggleJoin, onCreatePost, userCommunities, onViewMembers, isAdmin, onOpenAdmin, onUpdateCommunity }) {
  const navigate = useNavigate();
  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        await onUpdateCommunity(comm.id, { [field]: ev.target.result });
        showToast(`${field === 'coverImage' ? 'Cover' : 'Avatar'} updated successfully!`);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.heroSection}>
      <div className={styles.heroCover}>
        <img src={comm.coverImage} alt="" className={styles.heroCoverImg} />
        <div className={styles.heroCoverOverlay} />
        {isAdmin && (
          <>
            <input 
              type="file" 
              accept="image/*" 
              ref={coverInputRef} 
              style={{ display: 'none' }} 
              onChange={e => handleImageUpload(e, 'coverImage')} 
            />
            <button className={styles.editCoverBtn} onClick={() => coverInputRef.current?.click()} title="Change Cover Image">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              Edit Cover
            </button>
          </>
        )}
      </div>
      <div className={styles.heroContent}>
        <div className={styles.heroTopRow}>
          <div className={styles.avatarWrapper}>
            <div 
              className={`${styles.heroAvatar} ${isAdmin ? styles.heroAvatarEditable : ''}`} 
              style={{ background: comm.color }}
              onClick={isAdmin ? () => avatarInputRef.current?.click() : undefined}
            >
              {isImageUrl(comm.avatar) ? (
                <img src={comm.avatar} alt={comm.name} className={styles.heroAvatarImg} />
              ) : (
                <DefaultAvatar />
              )}
              {isAdmin && (
                <>
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={avatarInputRef} 
                    style={{ display: 'none' }} 
                    onChange={e => handleImageUpload(e, 'avatar')} 
                  />
                  <div className={styles.avatarEditOverlay} title="Change Avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  </div>
                </>
              )}
            </div>
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
              {(comm.interests || comm.categories || []).slice(0, 2).map((item, index) => (
                <span key={`${item}-${index}`} className={styles.heroCategory} style={{ background: `${comm.tagColor}18`, color: comm.tagColor }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className={styles.heroActions}>
            {isAdmin && (
              <button className={styles.heroCreateBtn} onClick={onOpenAdmin} style={{ background: 'var(--color-bg-main)', color: 'var(--color-text-main)', border: '1px solid var(--color-border)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                Settings
              </button>
            )}
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
              if (onViewMembers) onViewMembers();
            }} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
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
                  }}
                >
                  {initial}
                </div>
              ))}
              {comm.members > 4 && (
                <div className={styles.memberOverflow}>
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
  // Handle local storage migration of goals -> rules
  const displayRules = comm.rules || comm.goals;

  return (
    <div className={styles.aboutCard}>
      <div>
        <h4 className={styles.sectionLabel}>About</h4>
        <p className={styles.aboutDesc}>{comm.desc}</p>
      </div>

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

      {displayRules && displayRules.length > 0 && (
        <div className={styles.rulesSection}>
          <h4 className={styles.sectionLabel}>Community Rules</h4>
          <ul className={styles.rulesList}>
            {displayRules.map((rule, i) => (
              <li key={i} className={styles.ruleItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {rule}
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

export default function CommunityView({ communityId, onBack, onPostClick }) {
  const { posts, communities: allCommunities, users, currentUser, toggleJoinCommunity, addPost, updateCommunity } = useData();
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showMobileDetails, setShowMobileDetails] = useState(() => {
    const saved = localStorage.getItem('meetify_show_community_details');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const rawComm = allCommunities[communityId];
  const { isLoading, data: comm, error, retry } = useSimulatedFetch(rawComm, 800, [communityId]);

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.mobileHeader}>
          <button className={styles.backBtn} onClick={onBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <Skeleton type="text" width="120px" height="1.5rem" style={{ margin: 0 }} />
        </div>
        <div className={styles.heroSection}>
          <Skeleton type="rect" width="100%" height="240px" style={{ borderRadius: 0 }} />
        </div>
        <div className={styles.main}>
          <div className={styles.leftColumn}>
            <Skeleton type="rect" width="100%" height="140px" style={{ marginBottom: '1.5rem' }} />
            <PostSkeleton />
            <PostSkeleton />
          </div>
          <div className={`${styles.rightColumn} ${!showMobileDetails ? styles.hiddenOnMobile : ''}`}>
            <Skeleton type="rect" width="100%" height="400px" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <ErrorState onRetry={retry} />
      </div>
    );
  }

  if (!comm) return null;

  const userCommunities = users[currentUser?.username]?.communities || currentUser?.communities || [];
  const joined = userCommunities.includes(comm.name);
  const communityPosts = posts.filter(p => p.communityId === comm.id);
  const isAdmin = comm.memberList?.some(m => m.id === currentUser?.id && m.admin);

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
      <div className={styles.mobileHeader}>
        <button 
          className={styles.backBtn}
          onClick={onBack}
          aria-label="Go back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 className={styles.mobileTitle}>{comm.name}</h1>
        <div style={{ position: 'relative' }}>
          <button 
            className={styles.backBtn}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </button>
          {showMobileMenu && (
            <div className={styles.mobileDropdownMenu}>
              <button 
                onClick={() => {
                  const newVal = !showMobileDetails;
                  setShowMobileDetails(newVal);
                  localStorage.setItem('meetify_show_community_details', JSON.stringify(newVal));
                  setShowMobileMenu(false);
                }}
              >
                {showMobileDetails ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
          )}
        </div>
      </div>

      <HeroSection
        comm={comm}
        joined={joined}
        onToggleJoin={handleToggleJoin}
        onCreatePost={handleCreatePostClick}
        userCommunities={userCommunities}
        isAdmin={isAdmin}
        onOpenAdmin={() => setShowAdminModal(true)}
        onUpdateCommunity={updateCommunity}
        onViewMembers={() => {
          setShowMembersModal(true);
        }}
      />

      {showAdminModal && (
        <CommunityAdminModal
          community={comm}
          onClose={() => setShowAdminModal(false)}
        />
      )}

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
              <PostComposer onSubmit={(text, poll, media) => addPost(text, poll, comm.id, media)} />
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

        <div className={`${styles.rightColumn} ${!showMobileDetails ? styles.hiddenOnMobile : ''}`}>
          <AboutCard comm={comm} />
        </div>
      </div>
    </div>
  );
}