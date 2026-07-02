import styles from './DefaultAvatar.module.css';

export default function DefaultAvatar({ className = '', style = {} }) {
  return (
    <div className={`${styles.avatar} ${className}`} style={style}>
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '60%', height: '60%', display: 'block' }}>
        <circle cx="12" cy="8.5" r="4" />
        <path d="M12 14c-4.42 0-8 2.5-8 5.5v0.5h16v-0.5c0-3-3.58-5.5-8-5.5z" />
      </svg>
    </div>
  );
}
