import { useNavigate } from 'react-router-dom';
import { useSmartBack } from '../../hooks/useSmartBack';
import styles from './ProfilePageHeader.module.css';

export default function ProfilePageHeader({ username }) {
  const goBack = useSmartBack();
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <button
        className={styles.backBtn}
        onClick={() => goBack('/home')}
        aria-label="Go back"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>

      <span className={styles.username}>
        {username || '\u00A0'}
      </span>

      <button
        className={styles.menuBtn}
        onClick={() => navigate('/settings')}
        aria-label="Settings menu"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </header>
  );
}
