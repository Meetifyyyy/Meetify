import { useState } from 'react';
import styles from './LoginOverlay.module.css';

export default function LoginOverlay({ visible, onLogin, onSwitchToSignup, toastMsg, setToastMsg }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      (user.trim() === 'sarthak' && pass.trim() === '208') ||
      (user.trim() === 'student@gla.ac.in' && pass.trim() === 'gla123')
    ) {
      onLogin(user.trim());
    } else {
      setToastMsg('Invalid username or password');
    }
  };

  return (
    <div className={`${styles.overlay}${visible ? ` ${styles.visible}` : ''}`} style={visible ? {} : { display: 'none' }}>
      <div className={styles.authCard}>
        <h1>Welcome backk!</h1>
        <p className={styles.subtitle}>let's pick up where we left off</p>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.authBtn}>Log in</button>
        </form>
        <p className={styles.authFooter}>
          Don't have an account? <a onClick={onSwitchToSignup}>Sign up</a>
        </p>
      </div>
    </div>
  );
}
