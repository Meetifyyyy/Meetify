import { motion } from 'framer-motion';
import styles from './HowItWorksSteps.module.css';

const steps = [
  {
    step: 'Step 01',
    badge: 'Instant Verification',
    title: 'Verify & Customise',
    desc: 'Verify your campus email, personalize your profile, and unlock your student community.',
    accentClass: styles.accentPrimary,
    badgeClass: styles.badgePrimary,
  },
  {
    step: 'Step 02',
    badge: 'Interest Circles',
    title: 'Join Peer Circles & Share',
    desc: 'Connect with creators, share ideas, and grow together in student-run interest groups.',
    accentClass: styles.accentGreen,
    badgeClass: styles.badgeGreen,
  },
  {
    step: 'Step 03',
    badge: 'In-Person Events',
    title: 'Real Life Meetups',
    desc: 'Initiate study groups, canteen meetups, or play sessions and meet in person instantly.',
    accentClass: styles.accentRose,
    badgeClass: styles.badgeRose,
  },
];

export default function HowItWorksSteps() {
  return (
    <section
      id="how-it-works"
      className={styles.section}
      role="region"
      aria-label="How Meetifyy works"
    >
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.eyebrow}>Getting Started</span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`${styles.title} landing-font-display`}
          >
            How Meetifyy{' '}
            <span className={styles.underlineWrap}>
              works
              <svg className={styles.underlineSvg} viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M 3 8 C 30 7, 70 8, 97 4 C 60 7.5, 20 8.5, 5 9" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className={styles.subtitle}
          >
            No complex setups. No noisy algorithms. Just three simple steps to connect with real students around you.
          </motion.p>
        </div>

        {/* Step cards */}
        <div className={styles.grid}>
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1, type: 'spring', bounce: 0.1 }}
              className={`${styles.card} group`}
            >
              <div>
                <div className={styles.cardTop}>
                  <span className={`${styles.stepBadge} ${s.badgeClass}`}>{s.step}</span>
                  <span className={styles.badgeLabel}>{s.badge}</span>
                </div>
                <h3 className={`${styles.cardTitle} landing-font-display`}>{s.title}</h3>
                <p className={styles.cardDesc}>{s.desc}</p>
              </div>
              <div className={`${styles.accent} ${s.accentClass}`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
