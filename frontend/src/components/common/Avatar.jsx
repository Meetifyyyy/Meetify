import styles from './Avatar.module.css';

const avatarColors = [
  'linear-gradient(135deg, #2563EB, #3B82F6)',
  'linear-gradient(135deg, #7C3AED, #8B5CF6)',
  'linear-gradient(135deg, #10B981, #34D399)',
  'linear-gradient(135deg, #FF6B35, #F97316)',
  'linear-gradient(135deg, #F59E0B, #FBBF24)',
  'linear-gradient(135deg, #6366F1, #818CF8)',
];

function hashColor(str) {
  let hash = 0;
  for (let i = 0; i < (str || '').length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export default function Avatar({ letter, size = 36, gradient, className = '', style = {} }) {
  const color = gradient || hashColor(letter);
  return (
    <div
      className={`${styles.avatar} ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
        ...style,
      }}
    >
      {letter}
    </div>
  );
}
