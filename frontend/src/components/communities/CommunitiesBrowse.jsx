import { useState } from 'react';
import { categoriesList } from '../../data/communities';
import { useData } from '../../context/DataContext';
import CommunityCard from './CommunityCard';
import CommunityGrid from './CommunityGrid';
import CreateCommunityModal from './CreateCommunityModal';
import styles from './CommunitiesBrowse.module.css';

export default function CommunitiesBrowse({ onOpenCommunity }) {
  const { communities, searchQuery } = useData();
  const [activeCategory, setActiveCategory] = useState('all');
  const [showCreate, setShowCreate] = useState(false);

  const allComms = Object.values(communities).filter((c) => {
    if (c.isUniversity || c.collegeId) return false;
    return true;
  });

  const filtered = allComms.filter((c) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'colleges') return c.isUniversity;
    const catMap = {
      design: ['design', 'art'],
      ai: ['technology', 'science'],
      startup: ['business', 'technology'],
      coding: ['technology'],
      gaming: ['gaming'],
      hackathons: ['technology', 'gaming'],
      sports: ['sports'],
      marketing: ['business'],
      career: ['business'],
      product: ['design', 'business'],
    };
    const matchedCats = catMap[activeCategory] || [activeCategory];
    return c.categories?.some((cat) => matchedCats.includes(cat));
  });

  const searched = filtered.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.desc?.toLowerCase().includes(q) ||
      c.categoryLabel?.toLowerCase().includes(q)
    );
  });

  const remaining = searched;

  return (
    <div className={styles.browse}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Discover Communities</h1>
          <p className={styles.subtitle}>
            Find your people. Join conversations that matter.
          </p>
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          style={{ padding: '0.75rem 1.5rem', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', alignSelf: 'center', boxShadow: '0 4px 12px rgba(37,99,235,0.15)' }}
        >
          Create Community
        </button>
      </div>

      <nav className={styles.catNav}>
        {categoriesList.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.catPill}${activeCategory === cat.id ? ` ${styles.catPillActive}` : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      <div className={styles.content}>


        {remaining.length > 0 && (
          <section className={styles.gridSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                {activeCategory === 'all' ? 'All Communities' : `${categoriesList.find(c => c.id === activeCategory)?.label || ''} Communities`}
              </h2>
              <span className={styles.sectionCount}>{remaining.length} communities</span>
            </div>
            <CommunityGrid>
              {remaining.map((c) => (
                <CommunityCard key={c.id} comm={c} onClick={() => onOpenCommunity(c.id)} />
              ))}
            </CommunityGrid>
          </section>
        )}

        {searched.length === 0 && (
          <div className={styles.empty}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p>No communities found matching your search.</p>
          </div>
        )}
      </div>
      {showCreate && <CreateCommunityModal onClose={() => setShowCreate(false)} onCreated={id => onOpenCommunity(id)} />}
    </div>
  );
}
