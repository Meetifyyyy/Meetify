import styles from './CrewHeader.module.css';
import { ACTIVITY_CATEGORIES } from './crewData';

export default function CrewHeader({ selectedCategory, onCategoryChange, searchQuery, onSearchChange, onCreateActivity }) {
  return (
    <div className={styles.header}>
      <div className={styles.topRow}>
        <div>
          <h1 className={styles.title}>Find Your Crew</h1>
          <p className={styles.subtitle}>Discover activities and people to do them with.</p>
        </div>
        <button className={styles.createBtn} onClick={onCreateActivity}>Create Activity</button>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
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

        <div className={styles.categories}>
          <button 
            className={`${styles.categoryBtn} ${!selectedCategory ? styles.active : ''}`}
            onClick={() => onCategoryChange(null)}
          >
            All
          </button>
          {ACTIVITY_CATEGORIES.map(cat => (
            <button 
              key={cat}
              className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.active : ''}`}
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
