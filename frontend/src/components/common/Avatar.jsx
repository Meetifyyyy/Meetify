import styles from './Avatar.module.css';

export default function Avatar({ letter, size = 36, gradient, className = '', style = {} }) {
  const defaultGradient = 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))';
  return (
    <div
      className={`${styles.avatar} ${className}`}
      style={{
        width: size,
        height: size,
        background: gradient || defaultGradient,
        ...style,
      }}
    >
      {letter}
    </div>
  );
}
