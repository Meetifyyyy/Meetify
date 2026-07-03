import React from 'react';
import styles from './InstantMatchupCard.module.css';

export default function InstantMatchupCard({ onFindMatch }) {
  return (
    <div className={styles.card} onClick={onFindMatch}>
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.lightningIcon}>
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <div className={styles.headerContent}>
          <div className={styles.titleRow}>
            <span className={styles.badge}>New</span>
            <h2 className={styles.title}>Instant Matchup</h2>
          </div>
          <p className={styles.subtitle}>Get matched with people who want to do something right now!</p>
        </div>
      </div>

      <div className={styles.chipsRow}>
        <div className={styles.chip}>🏸 Badminton</div>
        <div className={styles.chip}>☕ Coffee</div>
        <div className={styles.chip}>🚶 Walk</div>
        <div className={styles.chip}>🎮 Gaming</div>
        <div className={styles.chipPlus}>+</div>
      </div>

      <div className={styles.footer}>
        <div className={styles.onlineUsers}>
          <div className={styles.avatars}>
            <img src="https://i.pravatar.cc/150?img=11" alt="User" className={styles.avatar} />
            <img src="https://i.pravatar.cc/150?img=12" alt="User" className={styles.avatar} />
            <img src="https://i.pravatar.cc/150?img=13" alt="User" className={styles.avatar} />
          </div>
          <span className={styles.onlineText}>24 people online now</span>
        </div>
        <button className={styles.findMatchBtn} onClick={(e) => {
          e.stopPropagation(); // prevent card click
          onFindMatch();
        }}>
          Find Match ⚡
        </button>
      </div>
    </div>
  );
}
