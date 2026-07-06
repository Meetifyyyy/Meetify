import { useState, useRef } from 'react';
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
import ShareCollegeModal from './ShareCollegeModal';
import CommunityMembersModal from '../communities/CommunityMembersModal';
import styles from './CollegeView.module.css';

function formatCount(n) {
  if (n === undefined || n === null) return '0';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}



/* ─── Hero Section ─── */
function HeroSection({ comm, joined, onToggleJoin, onShare, onViewMembers }) {
  const [notifOn, setNotifOn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  return (
    <div className={styles.heroSection}>
      {/* Cover Banner */}
      <div className={styles.heroCover}>
        {comm.coverImage ? (
          <img src={comm.coverImage} alt="" className={styles.heroCoverImg} />
        ) : (
          <div className={styles.heroCoverFallback} style={{ background: comm.color }} />
        )}
        <div className={styles.heroCoverOverlay} />
      </div>

      {/* Hero Content */}
      <div className={styles.heroContent}>
        <div className={styles.heroTopRow}>
          {/* Logo / Avatar */}
          <div className={styles.avatarWrapper}>
            <div className={styles.heroAvatar} style={{ background: isImageUrl(comm.avatar) ? 'var(--color-bg-white)' : comm.color }}>
              {isImageUrl(comm.avatar) ? (
                <img src={comm.avatar} alt={comm.name} className={styles.heroAvatarImg} />
              ) : (
                <span className={styles.heroAvatarLetter}>{comm.name?.charAt(0) || 'C'}</span>
              )}
            </div>
          </div>

          {/* Name + Badge */}
          <div className={styles.heroMeta}>
            <div className={styles.heroNameRow}>
              <h2 className={styles.heroName}>{comm.name}</h2>
            </div>
          </div>

          {/* Description */}
          {comm.desc && <p className={styles.heroDesc}>{comm.desc}</p>}

          {/* Action buttons */}
          <div className={styles.heroActions}>
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
              ) : 'Follow'}
            </button>

            <button
              className={`${styles.heroIconBtn}${notifOn ? ` ${styles.notifActive}` : ''}`}
              onClick={() => { setNotifOn(p => !p); showToast(notifOn ? 'Notifications off' : 'Notifications on'); }}
              title="Notifications"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={notifOn ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>


            <div style={{ position: 'relative' }} ref={menuRef}>
              <button className={styles.heroIconBtn} onClick={() => setShowMenu(p => !p)} title="More options">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                </svg>
              </button>
              {showMenu && (
                <div className={styles.dropdownMenu}>
                  <button onClick={() => { onShare(); setShowMenu(false); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                    Share
                  </button>
                  {comm.website && (
                    <button onClick={() => { window.open(comm.website, '_blank'); setShowMenu(false); }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                      Visit Website
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Member Counts */}
        <div className={styles.heroBottomRow}>
          <div className={styles.memberStackRow}>
            <div className={styles.memberStack} onClick={onViewMembers} style={{ cursor: 'pointer' }} title="View members">
              {(comm.memberAvatars || comm.memberList?.map(m => m.avatar))?.slice(0, 4).map((initial, i) => (
                <div
                  key={i}
                  className={styles.memberStackAvatar}
                  style={{
                    background: `linear-gradient(135deg, hsl(${i * 60 + 200}, 70%, 60%), hsl(${i * 60 + 240}, 70%, 50%))`,
                    zIndex: 4 - i,
                  }}
                >
                  {initial}
                </div>
              ))}
              <div className={styles.memberStackOverflow}>
                {formatCount(comm.members)}
              </div>
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





/* ─── Events Section ─── */
function EventsSection({ events, onViewAll }) {
  if (!events?.length) return null;
  const shown = events.slice(0, 3);

  return (
    <div className={styles.eventsSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleRow}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <h3 className={styles.sectionTitle}>Upcoming Events</h3>
        </div>
        {events.length > 3 && (
          <button className={styles.viewAllBtn} onClick={onViewAll}>View all</button>
        )}
      </div>
      <div className={styles.eventCardsList}>
        {shown.map((ev) => (
          <div key={ev.id} className={styles.eventCard}>
            {ev.image && (
              <div className={styles.eventCardImageWrap}>
                <img src={ev.image} alt={ev.title} className={styles.eventCardImage} />
                <div className={styles.eventDateBadge}>
                  <span className={styles.eventDateMonth}>{ev.date?.split(' ')[0]}</span>
                  <span className={styles.eventDateDay}>{ev.date?.split(' ')[1]}</span>
                </div>
              </div>
            )}
            <div className={styles.eventCardContent}>
              <h4 className={styles.eventCardTitle}>{ev.title}</h4>
              {ev.organizer && <span className={styles.eventOrganizer}>by {ev.organizer}</span>}
              <p className={styles.eventCardDesc}>{ev.desc}</p>
              <div className={styles.eventMeta}>
                <span className={styles.eventMetaItem}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {ev.time}
                </span>
                <span className={styles.eventMetaItem}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {ev.location}
                </span>
              </div>
              <button
                className={styles.rsvpBtn}
                onClick={() => ev.registrationLink && window.open(ev.registrationLink, '_blank')}
              >
                RSVP
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Departments / Clubs ─── */
function DepartmentsStrip({ departments, allCommunities, userCommunities, onToggleJoin, navigate }) {
  if (!departments?.length || typeof departments[0] !== 'object') return null;

  return (
    <div className={styles.departmentsSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleRow}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <h3 className={styles.sectionTitle}>Departments & Clubs</h3>
        </div>
      </div>
      <div className={styles.departmentsScroll}>
        {departments.map((dep) => {
          const sub = dep.communityId ? allCommunities[dep.communityId] : null;
          const isJoined = sub ? userCommunities.includes(sub.name) : false;
          return (
            <div
              key={dep.id}
              className={styles.deptCard}
              onClick={() => dep.communityId && navigate(`/communities/${dep.communityId}`)}
              style={{ cursor: dep.communityId ? 'pointer' : 'default' }}
            >
              <div className={styles.deptIcon}>{dep.icon}</div>
              <div className={styles.deptInfo}>
                <span className={styles.deptName}>{dep.name}</span>
                <span className={styles.deptMembers}>{formatCount(dep.members)} members</span>
              </div>
              {dep.communityId && (
                <button
                  className={`${styles.deptJoinBtn}${isJoined ? ` ${styles.deptJoined}` : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleJoin(dep.communityId);
                  }}
                >
                  {isJoined ? 'Joined' : 'Join'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Right Sidebar ─── */
function Sidebar({ comm, events, trendingDiscussions, resources, onViewAllEvents }) {
  return (
    <div className={styles.sidebarWidgets}>
      {/* Upcoming Events widget */}
      {events?.length > 0 && (
        <div className={styles.sidebarCard}>
          <div className={styles.sidebarCardHeader}>
            <h4 className={styles.sidebarCardTitle}>Upcoming Events</h4>
            <button className={styles.sidebarViewAll} onClick={onViewAllEvents}>See all</button>
          </div>
          {events.slice(0, 2).map((ev) => (
            <div key={ev.id} className={styles.sidebarEventItem}>
              <div className={styles.sidebarEventDate}>
                <span className={styles.sidebarEventMonth}>{ev.date?.split(' ')[0]}</span>
                <span className={styles.sidebarEventDay}>{ev.date?.split(' ')[1]}</span>
              </div>
              <div className={styles.sidebarEventInfo}>
                <span className={styles.sidebarEventTitle}>{ev.title}</span>
                <span className={styles.sidebarEventTime}>{ev.time} · {ev.location}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}




/* ─── Main Export ─── */
export default function CollegeView({ collegeId, onBack, onPostClick }) {
  const { posts, communities: allCommunities, users, currentUser, toggleJoinCommunity, addPost } = useData();
  const [activeTab, setActiveTab] = useState('feed');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const navigate = useNavigate();

  const rawComm = allCommunities[collegeId];
  const { isLoading, data: comm, error, retry } = useSimulatedFetch(rawComm, 0, [collegeId]);

  /* ── Loading state ── */
  if (isLoading) {
    return (
      <div className={styles.collegeViewWrapper}>
        <div className={styles.mobileHeader}>
          <button className={styles.backBtn} onClick={onBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
          </button>
          <Skeleton type="text" width="140px" height="1.4rem" style={{ margin: 0 }} />
        </div>
        <Skeleton type="rect" width="100%" height="220px" style={{ borderRadius: 0 }} />
        <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Skeleton type="rect" width="100%" height="120px" />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.collegeViewWrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <ErrorState onRetry={retry} />
      </div>
    );
  }

  if (!comm) return null;

  const userCommunities = users[currentUser?.username]?.communities || currentUser?.communities || [];
  const joined = userCommunities.includes(comm.name);
  const collegePosts = posts.filter(p => p.communityId === comm.id);
  const subCommunities = Object.values(allCommunities).filter(c => c.collegeId === comm.id);

  const handleToggleJoin = (e) => {
    if (e?.stopPropagation) e.stopPropagation();
    toggleJoinCommunity(collegeId);
    if (!joined) showToast(`Welcome to ${comm.name}! 🎓`);
  };

  const tabs = [
    { id: 'feed', label: 'Feed' },
    { id: 'events', label: 'Events' },
    { id: 'departments', label: 'Clubs' },
  ];

  return (
    <div className={styles.collegeViewWrapper}>
      {/* Mobile Header */}
      <div className={styles.mobileHeader}>
        <button className={styles.backBtn} onClick={onBack} aria-label="Go back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
        </button>
        <h1 className={styles.mobileTitle}>{comm.name}</h1>
        <div style={{ position: 'relative' }}>
          <button className={styles.backBtn} onClick={() => setShowMobileMenu(p => !p)} aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
            </svg>
          </button>
          {showMobileMenu && (
            <div className={styles.mobileDropdownMenu}>
              <button onClick={() => { setShowShareModal(true); setShowMobileMenu(false); }}>Share</button>
            </div>
          )}
        </div>
      </div>

      {/* Hero */}
      <HeroSection comm={comm} joined={joined} onToggleJoin={handleToggleJoin} onShare={() => setShowShareModal(true)} onViewMembers={() => setShowMembersModal(true)} />



      {/* Tabs + Main Grid */}
      <div className={`${styles.collegeMainLayout}${activeTab !== 'feed' ? ` ${styles.fullWidth}` : ''}`}>

        {/* Left Column */}
        <div className={styles.collegeLeftColumn}>
          {/* Tabs */}
          <div className={styles.tabsContainer}>
            <nav className={styles.tabsNav}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`${styles.tabBtn}${activeTab === tab.id ? ` ${styles.activeTab}` : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className={styles.tabContentArea}>

            {/* ── FEED TAB ── */}
            {activeTab === 'feed' && (
              <div className={styles.feedTab}>
                {/* Post Composer */}
                {joined && (
                  <div className={styles.composerWrapper}>
                    <PostComposer onSubmit={(text, poll, media) => addPost(text, poll, comm.id, media)} />
                  </div>
                )}

                {/* Feed */}
                <div className={styles.postsList}>
                  {collegePosts.length === 0 ? (
                    <div className={styles.emptyState}>
                      <div className={styles.emptyStateIcon}>🎓</div>
                      <h3 className={styles.emptyStateTitle}>No posts yet</h3>
                      <p className={styles.emptyStateDesc}>
                        {joined
                          ? `Be the first to post in ${comm.name}.`
                          : `Follow ${comm.name} to see posts here.`}
                      </p>
                      {!joined && (
                        <button className={styles.emptyJoinBtn} onClick={handleToggleJoin}>Follow College</button>
                      )}
                    </div>
                  ) : (
                    collegePosts.map((p) => {
                      const isAuthorAdmin = comm.memberList?.find(m => m.admin)?.name;
                      const postAuthor = users[p.authorId];
                      const isOfficial = comm.memberList?.some(m => m.admin && postAuthor && m.name === postAuthor?.displayName);
                      return (
                        <div key={p.id} className={styles.postWrapper}>
                          {isOfficial && (
                            <div className={styles.postMetaRow}>
                              <span className={styles.officialPostBadge}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                                Official Post
                              </span>
                            </div>
                          )}
                          <Post
                            postData={p}
                            communityTag={comm}
                            onClick={() => onPostClick && onPostClick(p, 'college', comm.id)}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* ── DEPARTMENTS TAB ── */}
            {activeTab === 'departments' && (
              <div className={styles.communitiesTab}>
                <h2 className={styles.tabSectionTitle}>Clubs & Departments</h2>
                {subCommunities.length === 0 ? (
                  <div className={styles.emptyState}>No clubs registered under this college yet.</div>
                ) : (
                  <div className={styles.subCommGrid}>
                    {subCommunities.map((sub) => {
                      const isSubJoined = userCommunities.includes(sub.name);
                      return (
                        <div key={sub.id} className={styles.subCommCard} onClick={() => navigate(`/communities/${sub.id}`)}>
                          <div className={styles.subCommAvatar} style={{ background: sub.color }}>{sub.avatar}</div>
                          <div className={styles.subCommInfo}>
                            <h3 className={styles.subCommName}>{sub.name}</h3>
                            <p className={styles.subCommDesc}>{sub.desc}</p>
                            <span className={styles.subCommMembers}>{sub.members?.toLocaleString()} members</span>
                          </div>
                          <button
                            className={`${styles.subCommJoinBtn}${isSubJoined ? ` ${styles.subJoined}` : ''}`}
                            onClick={(e) => { e.stopPropagation(); toggleJoinCommunity(sub.id); }}
                          >
                            {isSubJoined ? 'Joined' : 'Join'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── EVENTS TAB ── */}
            {activeTab === 'events' && (
              <div className={styles.eventsTab}>
                <h2 className={styles.tabSectionTitle}>All Events</h2>
                <div className={styles.eventFeedList}>
                  {(!comm.events || comm.events.length === 0) ? (
                    <div className={styles.emptyState}>No upcoming events scheduled.</div>
                  ) : (
                    comm.events.map((ev) => (
                      <div key={ev.id} className={styles.eventFeedCard}>
                        {ev.image && (
                          <div className={styles.eventFeedImageWrapper}>
                            <img src={ev.image} alt={ev.title} className={styles.eventFeedImage} />
                          </div>
                        )}
                        <div className={styles.eventFeedContent}>
                          <div className={styles.eventFeedHeader}>
                            <h3 className={styles.eventFeedTitle}>{ev.title}</h3>
                            {ev.organizer && <span className={styles.eventFeedOrganizer}>by {ev.organizer}</span>}
                          </div>
                          <p className={styles.eventFeedDesc}>{ev.desc}</p>
                          <div className={styles.eventFeedMetaRow}>
                            <div className={styles.eventFeedMetaItem}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                              {ev.date}
                            </div>
                            <div className={styles.eventFeedMetaItem}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                              {ev.time}
                            </div>
                            <div className={styles.eventFeedMetaItem}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                              {ev.location}
                            </div>
                          </div>
                          <div className={styles.eventFeedFooter}>
                            <button className={styles.eventFeedRegisterBtn} onClick={() => ev.registrationLink && window.open(ev.registrationLink, '_blank')}>
                              Register Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}


          </div>
        </div>

        {/* Right Sidebar */}
        {activeTab === 'feed' && (
          <div className={styles.collegeRightColumn}>
            <Sidebar
              comm={comm}
              events={comm.events}
              trendingDiscussions={comm.trendingDiscussions}
              resources={comm.resources}
              onViewAllEvents={() => setActiveTab('events')}
            />
          </div>
        )}
      </div>
      <ShareCollegeModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        college={comm}
      />
      {showMembersModal && (
        <CommunityMembersModal
          members={comm.memberList}
          title={`${comm.name} Members`}
          onClose={() => setShowMembersModal(false)}
        />
      )}
    </div>
  );
}
