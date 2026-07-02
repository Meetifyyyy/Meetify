import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGlobalSearch } from '../hooks/useGlobalSearch';
import { useData } from '../context/DataContext';
import { PostResult, CommunityResult, UserResult, CollegeResult, CrewResult } from '../components/search/SearchResultCards';
import GlobalSearch from '../components/search/GlobalSearch';
import { isImageUrl } from '../utils/avatar';
import DefaultAvatar from '../components/common/DefaultAvatar';
import Skeleton from '../components/common/Skeleton';
import styles from './SearchResultsRoute.module.css';

export default function SearchResultsRoute() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('top');
  const containerRef = useRef(null);
  const { communities, users } = useData();

  useEffect(() => {
    if (containerRef.current) {
      setTimeout(() => {
        if (containerRef.current) containerRef.current.scrollTo({ top: 0 });
      }, 10);
    }
  }, [activeSection, q]);
  
  const { results, isSearching } = useGlobalSearch(q, 20);
  
  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleQuickSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const hasResults = 
    results.posts.length > 0 || 
    results.communities.length > 0 || 
    results.users.length > 0 || 
    results.colleges.length > 0 ||
    results.crew.length > 0;

  const topMatches = useMemo(() => {
    const sorted = [];
    if (results.posts.length > 0) {
      sorted.push(...results.posts.slice(0, 3).map(r => ({ ...r, type: 'post' })));
    }
    if (results.users.length > 0) {
      sorted.push(...results.users.slice(0, 3).map(r => ({ ...r, type: 'user' })));
    }
    if (results.communities.length > 0) {
      sorted.push(...results.communities.slice(0, 2).map(r => ({ ...r, type: 'community' })));
    }
    if (results.colleges.length > 0) {
      sorted.push(...results.colleges.slice(0, 2).map(r => ({ ...r, type: 'college' })));
    }
    if (results.crew.length > 0) {
      sorted.push(...results.crew.slice(0, 2).map(r => ({ ...r, type: 'crew' })));
    }
    return sorted;
  }, [results]);

  // Popular communities
  const popularCommunities = useMemo(() => {
    if (!communities) return [];
    return Object.values(communities)
      .filter(c => !c.isUniversity)
      .sort((a, b) => (b.members || 0) - (a.members || 0))
      .slice(0, 5);
  }, [communities]);

  // Suggested people
  const suggestedUsers = useMemo(() => {
    if (!users) return [];
    return Object.values(users)
      .sort((a, b) => (b.followers || 0) - (a.followers || 0))
      .slice(0, 6);
  }, [users]);



  const sections = [
    { id: 'top', label: 'Top' },
    { id: 'posts', label: 'Posts' },
    { id: 'users', label: 'Users' },
    { id: 'community', label: 'Community' },
    { id: 'college', label: 'College' },
    { id: 'crew', label: 'Crew' }
  ];

  const trendingTopics = [
    { label: 'React', query: 'React', emoji: '⚛️' },
    { label: 'Figma & Design', query: 'Figma', emoji: '🎨' },
    { label: 'AI & ML', query: 'AI', emoji: '🤖' },
    { label: 'Rust', query: 'Rust', emoji: '🦀' },
    { label: 'GLA University', query: 'GLA', emoji: '🎓' },
    { label: 'Hackathons', query: 'hackathon', emoji: '🏆' },
    { label: 'Open Source', query: 'open source', emoji: '🌐' },
    { label: 'Internships', query: 'internship', emoji: '💼' }
  ];
  
  return (
    <div ref={containerRef} className={`centre centre-wide ${styles.container}`}>
      
      <div className={styles.mobileSearchHeader}>
        <GlobalSearch variant="mobileSearchPage" autoFocus />
      </div>

      {!q.trim() ? (
        <div className={styles.explorePage}>
          {/* Hero with inline search */}
          <div className={styles.exploreHero}>
            <h1 className={styles.heroTitle}>Explore</h1>
            <p className={styles.heroSubtitle}>Discover people, communities, and conversations</p>

          </div>

          {/* Two-column layout */}
          <div className={styles.exploreColumns}>
            {/* Left column — main content */}
            <div className={styles.exploreMain}>
              {/* Quick category search */}
              <div className={styles.quickCategories}>
                <button className={styles.quickCatBtn} onClick={() => navigate('/crew')}>
                  <div className={styles.quickCatIcon} style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-bg-white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <div className={styles.quickCatText}>
                    <span className={styles.quickCatTitle}>Find your crew</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.quickCatArrow}><polyline points="9 18 15 12 9 6"/></svg>
                </button>

                <button className={styles.quickCatBtn} onClick={() => navigate('/communities')}>
                  <div className={styles.quickCatIcon} style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-bg-white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                  <div className={styles.quickCatText}>
                    <span className={styles.quickCatTitle}>Communities</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.quickCatArrow}><polyline points="9 18 15 12 9 6"/></svg>
                </button>

                <button className={styles.quickCatBtn} onClick={() => navigate('/communities', { state: { category: 'colleges' } })}>
                  <div className={styles.quickCatIcon} style={{ background: 'linear-gradient(135deg, #10B981, #2563EB)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-bg-white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
                    </svg>
                  </div>
                  <div className={styles.quickCatText}>
                    <span className={styles.quickCatTitle}>Colleges</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.quickCatArrow}><polyline points="9 18 15 12 9 6"/></svg>
                </button>

                <button className={styles.quickCatBtn} onClick={() => navigate('/home')}>
                  <div className={styles.quickCatIcon} style={{ background: 'linear-gradient(135deg, #F59E0B, #FF6B35)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-bg-white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
                    </svg>
                  </div>
                  <div className={styles.quickCatText}>
                    <span className={styles.quickCatTitle}>Posts</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.quickCatArrow}><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>

              {/* Trending */}
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeader}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </svg>
                  <h2 className={styles.sectionTitle}>Trending</h2>
                </div>
                <div className={styles.trendingChips}>
                  {trendingTopics.map((topic, i) => (
                    <button
                      key={topic.query}
                      className={styles.trendingChip}
                      onClick={() => handleQuickSearch(topic.query)}
                      style={{ animationDelay: `${0.15 + i * 0.04}s` }}
                    >
                      <span className={styles.chipEmoji}>{topic.emoji}</span>
                      <span className={styles.chipLabel}>{topic.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* People to discover */}
              {suggestedUsers.length > 0 && (
                <div className={styles.sectionBlock}>
                  <div className={styles.sectionHeader}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-highlight)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    <h2 className={styles.sectionTitle}>People to discover</h2>
                  </div>
                  <div className={styles.peopleScroll}>
                    {suggestedUsers.map((u, i) => (
                      <button
                        key={u.id}
                        className={styles.personCard}
                        onClick={() => navigate(`/profile/${u.username}`)}
                        style={{ animationDelay: `${0.2 + i * 0.05}s` }}
                      >
                        <div className={styles.personAvatarWrap}>
                          {isImageUrl(u.avatar) ? (
                            <img src={u.avatar} alt={u.displayName} className={styles.personAvatar} />
                          ) : (
                            <DefaultAvatar />
                          )}
                        </div>
                        <span className={styles.personName}>{u.displayName}</span>
                        <span className={styles.personHandle}>@{u.username}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right column — sidebar */}
            <div className={styles.exploreSidebar}>
              {/* Popular communities */}
              {popularCommunities.length > 0 && (
                <div className={styles.sidebarCard}>
                  <div className={styles.sectionHeader}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <h2 className={styles.sectionTitle}>Popular Communities</h2>
                  </div>
                  <div className={styles.communityList}>
                    {popularCommunities.map((c, i) => (
                      <button 
                        key={c.id} 
                        className={styles.communityItem}
                        onClick={() => navigate(`/communities/${c.id}`)}
                        style={{ animationDelay: `${0.25 + i * 0.05}s` }}
                      >
                        <div 
                          className={styles.communityAvatar}
                          style={c.color ? { background: c.color } : {}}
                        >
                          {isImageUrl(c.avatar) ? (
                            <img src={c.avatar} alt={c.name} />
                          ) : (
                            <DefaultAvatar />
                          )}
                        </div>
                        <div className={styles.communityInfo}>
                          <span className={styles.communityName}>{c.name}</span>
                          <span className={styles.communityMembers}>{c.members?.toLocaleString() || 0} members</span>
                        </div>
                        <svg className={styles.communityArrow} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Keyboard shortcut hint */}
              <div className={styles.sidebarHint}>
                <div className={styles.hintContent}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><path d="M6 8h.001M10 8h.001M14 8h.001M18 8h.001M8 12h.001M12 12h.001M16 12h.001M7 16h10"/>
                  </svg>
                  <span><kbd>Ctrl</kbd> + <kbd>K</kbd> to search from anywhere</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.searchResults}>
          <div className={styles.sectionTabs}>
            {sections.map(sec => (
              <button
                key={sec.id}
                className={`${styles.sectionTabBtn} ${activeSection === sec.id ? styles.activeSectionTab : ''}`}
                onClick={() => setActiveSection(sec.id)}
              >
                {sec.label}
              </button>
            ))}
          </div>

          {isSearching ? (
            <div className={styles.sectionContent}>
              <div className={styles.resultsContainer}>
                <div className={styles.list}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1.2rem', borderBottom: '1px solid var(--color-border-light)', background: 'var(--color-bg-white)', borderRadius: '12px', marginBottom: '0.5rem' }}>
                      <Skeleton type="circle" width="48px" height="48px" />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Skeleton type="text" width="40%" height="1.1rem" style={{ marginBottom: '6px' }} />
                        <Skeleton type="text" width="70%" height="0.8rem" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : !hasResults ? (
            <div className={styles.empty}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/><path d="M8 11h6"/>
              </svg>
              <p>No results for "{q}"</p>
              <span>Check spelling or try a different term.</span>
            </div>
          ) : (
        <div className={styles.sectionContent}>
          {activeSection === 'top' && (
            <div className={styles.resultsContainer}>
              {topMatches.length > 0 ? (
                <div className={styles.list}>
                  {topMatches.map(r => {
                    if (r.type === 'user') return <UserResult key={`top-u-${r.item.id}`} result={r} onClick={handleNavigate} />;
                    if (r.type === 'community') return <CommunityResult key={`top-c-${r.item.id}`} result={r} onClick={handleNavigate} />;
                    if (r.type === 'college') return <CollegeResult key={`top-col-${r.item.id}`} result={r} onClick={handleNavigate} />;
                    if (r.type === 'post') return <PostResult key={`top-p-${r.item.id}`} result={r} onClick={handleNavigate} />;
                    if (r.type === 'crew') return <CrewResult key={`top-cr-${r.item.id}`} result={r} onClick={handleNavigate} />;
                    return null;
                  })}
                </div>
              ) : (
                <div className={styles.sectionEmpty}>No top matches for "{q}"</div>
              )}
            </div>
          )}

          {activeSection === 'posts' && (
            <div className={styles.resultsContainer}>
              {results.posts.length > 0 ? (
                <div className={styles.list}>
                  {results.posts.map((r) => (
                    <PostResult key={`p-${r.item.id}`} result={r} onClick={handleNavigate} />
                  ))}
                </div>
              ) : (
                <div className={styles.sectionEmpty}>No posts for "{q}"</div>
              )}
            </div>
          )}

          {activeSection === 'users' && (
            <div className={styles.resultsContainer}>
              {results.users.length > 0 ? (
                <div className={styles.list}>
                  {results.users.map((r) => (
                    <UserResult key={`u-${r.item.id}`} result={r} onClick={handleNavigate} />
                  ))}
                </div>
              ) : (
                <div className={styles.sectionEmpty}>No users for "{q}"</div>
              )}
            </div>
          )}

          {activeSection === 'community' && (
            <div className={styles.resultsContainer}>
              {results.communities.length > 0 ? (
                <div className={styles.list}>
                  {results.communities.map((r) => (
                    <CommunityResult key={`c-${r.item.id}`} result={r} onClick={handleNavigate} />
                  ))}
                </div>
              ) : (
                <div className={styles.sectionEmpty}>No communities for "{q}"</div>
              )}
            </div>
          )}

          {activeSection === 'college' && (
            <div className={styles.resultsContainer}>
              {results.colleges.length > 0 ? (
                <div className={styles.list}>
                  {results.colleges.map((r) => (
                    <CollegeResult key={`col-${r.item.id}`} result={r} onClick={handleNavigate} />
                  ))}
                </div>
              ) : (
                <div className={styles.sectionEmpty}>No colleges for "{q}"</div>
              )}
            </div>
          )}

          {activeSection === 'crew' && (
            <div className={styles.resultsContainer}>
              {results.crew.length > 0 ? (
                <div className={styles.list}>
                  {results.crew.map((r) => (
                    <CrewResult key={`cr-${r.item.id}`} result={r} onClick={handleNavigate} />
                  ))}
                </div>
              ) : (
                <div className={styles.sectionEmpty}>No crew activities for "{q}"</div>
              )}
            </div>
          )}
        </div>
      )}
        </div>
      )}
    </div>
  );
}
