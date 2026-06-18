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
  const displayCommunities = profileUser.communities ? profileUser.communities.filter(c => college ? c !== college.name : true) : [];

  return (
    <div className={styles.profileSection}>
      
      <div className={styles.detailsContainer}>
        {profileUsername && profileUsername !== currentUser?.username && (
          <div className={styles.detailGroup}>
            <h3 className={styles.groupTitle}>Shared Connections</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'var(--color-bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(59, 130, 246, 0.2))', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.8rem', border: '2px solid var(--color-bg-white)', zIndex: 2 }}>A</div>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(52, 211, 153, 0.2))', color: 'var(--color-success, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.8rem', border: '2px solid var(--color-bg-white)', marginLeft: '-10px', zIndex: 1 }}>S</div>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-main)' }}>You both know <strong>Alex T.</strong> and <strong>Sam Rivera</strong>.</div>
            </div>
          </div>
        )}

        {college && (
          <div className={styles.detailGroup}>
            <h3 className={styles.groupTitle}>College</h3>
            <div className={styles.collegeItem} onClick={() => navigate(`/colleges/${college.id}`)}>
               <img src={college.avatar} alt={college.name} className={styles.collegeIcon} />
               <div className={styles.collegeInfo}>
                 <div className={styles.collegeName}>{college.name}</div>
                 <div className={styles.collegeCourse}>{profileUser.course} • {profileUser.year}</div>
               </div>
            </div>
          </div>
        )}

        {displayCommunities.length > 0 && (
          <div className={styles.detailGroup}>
            <h3 className={styles.groupTitle}>Communities</h3>
            <div className={styles.communitiesList}>
              {displayCommunities.map((c, i) => {
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

        {displayCommunities.length === 0 && (
          <div className={styles.detailGroup}>
            <h3 className={styles.groupTitle}>Communities</h3>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', 
              padding: '2rem 1rem', background: 'var(--color-bg-white)', 
              borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-border)',
              textAlign: 'center', gap: '0.75rem'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-light)" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <div style={{color: 'var(--color-text-muted)', fontSize: '0.9rem'}}>Not part of any communities yet.</div>
              {profileUser.id === currentUser?.id && (
                <button onClick={() => navigate('/communities')} style={{
                  padding: '0.5rem 1rem', background: 'var(--color-bg-main)', color: 'var(--color-text-main)',
                  border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem'
                }}>
                  Explore Communities
                </button>
              )}
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
