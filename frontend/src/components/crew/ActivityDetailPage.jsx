import { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useNotifications } from '../../context/NotificationContext';
import { useSmartBack } from '../../hooks/useSmartBack';
import { isImageUrl } from '../../utils/avatar';
import { getRelativeDateLabel } from '../../utils/time';
import DefaultAvatar from '../common/DefaultAvatar';
import ConfirmModal from '../common/ConfirmModal';
import ShareActivityModal from './ShareActivityModal';
import ActivityJoinedModal from './ActivityJoinedModal';
import styles from './ActivityDetailPage.module.css';

/* ── Icon helpers ──────────────────────────────────────────── */
function IconCalendar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ── Details card ──────────────────────────────────────────── */
function DetailsCard({ date, time, duration, actLocation, isOnline, slotsFilled, spotsLeft, activity }) {
  const computedDateLabel = getRelativeDateLabel(date) || activity?.dateLabel;
  return (
    <div className={styles.detailsCard}>
      <h2 className={styles.detailsTitle}>Details</h2>
      <div className={styles.detailsGrid}>
        <div className={styles.detailRow}>
          <span className={styles.detailIcon}><IconCalendar /></span>
          <div>
            <div className={styles.detailLabel}>{computedDateLabel}</div>
            <div className={styles.detailValue}>{new Date(date).toLocaleDateString()}</div>
          </div>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailIcon}><IconClock /></span>
          <div>
            <div className={styles.detailLabel}>Time</div>
            <div className={styles.detailValue}>{time} ({duration})</div>
          </div>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailIcon}><IconPin /></span>
          <div>
            <div className={styles.detailLabel}>Location</div>
            <div className={styles.detailValue}>{actLocation}{isOnline ? ' (Online)' : ''}</div>
          </div>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailIcon}><IconUsers /></span>
          <div>
            <div className={styles.detailLabel}>Participants</div>
            <div className={styles.detailValue}>
              {slotsFilled} joined · {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ────────────────────────────────────────── */
export default function ActivityDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const goBack = useSmartBack();

  const { crewActivities, savedActivities, toggleSaveActivity, currentUser, joinCrewActivity, requestToJoinActivity, endCrewActivity } = useData();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const discussionRef = useRef(null);
  const commentInputRef = useRef(null);

  useEffect(() => {
    if (location.search.includes('discussion=1') && discussionRef.current) {
      setTimeout(() => {
        discussionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        commentInputRef.current?.focus();
      }, 300);
    }
  }, [location.search]);

  const activity = useMemo(() => {
    return crewActivities?.find(a => a.id === id) || location.state?.activity;
  }, [crewActivities, id, location.state]);

  const [hasJoined, setHasJoined] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showJoinedModal, setShowJoinedModal] = useState(false);
  const isSaved = savedActivities?.includes(activity?.id);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, author: 'Jane Doe', text: 'Looking forward to this!', time: '2 hours ago' },
  ]);

  if (!activity) {
    return (
      <div className={styles.notFound}>
        <h2>Activity not found</h2>
        <button onClick={() => goBack('/crew')} className={styles.joinBtn} style={{ width: 'auto' }}>
          Back to Crew
        </button>
      </div>
    );
  }

  const {
    title, description, category, tags,
    date, time, duration, location: actLocation, isOnline,
    participationType, slotsNeeded, slotsFilled,
    hostName, hostAvatar,
  } = activity;

  const spotsLeft = slotsNeeded - slotsFilled;
  const isFull = spotsLeft <= 0;
  const isHost = activity.hostId === currentUser?.id;
  const isJoined = activity.participants?.includes(currentUser?.id) || hasJoined;
  const isRequested = activity.pendingRequests?.includes(currentUser?.id) || hasRequested;

  const handleJoin = async () => {
    if (participationType === 'open') {
      await joinCrewActivity(activity.id);
      setHasJoined(true);
      setShowJoinedModal(true);
    } else {
      await requestToJoinActivity(activity.id);
      setHasRequested(true);
    }
  };

  const handleEndActivity = () => {
    setShowEndConfirm(true);
  };

  const confirmEndActivity = async () => {
    setShowEndConfirm(false);
    await endCrewActivity(activity.id);
    navigate('/crew');
  };

  const handleSave = () => {
    toggleSaveActivity(activity.id);
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments([...comments, { id: Date.now(), author: 'You', text: comment, time: 'Just now' }]);
    if (currentUser?.id !== activity.hostId) {
      const preview = comment.length > 60 ? comment.slice(0, 60) + '...' : comment;
      addNotification('activity_discussion', {
        activityId: activity.id,
        actorId: currentUser?.id,
        text: `commented on your activity: "${preview}"`,
      });
    }
    setComment('');
  };

  return (
    <main className="centre">
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.titleRow}>
              <div className={styles.titleGroup}>
                <button className={styles.backBtn} onClick={() => goBack('/crew')} aria-label="Go back">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                </button>
                <h1 className={styles.pageTitle}>Back to activities</h1>
              </div>
            </div>
          </div>
        </div>

        <article className={styles.article}>
          {/* ── Header Card ── */}
          <div className={styles.header}>
            <button className={styles.shareBtn} onClick={() => setShowShareModal(true)} aria-label="Share Activity">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </button>

            <span className={styles.categoryBadge}>{category}</span>

            <h1 className={styles.title}>{title}</h1>

            <div 
              className={styles.hostRow} 
              onClick={(e) => { e.stopPropagation(); navigate(`/profile/${activity.hostUsername}`); }}
              style={{ cursor: 'pointer' }}
            >
              {isImageUrl(hostAvatar) ? (
                <img src={hostAvatar} alt={hostName} className={styles.avatar} />
              ) : (
                <DefaultAvatar className={styles.avatar} />
              )}
              <div className={styles.hostMeta}>
                <span className={styles.hostedBy}>Hosted by</span>
                <span className={styles.hostName}>{hostName}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className={styles.actionRow}>
              {isHost ? (
                <button className={styles.endBtn} onClick={handleEndActivity}>
                  End Activity
                </button>
              ) : isJoined ? (
                <button className={styles.joinedBtn} disabled>
                  <IconCheck /> Joined
                </button>
              ) : isRequested ? (
                <button className={styles.requestedBtn} disabled>
                  <IconCheck /> Request Sent
                </button>
              ) : (
                <button className={styles.joinBtn} onClick={handleJoin} disabled={isFull}>
                  {isFull ? 'Activity Full' : participationType === 'open' ? 'Join Activity' : 'Request to Join'}
                </button>
              )}

              {(isHost || isJoined) && (
                <button
                  className={styles.chatIconBtn}
                  onClick={() => {
                    const chatId = String(activity.id).startsWith('act_') ? activity.id : `act_${activity.id}`;
                    navigate(`/messages/${chatId}`);
                  }}
                  aria-label="Open Group Chat"
                  title="Open Group Chat"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                </button>
              )}

              <button
                className={`${styles.saveBtn} ${isSaved ? styles.savedIcon : ''}`}
                aria-label={isSaved ? "Unsave" : "Save"}
                onClick={handleSave}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* ── Body Grid ── */}
          <div className={styles.grid}>
            {/* Left: About + Discussion */}
            <div className={styles.mainContent}>
              {/* About */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>About</h2>
                <p className={styles.description}>{description}</p>
                {tags && tags.length > 0 && (
                  <div className={styles.tags}>
                    {tags.map(tag => (
                      <span key={tag} className={styles.tag}>#{tag}</span>
                    ))}
                  </div>
                )}
              </section>

            {/* Discussion */}
            <section className={styles.section} ref={discussionRef}>
              <h2 className={styles.sectionTitle}>Discussion</h2>

                <div className={styles.commentsList}>
                  {comments.map(c => (
                    <div key={c.id} className={styles.comment}>
                      <div className={styles.commentHeader}>
                        <span className={styles.commentAuthor}>{c.author}</span>
                        <span className={styles.commentTime}>{c.time}</span>
                      </div>
                      <p className={styles.commentText}>{c.text}</p>
                    </div>
                  ))}
                </div>

                <p className={styles.commentHint}>Ask anything...</p>

                <form onSubmit={handlePostComment} className={styles.commentForm}>
                <input
                  type="text"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Ask a question or share an update..."
                  className={styles.commentInput}
                  ref={commentInputRef}
                />
                  <button type="submit" className={styles.commentSubmit}>Post</button>
                </form>
              </section>
            </div>

            {/* Right: Details */}
            <div className={styles.sidebar}>
              <DetailsCard
                date={date}
                time={time}
                duration={duration}
                actLocation={actLocation}
                isOnline={isOnline}
                slotsFilled={slotsFilled}
                spotsLeft={spotsLeft}
                activity={activity}
              />
            </div>
          </div>
        </article>

        <ShareActivityModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          activity={activity}
        />

        <ConfirmModal
          title="End Activity"
          desc="Are you sure you want to end this activity? This will also delete the group chat."
          visible={showEndConfirm}
          onCancel={() => setShowEndConfirm(false)}
          onConfirm={confirmEndActivity}
          confirmText="End Activity"
        />

        <ActivityJoinedModal
          isOpen={showJoinedModal}
          onClose={() => setShowJoinedModal(false)}
          activity={activity}
        />
      </div>
    </main>
  );
}
