import { motion } from 'framer-motion';
import styles from './CampusFeaturesGrid.module.css';

/* --- SVG Stickers --- */
const CameraSticker = () => (
  <div className={`${styles.sticker} ${styles.stickerRotN12}`}>
    <svg viewBox="0 0 64 64" className={styles.stickerSvg}>
      <path d="M 6 22 C 6 12, 12 6, 22 6 L 42 6 C 52 6, 58 12, 58 22 L 58 42 C 58 52, 52 58, 42 58 L 22 58 C 12 58, 6 52, 6 42 Z" fill="white" />
      <path d="M 9 24 C 9 15, 15 9, 24 9 L 40 9 C 49 9, 55 15, 55 24 L 55 40 C 55 49, 49 55, 40 55 L 24 55 C 15 55, 9 49, 9 40 Z" fill="#1C1C24" />
      <rect x="20" y="26" width="24" height="18" rx="3" fill="none" stroke="white" strokeWidth="2.5" />
      <path d="M 28 26 L 30 22 L 34 22 L 36 26 Z" fill="white" />
      <circle cx="32" cy="35" r="5" fill="none" stroke="white" strokeWidth="2.5" />
    </svg>
  </div>
);

const PhoneSticker = () => (
  <div className={`${styles.sticker} ${styles.stickerRot15}`}>
    <svg viewBox="0 0 64 64" className={styles.stickerSvg}>
      <path d="M 12 12 C 12 6, 18 2, 28 2 C 38 2, 44 6, 44 12 C 44 18, 52 24, 52 34 C 52 44, 42 52, 28 52 C 14 52, 12 40, 12 30 Z" fill="white" />
      <path d="M 14 14 C 14 8, 19 4, 28 4 C 37 4, 42 8, 42 14 C 42 20, 50 26, 50 34 C 50 42, 40 50, 28 50 C 16 50, 14 41, 14 30 Z" fill="#FBBF24" />
      <rect x="22" y="16" width="16" height="26" rx="3" fill="none" stroke="white" strokeWidth="2" />
      <circle cx="30" cy="38" r="1.5" fill="white" />
      <path d="M 27 25 C 27 23, 29 23, 30 24 C 31 23, 33 23, 33 25 C 33 27, 30 29, 30 29 C 30 29, 27 27, 27 25 Z" fill="white" />
    </svg>
  </div>
);

const SmileySticker = () => (
  <div className={`${styles.sticker} ${styles.stickerRotN5}`}>
    <svg viewBox="0 0 64 64" className={styles.stickerSvg}>
      <circle cx="32" cy="32" r="28" fill="white" />
      <circle cx="32" cy="32" r="25" fill="#3B82F6" />
      <circle cx="23" cy="26" r="3" fill="white" />
      <circle cx="41" cy="26" r="3" fill="white" />
      <path d="M 18 36 C 18 36, 22 46, 32 46 C 42 46, 46 36, 46 36" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </div>
);

const WatchSticker = () => (
  <div className={`${styles.sticker} ${styles.stickerRot10}`}>
    <svg viewBox="0 0 64 64" className={styles.stickerSvg}>
      <circle cx="32" cy="32" r="26" fill="white" />
      <circle cx="32" cy="32" r="23" fill="#A3E635" />
      <circle cx="32" cy="32" r="12" fill="none" stroke="#1C1C24" strokeWidth="2.5" />
      <path d="M 32 20 L 32 32 L 40 32" fill="none" stroke="#1C1C24" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  </div>
);

const CommunitySticker = () => (
  <div className={`${styles.sticker} ${styles.stickerRotN8} ${styles.stickerRight}`}>
    <svg viewBox="0 0 64 64" className={styles.stickerSvg}>
      <circle cx="32" cy="32" r="28" fill="white" />
      <circle cx="32" cy="32" r="25" fill="#DB2777" />
      <g fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Front person */}
        <circle cx="26" cy="24" r="6" />
        <path d="M 14 45 v -2.5 a 6.5 6.5 0 0 1 6.5 -6.5 h 11 a 6.5 6.5 0 0 1 6.5 6.5 v 2.5" />
        
        {/* Back person */}
        <path d="M 38 18 a 6 6 0 0 1 3.5 10.5" />
        <path d="M 46 45 v -2 a 6.5 6.5 0 0 0 -4.5 -6.1" />
      </g>
    </svg>
  </div>
);

const cards = [
  {
    title: 'Activities',
    bullets: [
      { emoji: '🎟️', text: 'Campus Fests & Club Events' },
      { emoji: '☕', text: 'Interactive Canteen Meetups' },
      { emoji: '📚', text: 'Flash Study Sessions' },
      { emoji: '📲', text: 'RSVP Tracking' },
    ],
    Sticker: CameraSticker,
  },
  {
    title: 'circles',
    bullets: [
      { emoji: '🎨', text: 'Sports Team & Student Groups' },
      { emoji: '🎓', text: 'Study groups & Academic circles' },
      { emoji: '💻', text: 'Project Collabs & Builders' },
      { emoji: '💬', text: 'Direct Peer Networking' },
    ],
    Sticker: PhoneSticker,
  },
  {
    title: 'buzz',
    bullets: [
      { emoji: '📢', text: 'Real-Time Campus News' },
      { emoji: '⚡', text: 'Instant Match Notifications' },
      { emoji: '🌟', text: 'Verified Student Highlights' },
      { emoji: '🔥', text: 'Trending Moments on Campus' },
    ],
    Sticker: SmileySticker,
  },
  {
    title: 'collabs',
    bullets: [
      { emoji: '🤝', text: 'Peer-to-Peer Mentorship' },
      { emoji: '💡', text: 'Skill Sharing Sessions' },
      { emoji: '📄', text: 'Resume Builders Circle' },
      { emoji: '🌐', text: 'Alumni Connection Hubs' },
    ],
    Sticker: WatchSticker,
  },
  {
    title: 'instant match',
    bullets: [
      { emoji: '🎲', text: 'Icebreakers & Meetups' },
      { emoji: '🍵', text: 'Coffee & Chai Matchmaking' },
      { emoji: '🎯', text: 'Hobby Finder System' },
      { emoji: '🧩', text: 'Group Project Finder' },
    ],
    Sticker: CommunitySticker,
  },
];

export default function CampusFeaturesGrid() {
  return (
    <section id="features" className={styles.section} aria-label="Features">
      {/* Background grid */}
      <div className={styles.bgGrid} aria-hidden="true">
        <svg className={styles.bgGridSvg}>
          <defs>
            <pattern id="featgrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#featgrid)" />
        </svg>
      </div>

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.eyebrow}>What Meetifyy does</span>
          <h2 className={`${styles.title} landing-font-display`}>
            Everything on campus,<br />
            <span className={styles.underlineWrap}>
              all in one place.
              <svg className={styles.underlineSvg} viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M 3 8 C 30 7, 70 8, 97 4 C 60 7.5, 20 8.5, 5 9" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
        </div>

        {/* Cards grid */}
        <div className={styles.grid}>
          {cards.map(({ title, bullets, Sticker }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={styles.cardWrap}
            >
              <Sticker />
              <div className={styles.card}>
                <h3 className={`${styles.cardTitle} landing-font-display`}>{title}</h3>
                <ul className={styles.bullets}>
                  {bullets.map((b, bi) => (
                    <li key={bi} className={styles.bulletItem}>
                      <span className={styles.emoji}>{b.emoji}</span>
                      <span className={styles.bulletText}>{b.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
