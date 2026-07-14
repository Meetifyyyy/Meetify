import React from 'react';
import styles from './LinkPreviewStrip.module.css';

/**
 * LinkPreviewStrip
 * Shows a compact pre-send preview above the chat input.
 */
export function LinkPreviewStrip({ preview, isLoading, onDismiss }) {
  if (!preview && !isLoading) return null;

  return (
    <div className={styles.strip}>
      {isLoading ? (
        <div className={styles.shimmerWrap}>
          <div className={styles.shimmerThumb} />
          <div className={styles.shimmerTextWrap}>
            <div className={styles.shimmerTitle} />
            <div className={styles.shimmerSub} />
          </div>
        </div>
      ) : preview ? (
        <div className={styles.contentWrap}>
          <div className={styles.thumbnailWrap}>
            {/* Logic to show thumbnail based on type */}
            {preview.type === 'post' && preview.data.media ? (
              <img src={preview.data.media.url || preview.data.media} className={styles.thumbnail} alt="" />
            ) : preview.type === 'profile' && preview.data.avatar ? (
              <img src={preview.data.avatar} className={styles.thumbnail} alt="" style={{ borderRadius: '50%' }} />
            ) : preview.type === 'community' && preview.data.avatar ? (
              <img src={preview.data.avatar} className={styles.thumbnail} alt="" />
            ) : preview.type === 'external' && preview.data.favicon ? (
              <img src={preview.data.favicon} className={styles.thumbnail} alt="" />
            ) : (
              <div className={styles.placeholderThumb}>
                {preview.type === 'external' ? '🌐' : '📄'}
              </div>
            )}
          </div>
          
          <div className={styles.textWrap}>
            <span className={styles.title}>
              {preview.type === 'post' ? 'Shared Post' :
               preview.type === 'profile' ? preview.data.displayName || preview.data.name :
               preview.type === 'community' ? preview.data.name :
               preview.data.title || preview.url}
            </span>
            <span className={styles.subtitle}>
              {preview.type === 'post' ? preview.data.text :
               preview.type === 'profile' ? `@${preview.data.username}` :
               preview.type === 'community' ? 'Community' :
               preview.data.description || (preview.url ? new URL(preview.url).hostname : '')}
            </span>
          </div>
          
          <button className={styles.closeBtn} onClick={onDismiss} aria-label="Dismiss preview">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}
