import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import styles from './ProfileAbout.module.css';

export default function ProfileAbout({ profileUsername }) {
  const { getUserByUsername, currentUser, communities } = useData();
  const navigate = useNavigate();
  
  const targetUsername = profileUsername || currentUser?.username;
  const profileUser = getUserByUsername(targetUsername) || currentUser;

  if (!profileUser) return null;

  const college = profileUser.collegeId ? communities[profileUser.collegeId] : null;

  return (
    <div className={styles.profileSection}>
      
      <div className={styles.detailsContainer}>
        {college && (
          <div className={styles.detailGroup}>
            <h3 className={styles.groupTitle}>College</h3>
            <div className={styles.collegeItem}>
               <img src={college.avatar} alt={college.name} className={styles.collegeIcon} />
               <div className={styles.collegeInfo}>
                 <div className={styles.collegeName}>{college.name}</div>
                 <div className={styles.collegeCourse}>{profileUser.course} • {profileUser.year}</div>
               </div>
            </div>
          </div>
        )}

        {profileUser.communities && profileUser.communities.length > 0 && (
          <div className={styles.detailGroup}>
            <h3 className={styles.groupTitle}>Communities</h3>
            <div className={styles.communitiesList}>
              {profileUser.communities.filter(c => college ? c !== college.name : true).map((c, i) => {
                const commId = Object.values(communities).find(comm => comm.name === c)?.id;
                return (
                  <button 
                    key={i} 
                    className={styles.communityTag}
                    onClick={() => commId && navigate(`/communities/${commId}`)}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className={styles.detailGroup}>
          <h3 className={styles.groupTitle}>Social Links</h3>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialIcon} aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" className={styles.socialIcon} aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="#" className={styles.socialIcon} aria-label="Website">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
