import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Background from '../components/common/Background';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import DashboardLayout from '../components/layout/DashboardLayout';
import RightPanel from '../components/layout/RightPanel';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileActivity from '../components/profile/ProfileActivity';
import BottomNav from '../components/layout/BottomNav';
import UserListModal from '../components/common/UserListModal';

export default function ProfilePage() {
  const { profileUsername } = useParams();
  const navigate = useNavigate();
  const { username } = useAuth();
  
  const targetUsername = profileUsername || username;
  
  const [modalType, setModalType] = useState(null); // 'followers' or 'following'

  const handleTabChange = (tab) => {
    navigate('/home');
  };

  const handleCommunityClick = (id) => {
    navigate('/home');
  };

  return (
    <>
      <Background />
      <Header variant="dashboard" />
      <DashboardLayout>
        <Sidebar activeTab="" onTabChange={handleTabChange} onCommunityClick={handleCommunityClick} />
        <main className="centre">
          <div className="profile">
            <ProfileHeader 
              profileUsername={targetUsername} 
              onViewFollowers={() => setModalType('followers')}
              onViewFollowing={() => setModalType('following')}
              onBack={() => navigate(-1)}
            />
            <ProfileActivity />
          </div>
        </main>
        <RightPanel>
          <div className="panel-card">
            <h3 className="panel-title">Quick Actions</h3>
            <button className="action-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Edit Profile
            </button>
            <button className="action-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Share Profile
            </button>
          </div>
        </RightPanel>
      </DashboardLayout>
      <BottomNav activeTab="" />
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
