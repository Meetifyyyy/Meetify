import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import Post from '../feed/Post';
import PostComposer from '../feed/PostComposer';
import { UniversityEvents, UniversityMembers } from '../layout/RightPanel';
import styles from './CollegeView.module.css';

export default function CollegeView({ collegeId, onBack, onPostClick }) {
  const { posts, communities: allCommunities, users, currentUser, toggleJoinCommunity, addPost, startConversation } = useData();
  const [activeTab, setActiveTab] = useState('feed');
  const navigate = useNavigate();

  const comm = allCommunities[collegeId];

  if (!comm) return null;

  const userCommunities = users[currentUser?.username]?.communities || currentUser?.communities || [];
  const joined = userCommunities.includes(comm.name);
  
  const collegePosts = posts.filter(p => p.communityId === comm.id);

  // Filter sub-communities belonging to this college
  const subCommunities = Object.values(allCommunities).filter(c => c.collegeId === comm.id);

  const handleToggleJoin = (e) => {
    e.stopPropagation();
    toggleJoinCommunity(comm.id);
  };

  return (
    <div className={styles.collegeViewWrapper}>
      {/* College Header */}
      <div className={styles.collegeHeader}>
        <div className={styles.collegeBanner} style={{ background: comm.color }}>
        </div>
        <div className={styles.collegeHeaderContent}>
          <div className={styles.collegeLogoContainer}>
            <img src={comm.avatar} alt={comm.name} className={styles.collegeLogo} />
          </div>
          <div className={styles.collegeInfo}>
            <div className={styles.titleRow}>
              <h1 className={styles.collegeTitle}>{comm.name}</h1>
            </div>
            <p className={styles.collegeDesc}>{comm.desc}</p>
            <div className={styles.collegeMeta}>
              <span><strong>{comm.members.toLocaleString()}</strong> Students</span>
              <span className={styles.metaDivider}>•</span>
              <span className={styles.onlineCount}><span className={styles.onlineDot} /><strong>{comm.online}</strong> active now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className={styles.collegeMainLayout}>
        {/* Left Column: Feed or Communities */}
        <div className={styles.collegeLeftColumn}>
          {/* Tabs Navigation */}
          <div className={styles.tabsContainer}>
            <nav className={styles.tabsNav}>
              <button
                className={`${styles.tabBtn}${activeTab === 'feed' ? ` ${styles.activeTab}` : ''}`}
                onClick={() => setActiveTab('feed')}
              >
                Feed
              </button>
              <button
                className={`${styles.tabBtn}${activeTab === 'communities' ? ` ${styles.activeTab}` : ''}`}
                onClick={() => setActiveTab('communities')}
              >
                Communities
              </button>
              <button
                className={`${styles.tabBtn}${activeTab === 'events' ? ` ${styles.activeTab}` : ''}`}
                onClick={() => setActiveTab('events')}
              >
                Events
              </button>
              <button
                className={`${styles.tabBtn}${activeTab === 'members' ? ` ${styles.activeTab}` : ''}`}
                onClick={() => setActiveTab('members')}
              >
                Members
              </button>
            </nav>
          </div>

          <div className={styles.tabContentArea}>
            {/* FEED TAB */}
            {activeTab === 'feed' && (
              <div className={styles.feedTab}>
                {joined && (
                  <div className={styles.composerWrapper}>
                    <PostComposer onSubmit={(text, poll) => addPost(text, poll, comm.id)} />
                  </div>
                )}
                <div className={styles.postsList}>
                  {collegePosts.length === 0 ? (
                    <div className={styles.emptyState}>
                      No posts in this college feed yet. Share something with your peers!
                    </div>
                  ) : (
                    collegePosts.map((p) => (
                      <Post 
                        key={p.id} 
                        postData={p} 
                        communityTag={comm} 
                        onClick={() => onPostClick && onPostClick(p, 'college', comm.id)} 
                      />
                    ))
                  )}
                </div>
              </div>
            )}

            {/* COMMUNITIES TAB */}
            {activeTab === 'communities' && (
              <div className={styles.communitiesTab}>
                <h2 className={styles.tabSectionTitle}>Clubs & Respective Communities</h2>
                {subCommunities.length === 0 ? (
                  <div className={styles.emptyState}>
                    No clubs registered under this college yet.
                  </div>
                ) : (
                  <div className={styles.subCommGrid}>
                    {subCommunities.map((sub) => {
                      const isSubJoined = userCommunities.includes(sub.name);
                      return (
                        <div key={sub.id} className={styles.subCommCard} onClick={() => navigate(`/communities/${sub.id}`)}>
                          <div className={styles.subCommAvatar} style={{ background: sub.color }}>
                            {sub.avatar}
                          </div>
                          <div className={styles.subCommInfo}>
                            <h3 className={styles.subCommName}>{sub.name}</h3>
                            <p className={styles.subCommDesc}>{sub.desc}</p>
                            <span className={styles.subCommMembers}>{sub.members} members</span>
                          </div>
                          <button 
                            className={`${styles.subCommJoinBtn}${isSubJoined ? ` ${styles.subJoined}` : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleJoinCommunity(sub.id);
                            }}
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

            {/* EVENTS TAB */}
            {activeTab === 'events' && (
              <div className={styles.eventsTab}>
                <div className={styles.eventFeedList}>
                  {comm.events?.length === 0 ? (
                    <div className={styles.emptyState}>No upcoming events scheduled.</div>
                  ) : (
                    comm.events.map((e, i) => (
                      <div key={i} className={styles.eventFeedCard}>
                        {e.image && (
                          <div className={styles.eventFeedImageWrapper}>
                            <img src={e.image} alt={e.title} className={styles.eventFeedImage} />
                          </div>
                        )}
                        <div className={styles.eventFeedContent}>
                          <div className={styles.eventFeedHeader}>
                            <h3 className={styles.eventFeedTitle}>{e.title}</h3>
                            {e.organizer && <span className={styles.eventFeedOrganizer}>by {e.organizer}</span>}
                          </div>
                          <p className={styles.eventFeedDesc}>{e.desc}</p>
                          <div className={styles.eventFeedMetaRow}>
                            <div className={styles.eventFeedMetaItem}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                              {e.date}
                            </div>
                            <div className={styles.eventFeedMetaItem}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                              {e.time}
                            </div>
                            <div className={styles.eventFeedMetaItem}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                              {e.location}
                            </div>
                          </div>
                          <div className={styles.eventFeedFooter}>
                            <button 
                              className={styles.eventFeedRegisterBtn}
                              onClick={() => e.registrationLink && window.open(e.registrationLink, '_blank')}
                            >
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

            {/* MEMBERS TAB */}
            {activeTab === 'members' && (
              <div className={styles.membersTab}>
                <h2 className={styles.tabSectionTitle}>{comm.name} Members</h2>
                <div className={styles.membersGrid}>
                  {comm.memberList?.map((m, i) => {
                    const username = m.username || m.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                    return (
                      <div key={i} className={styles.memberGridCard} onClick={() => navigate(`/profile/${username}`)}>
                        <div className={styles.memberGridAvatar} style={{ background: m.avatar && m.avatar.length > 1 ? 'none' : (m.admin ? 'linear-gradient(135deg, #1D4ED8, #3B82F6)' : 'var(--color-primary)') }}>
                          {m.avatar && m.avatar.length > 1 ? (
                            <img src={m.avatar} alt={m.name} className={styles.memberGridAvatarImg} />
                          ) : (
                            m.avatar
                          )}
                          {m.online && <span className={styles.memberGridOnlineDot} title="Online"></span>}
                        </div>
                        <div className={styles.memberGridInfo}>
                          <div className={styles.memberGridName}>{m.name} {m.admin && '👑'}</div>
                          <div className={styles.memberGridBranch}>{m.branch} • {m.year}</div>
                        </div>
                        <div className={styles.memberGridActions}>
                          <button 
                            className={styles.memberGridFollowBtn} 
                            onClick={(e) => {
                              e.stopPropagation();
                              // Toggle follow logic would go here
                            }}
                          >
                            Follow
                          </button>
                          <button 
                            className={styles.memberGridMsgBtn} 
                            title="Message"
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (m.name === currentUser.displayName || m.name === currentUser.name) return; // Don't message self
                              const convId = await startConversation(m);
                              navigate(`/messages/${convId}`);
                            }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sidebar (Events & Members) */}
        <div className={styles.collegeRightColumn}>
          <div className={styles.sidebarWidgets}>
            <UniversityEvents events={comm.events} title={`${comm.name} Events`} />
            <UniversityMembers members={comm.memberList} title={`${comm.name} Members`} />
          </div>
        </div>
      </div>
    </div>
  );
}
