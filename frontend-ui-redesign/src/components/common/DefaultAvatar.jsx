import styles from './DefaultAvatar.module.css';

export default function DefaultAvatar({ className = '', style = {} }) {
  return (
    <div className={`${styles.avatar} ${className}`} style={style}>
      <span className="material-symbols-outlined">person</span>
    </div>
  );
}
