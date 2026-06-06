import styles from './ConversationList.module.css';

export default function ConversationList({ conversations, activeChatId, onSelect, showChatOnMobile }) {
  return (
    <div className={`${styles.msgConvList}${showChatOnMobile ? ` ${styles.hideOnMobile}` : ''}`}>
      <div className={styles.msgConvHeader}>
        <h2 className={styles.msgConvTitle}>Messages</h2>
        <button className={styles.msgNewBtn} title="New Message">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </button>
      </div>
      <div className={styles.msgConvSearch}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input type="text" className={styles.msgSearchInput} placeholder="Search conversations..." />
      </div>
      <div className={styles.msgConvScroll}>
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`${styles.convItem}${activeChatId === conv.id ? ` ${styles.convItemActive}` : ''}`}
            onClick={() => onSelect(conv.id)}
          >
            <div className={styles.convAvatar} style={{ background: conv.avatar && conv.avatar.length > 1 ? 'none' : conv.color }}>
              {conv.avatar && conv.avatar.length > 1 ? (
                <img src={conv.avatar} alt={conv.name} className={styles.convAvatarImg} />
              ) : (
                conv.avatar
              )}
              {conv.online && <span className={styles.convOnlineDot} />}
            </div>
            <div className={styles.convInfo}>
              <div className={styles.convName}>
                {conv.name}
                {conv.unread > 0 && <span className={styles.convBadge}>{conv.unread}</span>}
              </div>
              <div className={styles.convPreview}>{conv.lastMsg}</div>
            </div>
            <div className={styles.convTime}>{conv.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
