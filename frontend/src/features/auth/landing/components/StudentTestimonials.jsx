import { motion } from 'framer-motion';
import styles from './StudentTestimonials.module.css';

const SparkleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9Z" fill="#FBBF24" stroke="#D97706" />
  </svg>
);

export default function StudentTestimonials() {
  const testimonials = [
    {
      stars: '5/5',
      quote: "I found my hackathon team through Meetifyy three days before the deadline. We made it to the finals. There's no way that happens on LinkedIn or some WhatsApp group.",
      author: "Sanjay Mehra",
      role: "July 7, 2026",
      letter: "S",
      bgClass: styles.card,
      avatarBg: styles.avatarOrange,
      sparkles: (
        <>
          <SparkleIcon className={`${styles.sparkle} ${styles.sparkleTopLeft}`} />
          <SparkleIcon className={`${styles.sparkle} ${styles.sparkleBottomRight}`} />
        </>
      )
    },
    {
      stars: '5/5',
      quote: "I was new to the hostel and didn't know anyone. Joined the Photography Club on Meetifyy on my first week. Now I have a whole friend group I didn't expect to find.",
      author: "Priya Rawat",
      role: "July 3, 2026",
      letter: "P",
      bgClass: styles.card,
      avatarBg: styles.avatarGreen,
      sparkles: null
    },
    {
      stars: '5/5',
      quote: "Someone in the AI community posted an NLP project collab that wasn't on standard college channels. Joined, built it together. That single project changed my resume.",
      author: "Arjun Sharma",
      role: "July 7, 2026",
      letter: "A",
      bgClass: styles.card,
      avatarBg: styles.avatarBlue,
      sparkles: (
        <>
          <SparkleIcon className={`${styles.sparkle} ${styles.sparkleTopLeftAlt}`} />
          <SparkleIcon className={`${styles.sparkle} ${styles.sparkleBottomRightAlt}`} />
        </>
      )
    }
  ];

  return (
    <section id="testimonials" className={styles.section} aria-label="Student testimonials">
      {/* Decorative Pencil/Doodle Grid & Loops */}
      <div className={styles.bgGrid} aria-hidden="true">
        <svg className={styles.bgGridSvg}>
          <defs>
            <pattern id="testigrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#testigrid)" />
          <path d="M-100,200 C300,100 500,600 1200,300" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M200,600 C800,200 1000,800 1500,400" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.eyebrowWrapper}>
            <span className={styles.eyebrow}>
              Student Stories
            </span>
          </div>
          <h2 className={`${styles.title} landing-font-display`}>
            What They're{' '}
            <span className={styles.underlineWrap}>Saying
              <svg className={styles.underlineSvg} viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M 3 8 C 30 7, 70 8, 97 4 C 60 7.5, 20 8.5, 5 9" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
        </div>

        {/* Testimonials Stack */}
        <div className={styles.stack}>
          {testimonials.map((testi, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className={`${testi.bgClass} group`}
            >
              {/* Optional Sparkles */}
              {testi.sparkles}

              {/* Avatar Icon */}
              <div className={`${styles.avatar} ${testi.avatarBg}`}>
                {testi.letter}
              </div>

              {/* Content block */}
              <div className={styles.contentBlock}>
                <div className={styles.contentHeader}>
                  <div>
                    <h4 className={styles.author}>
                      {testi.author}
                    </h4>
                    <p className={styles.role}>
                      {testi.role}
                    </p>
                  </div>

                  {/* Rating Badge */}
                  <div className={styles.ratingBadge}>
                    <span className={styles.star}>★</span> {testi.stars}
                  </div>
                </div>

                <p className={styles.quote}>
                  {testi.quote}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
