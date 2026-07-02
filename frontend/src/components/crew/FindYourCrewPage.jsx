import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import CrewHeader from './CrewHeader';
import CrewCard from './CrewCard';
import CreateActivityModal from './CreateActivityModal';
import { getRecommendedByContext, filterActivities } from './crewData';
import styles from './FindYourCrewPage.module.css';

export default function FindYourCrewPage() {
  const { users, currentUser, crewActivities, addCrewActivity } = useData();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!crewActivities || crewActivities.length === 0);
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (crewActivities && crewActivities.length > 0) {
      setLoading(false);
    } else {
      const timer = setTimeout(() => setLoading(false), 600);
      return () => clearTimeout(timer);
    }
  }, [crewActivities]);

  const filteredActivities = useMemo(() => 
    filterActivities(crewActivities, { category: selectedCategory, search: searchQuery }),
    [crewActivities, selectedCategory, searchQuery]
  );

  const sections = useMemo(() => {
    if (loading || selectedCategory || searchQuery) return null;
    return getRecommendedByContext(currentUser, crewActivities, users);
  }, [currentUser, crewActivities, users, loading, selectedCategory, searchQuery]);

  const handleActivityClick = useCallback((activity) => {
    navigate(`/crew/${activity.id}`, { state: { activity } });
  }, [navigate]);

  return (
    <>
      <main className="centre centre-wide animate-in">
        <div className={styles.page}>
          <CrewHeader 
            selectedCategory={selectedCategory} 
            onCategoryChange={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onCreateActivity={() => setIsCreateModalOpen(true)}
          />

          <div className={styles.content}>
            {loading ? (
              <div className={styles.grid}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} style={{ height: '180px', borderRadius: '12px', backgroundColor: 'var(--color-border-light)', animation: 'skeletonPulse 1.5s infinite' }} />
                ))}
              </div>
            ) : sections ? (
              <>
                {sections.recommended?.length > 0 && (
                  <section className={styles.gridSection}>
                    <div className={styles.sectionHeader}>
                      <h2 className={styles.sectionTitle}>Recommended for you</h2>
                    </div>
                    <div className={styles.grid}>
                      {sections.recommended.map(a => <CrewCard key={a.id} activity={a} onClick={() => handleActivityClick(a)} />)}
                    </div>
                  </section>
                )}
                {sections.happeningNearby?.length > 0 && (
                  <section className={styles.gridSection}>
                    <div className={styles.sectionHeader}>
                      <h2 className={styles.sectionTitle}>Happening Nearby</h2>
                    </div>
                    <div className={styles.grid}>
                      {sections.happeningNearby.map(a => <CrewCard key={a.id} activity={a} onClick={() => handleActivityClick(a)} />)}
                    </div>
                  </section>
                )}
                {sections.recentlyAdded?.length > 0 && (
                  <section className={styles.gridSection}>
                    <div className={styles.sectionHeader}>
                      <h2 className={styles.sectionTitle}>Recently Added</h2>
                    </div>
                    <div className={styles.grid}>
                      {sections.recentlyAdded.map(a => <CrewCard key={a.id} activity={a} onClick={() => handleActivityClick(a)} />)}
                    </div>
                  </section>
                )}
                {sections.startingSoon?.length > 0 && (
                  <section className={styles.gridSection}>
                    <div className={styles.sectionHeader}>
                      <h2 className={styles.sectionTitle}>Starting Soon</h2>
                    </div>
                    <div className={styles.grid}>
                      {sections.startingSoon.map(a => <CrewCard key={a.id} activity={a} onClick={() => handleActivityClick(a)} />)}
                    </div>
                  </section>
                )}
                {sections.popular?.length > 0 && (
                  <section className={styles.gridSection}>
                    <div className={styles.sectionHeader}>
                      <h2 className={styles.sectionTitle}>Popular</h2>
                    </div>
                    <div className={styles.grid}>
                      {sections.popular.map(a => <CrewCard key={a.id} activity={a} onClick={() => handleActivityClick(a)} />)}
                    </div>
                  </section>
                )}
              </>
            ) : (
              <section className={styles.gridSection}>
                {filteredActivities.length > 0 && (
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>All Activities</h2>
                    <span style={{ fontFamily: 'var(--font-family-sans)', fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-text-light)' }}>
                      {filteredActivities.length} activities
                    </span>
                  </div>
                )}
                <div className={styles.grid}>
                  {filteredActivities.map(a => <CrewCard key={a.id} activity={a} onClick={() => handleActivityClick(a)} />)}
                </div>
                {filteredActivities.length === 0 && (
                  <div className={styles.empty}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <p>No activities match your search.</p>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </main>

      {isCreateModalOpen && (
        <CreateActivityModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onPublish={(newActivity) => {
            addCrewActivity(newActivity);
            setIsCreateModalOpen(false);
          }}
        />
      )}
    </>
  );
}
