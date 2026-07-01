import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { isImageUrl } from '../../utils/avatar';
import DefaultAvatar from '../common/DefaultAvatar';
import styles from './CommunityMembersModal.module.css';

export default function CommunityMembersModal({ members, title, onClose }) {
  const navigate = useNavigate();
  const { users } = useData();

  const handleNameClick = (e, memberName) => {
    e.stopPropagation();
    const matchedUser = Object.values(users).find(u => u.displayName === memberName);
    if (matchedUser) {
      navigate(`/profile/${matchedUser.username}`);
      onClose();
    }
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title || 'Members'}</h3>
          <button onClick={onClose} className={styles.closeBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          {!members || members.length === 0 ? (
            <div className={styles.empty}>
              No members found.
            </div>
          ) : (
            members.map((member, i) => (
              <div key={i} className={styles.userItem}>
                <div className={styles.userAvatar} style={{ background: `linear-gradient(135deg, hsl(${i * 60 + 200}, 70%, 60%), hsl(${i * 60 + 240}, 70%, 50%))` }}>
                  {isImageUrl(member.avatar) ? <img src={member.avatar} alt="avatar" className={styles.avatarImg} /> : (member.avatar || member.name?.charAt(0) || <DefaultAvatar />)}
                </div>
                <div className={styles.userInfo}>
                  <div className={styles.userName} onClick={(e) => handleNameClick(e, member.name)}>
                    {member.name}
                    {member.admin && (
                      <span className={styles.userBadge} style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#EC4899' }}>
                        Admin
                      </span>
                    )}
                  </div>
                  <div className={styles.userRole}>
                    {member.role || 'Member'}
                    {member.branch ? ` • ${member.branch}` : ''}
                    {member.year ? ` • ${member.year}` : ''}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
