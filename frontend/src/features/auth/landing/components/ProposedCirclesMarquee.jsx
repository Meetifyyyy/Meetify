import styles from './ProposedCirclesMarquee.module.css';

const row1 = [
  { icon: '🤖', text: 'AI & ML Builders' },
  { icon: '🎨', text: 'Design Collective' },
  { icon: '🎸', text: 'Music Room' },
  { icon: '⚽', text: 'Sports & Fitness' },
  { icon: '📸', text: 'Photography Club' },
  { icon: '🚀', text: 'Startup Founders' },
  { icon: '📖', text: 'Book Club' },
  { icon: '🌿', text: 'Sustainability' },
  { icon: '🧩', text: 'Game Dev Guild' },
  { icon: '🎭', text: 'Dramatics Society' },
];

const row2 = [
  { icon: '💻', text: 'Open Source' },
  { icon: '🧪', text: 'Research Hub' },
  { icon: '🎙️', text: 'Debate Club' },
  { icon: '🏋️', text: 'Gym & Wellness' },
  { icon: '🎬', text: 'Film Society' },
  { icon: '✍️', text: "Writers' Room" },
  { icon: '🌍', text: 'Cultural Exchange' },
  { icon: '🔐', text: 'Cybersecurity Club' },
  { icon: '🤝', text: 'Placement Prep' },
  { icon: '📡', text: 'Electronics Geeks' },
];

const repeatedRow1 = [...row1, ...row1];
const repeatedRow2 = [...row2, ...row2];

export default function ProposedCirclesMarquee() {
  return (
    <section className={styles.section} aria-label="Communities wall">
      <div className={styles.header}>
        <span className={styles.eyebrow}>Upcoming circles proposed by students</span>
        <h2 className={`${styles.title} landing-font-display`}>
          What interest will you{' '}
          <span className={styles.underlineWrap}>
            bring?
            <svg className={styles.underlineSvg} viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M 3 8 C 30 7, 70 8, 97 4 C 60 7.5, 20 8.5, 5 9" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </span>
        </h2>
      </div>

      {/* Row 1 — forward */}
      <div className={styles.marqueeRow}>
        <div className={`${styles.marqueeTrack} landing-marquee-fwd`}>
          {repeatedRow1.map((tag, idx) => (
            <div key={idx} className={styles.tag}>
              <span className={styles.tagIcon}>{tag.icon}</span>
              <span>{tag.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — reverse */}
      <div className={`${styles.marqueeRow} ${styles.marqueeRowReverse}`}>
        <div className={`${styles.marqueeTrack} landing-marquee-rev`}>
          {repeatedRow2.map((tag, idx) => (
            <div key={idx} className={styles.tag}>
              <span className={styles.tagIcon}>{tag.icon}</span>
              <span>{tag.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
