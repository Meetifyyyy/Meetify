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

  // Only show loading skeleton briefly on first visit; data comes from context now
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
      <main className={`centre centre-wide animate-in ${styles.pageContainer}`}>
        <CrewHeader 
          selectedCategory={selectedCategory} 
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreateActivity={() => setIsCreateModalOpen(true)}
        />

        <div className={styles.content}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', padding: '1rem' }}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} style={{ height: '300px', borderRadius: '16px', backgroundColor: '#E7E3DC', animation: 'skeletonPulse 1.5s infinite' }} />
              ))}
            </div>
          ) : sections ? (
            <>
              {sections.recommended?.length > 0 && (
                <section className={styles.categorySection} style={{ marginBottom: '2rem' }}>
                  <h2 className={styles.sectionTitle} style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', padding: '0 1rem' }}>Recommended for you</h2>
                  <div className={styles.cardGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', padding: '0 1rem' }}>
                    {sections.recommended.map(a => <CrewCard key={a.id} activity={a} onClick={() => handleActivityClick(a)} />)}
                  </div>
                </section>
              )}
              {sections.happeningNearby?.length > 0 && (
                <section className={styles.categorySection} style={{ marginBottom: '2rem' }}>
                  <h2 className={styles.sectionTitle} style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', padding: '0 1rem' }}>Happening Nearby</h2>
                  <div className={styles.cardGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', padding: '0 1rem' }}>
                    {sections.happeningNearby.map(a => <CrewCard key={a.id} activity={a} onClick={() => handleActivityClick(a)} />)}
                  </div>
                </section>
              )}
            </>
          ) : (
            <div className={styles.cardGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', padding: '1rem' }}>
              {filteredActivities.map(a => <CrewCard key={a.id} activity={a} onClick={() => handleActivityClick(a)} />)}
              {filteredActivities.length === 0 && (
                <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '3rem', color: 'var(--color-text-muted)' }}>
                   No activities found matching your criteria.
                </div>
              )}
            </div>
          )}
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
