import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CrewRightPanel.module.css';

function MiniRow({ title, meta, onClick }) {
  return (
    <div className={styles.miniRow} onClick={onClick}>
      <div className={styles.miniInfo}>
        <div className={styles.miniTitle}>{title}</div>
        {meta && <div className={styles.miniMeta}>{meta}</div>}
      </div>
    </div>
  );
}

function UpcomingPlans({ activities }) {
  if (!activities || activities.length === 0) return null;
  return (
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>Upcoming</h4>
      {activities.map(a => (
        <MiniRow key={a.id} title={a.title} meta={`${a.availability} · ${a.distance}`} />
      ))}
    </div>
  );
}

function PendingInvitations({ activities }) {
  const [dismissed, setDismissed] = useState({});
  if (!activities || activities.length === 0) return null;
  const visible = activities.filter((_, i) => !dismissed[i]);
  if (visible.length === 0) return null;
  return (
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>Invitations</h4>
      {visible.map((a, i) => {
        const idx = activities.indexOf(a);
        return (
          <div key={a.id} className={styles.inviteRow}>
            <div className={styles.miniInfo}>
              <div className={styles.miniTitle}>{a.title}</div>
              <div className={styles.miniMeta}>From {a.invitedBy}</div>
            </div>
            <div className={styles.inviteActs}>
              <button className={styles.acceptBtn} aria-label="Accept">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </button>
              <button className={styles.declineBtn} aria-label="Decline" onClick={() => setDismissed(p => ({ ...p, [idx]: true }))}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SavedActivities({ activities }) {
  if (!activities || activities.length === 0) return null;
  return (
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>Saved</h4>
      {activities.map(a => (
        <MiniRow key={a.id} title={a.title} meta={`${a.availability} · ${a.distance}`} />
      ))}
    </div>
  );
}

function RecentMatches({ activities, onViewProfile }) {
  const navigate = useNavigate();
  if (!activities || activities.length === 0) return null;
  return (
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>Matches</h4>
      {activities.slice(0, 2).map(a => (
        <MiniRow
          key={a.id}
          title={a.hostName}
          meta={`${a.category || 'Activity'} · ${a.distance}`}
          onClick={() => navigate(`/profile/${a.hostUsername}`)}
        />
      ))}
    </div>
  );
}

export default function CrewRightPanel({ upcomingPlans, pendingInvitations, savedActivities, recentMatches, onViewProfile }) {
  return (
    <aside className={styles.panel}>
      {upcomingPlans && upcomingPlans.length > 0 && <UpcomingPlans activities={upcomingPlans} />}
      {pendingInvitations && pendingInvitations.length > 0 && <PendingInvitations activities={pendingInvitations} />}
      {savedActivities && savedActivities.length > 0 && <SavedActivities activities={savedActivities} />}
      {recentMatches && recentMatches.length > 0 && <RecentMatches activities={recentMatches} onViewProfile={onViewProfile} />}
    </aside>
  );
}
