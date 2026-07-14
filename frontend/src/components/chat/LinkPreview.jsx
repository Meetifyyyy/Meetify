import React from 'react';
import styles from './LinkPreview.module.css';

/**
 * LinkPreview
 * Renders an Open Graph link preview card for external URLs.
 */
export function LinkPreview({ og }) {
  if (!og) return null;

  return (
    <a 
      href={og.url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={styles.card}
      aria-label={`Link to ${og.title || og.siteName || og.url}`}
    >
      <div className={styles.header}>
        <div className={styles.faviconWrap}>
          {og.favicon ? (
            <img src={og.favicon} alt="" className={styles.favicon} />
          ) : (
            <span className={styles.globeIcon}>🌐</span>
          )}
        </div>
        <span className={styles.siteName}>{og.siteName || new URL(og.url).hostname}</span>
      </div>

      {og.image && (
        <div className={styles.imageWrap}>
          <img src={og.image} alt={og.title || 'Preview'} className={styles.image} loading="lazy" />
        </div>
      )}

      {(og.title || og.description) && (
        <div className={styles.content}>
          {og.title && <h3 className={styles.title}>{og.title}</h3>}
          {og.description && <p className={styles.description}>{og.description}</p>}
        </div>
      )}
    </a>
  );
}
