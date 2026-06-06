import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './PostComposer.module.css';

const EMOJI_GROUPS = [
  { label: 'Smileys', emojis: ['😀','😂','🥹','😍','🤩','😎','🥳','😤','🤔','🫡','😴','🤯','🥺','😈','💀','🤖'] },
  { label: 'Hands', emojis: ['👋','👍','👎','👏','🙌','🤝','✌️','🤞','💪','🫶','🖐️','👊'] },
  { label: 'Hearts', emojis: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','💖','💗','💝','❣️'] },
  { label: 'Objects', emojis: ['🔥','⭐','✨','🎉','🎯','💡','🚀','💎','🏆','🎵','📸','💻'] },
  { label: 'Nature', emojis: ['🌸','🌿','🌊','☀️','🌙','⚡','🦋','🐾','🌈','🍀','🌺','🍂'] },
];

export default function PostComposer({ onSubmit }) {
  const { initial, currentUser } = useAuth();
  const [value, setValue] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollMulti, setPollMulti] = useState(false);
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const emojiPanelRef = useRef(null);
  const pollPanelRef = useRef(null);
  const emojiBtnRef = useRef(null);
  const pollBtnRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (showEmoji && emojiPanelRef.current && !emojiPanelRef.current.contains(e.target) && !emojiBtnRef.current?.contains(e.target)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showEmoji]);

  const handlePost = () => {
    const text = value.trim();
    if (showPoll) {
      const opts = pollOptions.map((o) => o.trim()).filter(Boolean);
      if (!text || opts.length < 2) return;
      onSubmit(null, { question: text, options: opts, multiSelect: pollMulti });
      setValue('');
      setPollOptions(['', '']);
      setPollMulti(false);
      setShowPoll(false);
    } else {
      if (!text) return;
      onSubmit(text);
      setValue('');
    }
  };

  const togglePoll = () => {
    if (showPoll) {
      setPollOptions(['', '']);
      setPollMulti(false);
    }
    setShowPoll(!showPoll);
    setShowEmoji(false);
  };

  const insertEmoji = (emoji) => {
    setValue((v) => v + emoji);
    inputRef.current?.focus();
  };

  const addPollOption = () => {
    if (pollOptions.length < 5) setPollOptions([...pollOptions, '']);
  };

  const removePollOption = (idx) => {
    if (pollOptions.length > 2) setPollOptions(pollOptions.filter((_, i) => i !== idx));
  };

  const updatePollOption = (idx, val) => {
    const next = [...pollOptions];
    next[idx] = val;
    setPollOptions(next);
  };

  return (
    <div className={styles.postComposerWrapper}>
      {/* Popups rendered above the composer */}
      {showEmoji && (
        <div className={styles.emojiPicker} ref={emojiPanelRef}>
          {EMOJI_GROUPS.map((group) => (
            <div key={group.label} className={styles.emojiGroup}>
              <div className={styles.emojiGroupLabel}>{group.label}</div>
              <div className={styles.emojiGrid}>
                {group.emojis.map((em) => (
                  <button key={em} className={styles.emojiBtn} onClick={() => insertEmoji(em)}>{em}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={`${styles.postComposer}${showPoll ? ` ${styles.hasPoll}` : ''}`}>
        <div className={styles.composerTopRow}>
          <div className={styles.composerAvatar}>
            {currentUser?.avatar && currentUser.avatar.length > 1 ? (
              <img src={currentUser.avatar} alt={currentUser.displayName} className={styles.composerAvatarImg} />
            ) : (
              initial
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            className={styles.composerInput}
            placeholder={showPoll ? "Ask a question?" : "What's on your mind?"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !showPoll) handlePost(); }}
          />
        </div>

        <div className={styles.composerContentArea}>
          {showPoll && (
            <div className={styles.inlinePollCreator}>
              <div className={styles.pollOptionsList}>
                {pollOptions.map((opt, i) => {
                  const isLast = i === pollOptions.length - 1;
                  const hasAdd = isLast && pollOptions.length < 5;
                  return (
                    <div key={i} className={styles.pollOptionRow}>
                      <div className={styles.pollOptionInputWrapper}>
                        <input
                          className={styles.pollOptionInput}
                          type="text"
                          placeholder={`Option ${i + 1}`}
                          value={opt}
                          onChange={(e) => updatePollOption(i, e.target.value)}
                        />
                        {pollOptions.length > 2 && (
                          <button className={styles.pollOptionRemove} onClick={() => removePollOption(i)} title="Remove option">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                          </button>
                        )}
                      </div>
                      <div className={styles.pollOptionActionSpace}>
                        {hasAdd && (
                          <button className={styles.pollOptionAdd} onClick={addPollOption} title="Add option">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={styles.pollCreatorFooter}>
                <label className={styles.pollMultiToggle}>
                  <div className={`${styles.pollToggleTrack}${pollMulti ? ` ${styles.on}` : ''}`} onClick={() => setPollMulti(!pollMulti)}>
                    <div className={styles.pollToggleThumb} />
                  </div>
                  <span>Multiple answers</span>
                </label>
                <button className={styles.pollDiscardBtn} onClick={togglePoll} title="Remove poll">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  Remove Poll
                </button>
              </div>
            </div>
          )}

          <div className={styles.composerActions}>
            <div className={styles.composerActionsLeft}>
              <input ref={fileRef} type="file" accept="image/*" hidden />
              <button className={styles.composerIconBtn} title="Image" onClick={() => fileRef.current?.click()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </button>
              <button className={styles.composerIconBtn} title="Attach">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
              <button
                ref={emojiBtnRef}
                className={`${styles.composerIconBtn}${showEmoji ? ` ${styles.active}` : ''}`}
                title="Emoji"
                onClick={() => {
                  if (showPoll) {
                    setPollOptions(['', '']);
                    setPollMulti(false);
                    setShowPoll(false);
                    setValue('');
                  }
                  setShowEmoji(!showEmoji);
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </button>
              <button
                ref={pollBtnRef}
                className={`${styles.composerIconBtn}${showPoll ? ` ${styles.active}` : ''}`}
                title="Poll"
                onClick={togglePoll}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="9" y1="8" x2="9" y2="16" />
                  <line x1="12" y1="11" x2="12" y2="16" />
                  <line x1="15" y1="6" x2="15" y2="16" />
                </svg>
              </button>
            </div>
            <button className={styles.composerSendBtn} onClick={handlePost} title="Post">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
