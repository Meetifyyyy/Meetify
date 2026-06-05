import { useState, useEffect, useRef } from 'react';
import styles from './WelcomeGreeting.module.css';

export default function WelcomeGreeting({ visible, username, onComplete }) {
  const [text, setText] = useState('');
  const [fadingOut, setFadingOut] = useState(false);
  const idx = useRef(0);
  const fullText = `hey, ${username} 👋`;

  useEffect(() => {
    if (!visible) {
      setFadingOut(false);
      return;
    }
    idx.current = 0;
    setText('');
    setFadingOut(false);

    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        if (idx.current < fullText.length) {
          setText(fullText.slice(0, idx.current + 1));
          idx.current++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setFadingOut(true);
            setTimeout(onComplete, 600);
          }, 1000);
        }
      }, 60);
      return () => clearInterval(interval);
    }, 400);

    return () => clearTimeout(startTimer);
  }, [visible, username, onComplete, fullText]);

  return (
    <div className={`${styles.welcomeGreeting}${visible ? ` ${styles.visible}` : ''}${fadingOut ? ` ${styles.fadingOut}` : ''}`}>
      <div className={styles.greetingContent}>
        <h1>
          <span className={styles.typewriter}>{text}</span>
          <span className={styles.cursor} />
        </h1>
      </div>
    </div>
  );
}
