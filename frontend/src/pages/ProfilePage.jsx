import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useSimulatedFetch } from '../hooks/useSimulatedFetch';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileAbout from '../components/profile/ProfileAbout';
import ProfileActivity from '../components/profile/ProfileActivity';
import ProfilePageHeader from '../components/profile/ProfilePageHeader';
import UserListModal from '../components/common/UserListModal';
import Skeleton from '../components/common/Skeleton';
import PostSkeleton from '../components/feed/PostSkeleton';
import { ErrorState } from '../components/common/StateViews';
import profileStyles from './ProfilePage.module.css';

function ProfileHeaderSkeleton() {
  return (
    <div style={{ background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: 'var(--border-glass)' }}>
      <Skeleton type="rect" width="100%" height="180px" style={{ borderRadius: 0 }} />
      <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
         <div style={{ marginTop: '-48px', marginBottom: '1rem' }}>
            <Skeleton type="circle" width="96px" height="96px" style={{ border: '4px solid var(--color-bg-main)' }} />
         </div>
         <Skeleton type="text" width="60%" height="1.5rem" style={{ marginBottom: '0.5rem' }} />
         <Skeleton type="text" width="40%" height="1rem" style={{ marginBottom: '1.5rem' }} />
         <div style={{ display: 'flex', gap: '2rem', width: '100%', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Skeleton type="rect" width="60px" height="40px" style={{ borderRadius: '8px' }} />
            <Skeleton type="rect" width="60px" height="40px" style={{ borderRadius: '8px' }} />
            <Skeleton type="rect" width="60px" height="40px" style={{ borderRadius: '8px' }} />
         </div>
         <Skeleton type="rect" width="100%" height="36px" style={{ borderRadius: '100px' }} />
      </div>
    </div>
  );
}

function ProfileAboutSkeleton() {
  return (
    <div style={{ background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem', border: 'var(--border-glass)' }}>
      <Skeleton type="text" width="30%" height="1.2rem" style={{ marginBottom: '1rem' }} />
      <Skeleton type="text" width="90%" height="0.8rem" />
      <Skeleton type="text" width="85%" height="0.8rem" />
      <Skeleton type="text" width="60%" height="0.8rem" />
      
      <div style={{ marginTop: '1.5rem' }}>
        <Skeleton type="text" width="20%" height="1rem" style={{ marginBottom: '0.8rem' }} />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Skeleton type="rect" width="60px" height="24px" style={{ borderRadius: '100px' }} />
          <Skeleton type="rect" width="70px" height="24px" style={{ borderRadius: '100px' }} />
          <Skeleton type="rect" width="50px" height="24px" style={{ borderRadius: '100px' }} />
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { profileUsername } = useParams();
  const navigate = useNavigate();
  const { username } = useAuth();
  const { getUserByUsername, currentUser } = useData();

  const targetUsername = profileUsername || username;
  const profileUser = getUserByUsername(targetUsername) || currentUser;

  const { isLoading, data: user, error, retry } = useSimulatedFetch(profileUser, 800, [profileUsername]);

  const [modalType, setModalType] = useState(null); // 'followers' or 'following'

  if (isLoading) {
    return (
      <main className="centre centre-wide animate-in">
        <div className={profileStyles.profileMainContent}>
          <ProfilePageHeader username={targetUsername} />
          <div className={profileStyles.profileSidebarFixed}>
            <ProfileHeaderSkeleton />
          </div>
          <div className={profileStyles.profileContentScrollable}>
            <div>
              <ProfileAboutSkeleton />
              <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--color-border-light)', marginBottom: '1rem', paddingBottom: '0.5rem' }}>
                <Skeleton type="text" width="60px" height="1rem" />
                <Skeleton type="text" width="60px" height="1rem" />
              </div>
              <PostSkeleton />
              <PostSkeleton />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="centre centre-wide animate-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <ErrorState onRetry={retry} />
      </main>
    );
  }

  return (
    <>
      <main className="centre centre-wide animate-in">
        <div className={profileStyles.profileMainContent}>
          <ProfilePageHeader username={targetUsername} />
          <div className={profileStyles.profileSidebarFixed}>
            <ProfileHeader
              profileUsername={targetUsername}
              onViewFollowers={() => setModalType('followers')}
              onViewFollowing={() => setModalType('following')}
            />
          </div>

          <div className={profileStyles.profileContentScrollable}>
            <div>
              <ProfileAbout profileUsername={targetUsername} />
              <ProfileActivity profileUsername={targetUsername} />
            </div>
          </div>
        </div>
      </main>

      {modalType && (
        <UserListModal
          type={modalType}
          profileUsername={targetUsername}
          onClose={() => setModalType(null)}
        />
      )}
    </>
  );
}
