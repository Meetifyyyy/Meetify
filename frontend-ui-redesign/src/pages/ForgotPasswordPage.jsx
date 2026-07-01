import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Background from '../components/common/Background';
import Toast from '../components/common/Toast';
import styles from './AuthPage.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const showToast = (msg) => {
    setToastMsg(msg);
    setToastVisible(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid email address');
      return;
    }
    
    // Mock successful submission
    setIsSubmitted(true);
  };

  return (
    <>
      <Background />
      <div className={styles.pageWrapper}>
        <Link to="/login" className={styles.backLink}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to log in
        </Link>
        <div className={styles.authCard}>
          {!isSubmitted ? (
            <>
              <h1>Reset Password</h1>
              <p className={styles.subtitle}>Enter your email to receive a reset link</p>
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="resetEmail">Email</label>
                  <input
                    type="email"
                    id="resetEmail"
                    autoFocus
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button type="submit" className={styles.authBtn}>Send Reset Link</button>
              </form>
            </>
          ) : (
            <>
              <h1>Check your email</h1>
              <p className={styles.subtitle} style={{ marginBottom: '1.5rem' }}>
                We've sent a password reset link to <strong>{email}</strong>.
              </p>
              <p className={styles.subtitle} style={{ fontSize: '0.9rem' }}>
                (This is a mock response. No actual email was sent.)
              </p>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button className={styles.authBtn}>Return to log in</button>
              </Link>
            </>
          )}
        </div>
      </div>
      <Toast message={toastMsg} visible={toastVisible} onHide={() => setToastVisible(false)} />
    </>
  );
}
