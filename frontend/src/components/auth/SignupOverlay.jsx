import styles from './SignupOverlay.module.css';

export default function SignupOverlay({ visible, onSwitchToLogin }) {
  return (
    <div className={`${styles.overlay}${visible ? ` ${styles.visible}` : ''}`} style={visible ? {} : { display: 'none' }}>
      <div className={styles.authCard}>
        <h1>join the fam</h1>
        <p className={styles.subtitle}>create your profile and get started</p>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={styles.nameRow}>
            <div className={styles.formGroup}>
              <label htmlFor="first">First name</label>
              <input type="text" id="first" placeholder="Alex" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="last">Last name</label>
              <input type="text" id="last" placeholder="River" />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="signupEmail">Email</label>
            <input type="email" id="signupEmail" placeholder="you@example.com" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="signupPassword">Password</label>
            <input type="password" id="signupPassword" placeholder="Create a password" />
          </div>
          <button type="submit" className={styles.authBtn}>Sign up</button>
        </form>
        <p className={styles.authFooter}>
          Already have an account? <a onClick={onSwitchToLogin}>Log in</a>
        </p>
      </div>
    </div>
  );
}
