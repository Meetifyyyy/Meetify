import { useData } from '../../context/DataContext';
import styles from './CollegesBrowse.module.css';

export default function CollegesBrowse({ onOpenCollege }) {
  const { communities, searchQuery } = useData();

  const universities = Object.values(communities).filter(c => {
    if (!c.isUniversity) return false;
    if (!searchQuery) return true;
    return (
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.desc?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="feed">
      <div className={styles.collegesHero}>
        <h1 className={styles.collegesHeroTitle}>
          Explore Colleges
        </h1>
        <p className={styles.collegesHeroSub}>
          Connect with campus communities, see events, and meet students from other universities.
        </p>
      </div>

      <div className={styles.sectionHeading}>Featured Colleges</div>

      <div className={styles.collegesGrid}>
        {universities.map((uni) => (
          <div key={uni.id} className={styles.collegeCard} onClick={() => onOpenCollege(uni.id)}>
            <div className={styles.collegeCover} style={{ background: uni.color }}>
              <div className={styles.collegeLogoWrapper}>
                <img src={uni.avatar} alt={uni.name} className={styles.collegeLogo} />
              </div>
            </div>
            <div className={styles.collegeBody}>
              <h3 className={styles.collegeTitle}>{uni.name}</h3>
              <p className={styles.collegeDesc}>{uni.desc}</p>
              <div className={styles.collegeFooter}>
                <div className={styles.stat}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                  </svg>
                  <span>{uni.members?.toLocaleString() || 0} members</span>
                </div>
                <div className={styles.onlineStat}>
                  <span className={styles.onlineDot} />
                  <span>{uni.online || 0} online</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {universities.length === 0 && (
          <div className={styles.empty}>No colleges match your search.</div>
        )}
      </div>
    </div>
  );
}
