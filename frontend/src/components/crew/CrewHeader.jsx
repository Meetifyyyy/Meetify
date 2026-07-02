import { useNavigate } from 'react-router-dom';
import { useSmartBack } from '../../hooks/useSmartBack';
import styles from './CrewHeader.module.css';
import { ACTIVITY_CATEGORIES } from './crewData';

export default function CrewHeader({ selectedCategory, onCategoryChange, searchQuery, onSearchChange, onCreateActivity }) {
  const navigate = useNavigate();
  const goBack = useSmartBack();
  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.titleRow}>
            <div className={styles.titleGroup}>
              <button 
                className={styles.backBtn}
                onClick={() => goBack('/home')}
                aria-label="Go back"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </button>
              <h1 className={styles.title}>Crew</h1>
            </div>
          </div>
          <p className={styles.subtitle}>Discover activities and people to do them with.</p>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.searchRow}>
            <div className={styles.searchBox}>
              <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input 
                type="text" 
                className={styles.searchInput}
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            <button className={styles.createIconBtn} onClick={onCreateActivity} aria-label="Create Activity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          </div>
          <button className={styles.createTextBtn} onClick={onCreateActivity}>
            Create Activity
          </button>
        </div>
      </div>

      <nav className={styles.catNav}>
        <button 
          className={`${styles.catPill}${!selectedCategory ? ` ${styles.catPillActive}` : ''}`}
          onClick={() => onCategoryChange(null)}
        >
          All
        </button>
        {ACTIVITY_CATEGORIES.map(cat => (
          <button 
            key={cat}
            className={`${styles.catPill}${selectedCategory === cat ? ` ${styles.catPillActive}` : ''}`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </nav>
    </>
  );
}
