import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Background from '../components/common/Background';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import DashboardLayout from '../components/layout/DashboardLayout';
import RightPanel, { QuickActions, OnlineFriends, UpcomingEvents } from '../components/layout/RightPanel';
import Feed from '../components/feed/Feed';
import CommunitiesBrowse from '../components/communities/CommunitiesBrowse';
import CommunityView from '../components/communities/CommunityView';
import MessagesLayout from '../components/messages/MessagesLayout';
import BottomNav from '../components/layout/BottomNav';
import FollowButton from '../components/common/FollowButton';
import { communities } from '../data/communities';

export default function HomePage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'home');

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  const [activeCommunity, setActiveCommunity] = useState(null);
  const [communityRightPanel, setCommunityRightPanel] = useState('about');

  const handleTabChange = (tab) => {
    setActiveCommunity(null);
    setActiveTab(tab);
  };

  const handleOpenCommunity = (id) => {
    setActiveCommunity(id);
    setActiveTab('community-detail');
    setCommunityRightPanel('about');
  };

  const handleBackFromCommunity = () => {
    setActiveCommunity(null);
    setActiveTab('communities');
  };

  const isWide = activeTab === 'communities' || activeTab === 'messages';

  const quickActions = [
    {
      label: 'New Meeting',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
    },
    {
      label: 'Add Friend',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    },
    {
      label: 'Send Message',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
    },
  ];

  const renderCentre = () => {
    if (activeTab === 'community-detail' && activeCommunity) {
      return (
        <main className="centre">
          <CommunityView 
            communityId={activeCommunity} 
            onBack={handleBackFromCommunity} 
            onViewMembers={() => setCommunityRightPanel('members')} 
          />
        </main>
      );
    }
    if (activeTab === 'communities') {
      return (
        <main className="centre centre-wide">
          <CommunitiesBrowse onOpenCommunity={handleOpenCommunity} />
        </main>
      );
    }
    if (activeTab === 'messages') {
      return (
        <main className="centre centre-wide centre--messages">
          <MessagesLayout />
        </main>
      );
    }
    return (
      <main className="centre">
        <Feed />
      </main>
    );
  };

  const renderRightPanel = () => {
    if (isWide) return null;

    if (activeTab === 'community-detail' && activeCommunity) {
      const comm = communities[activeCommunity];
      if (!comm) return null;
      if (communityRightPanel === 'members') {
        return (
          <RightPanel>
            <div className="panel-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 className="panel-title" style={{ margin: 0 }}>Members ({comm.members.toLocaleString()})</h3>
                <button onClick={() => setCommunityRightPanel('about')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {comm.memberList.map((m, i) => {
                  const mUsername = m.name.toLowerCase().replace(/\s+/g, '');
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Link to={`/profile/${mUsername}`} style={{ textDecoration: 'none' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: comm.tagColor, color: '#fff', fontSize: '0.85rem', fontWeight: 600, flexShrink: 0, fontFamily: 'Outfit, sans-serif' }}>{m.avatar}</div>
                      </Link>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Link to={`/profile/${mUsername}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#18181B', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
                        </Link>
                        <div style={{ fontSize: '0.75rem', color: '#71717A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.role}</div>
                      </div>
                      {m.admin && <div style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', background: 'rgba(109, 93, 252, 0.1)', color: '#6D5DFC', borderRadius: '6px', fontWeight: 700, textTransform: 'uppercase' }}>Admin</div>}
                      {!m.admin && <FollowButton targetUsername={mUsername} size="sm" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </RightPanel>
        );
      }

      return (
        <RightPanel>
          <div className="panel-card">
            <h3 className="panel-title">About {comm.name}</h3>
            <p style={{ fontSize: '0.85rem', color: '#71717A', lineHeight: 1.6, marginBottom: '1.5rem' }}>{comm.desc}</p>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#18181B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.85rem' }}>Community Rules</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ fontSize: '0.82rem', color: '#3F3F46', display: 'flex', gap: '0.5rem' }}><span style={{ color: '#6D5DFC', fontWeight: 700 }}>1.</span> Be respectful and welcoming</li>
              <li style={{ fontSize: '0.82rem', color: '#3F3F46', display: 'flex', gap: '0.5rem' }}><span style={{ color: '#6D5DFC', fontWeight: 700 }}>2.</span> No spam or self-promotion</li>
              <li style={{ fontSize: '0.82rem', color: '#3F3F46', display: 'flex', gap: '0.5rem' }}><span style={{ color: '#6D5DFC', fontWeight: 700 }}>3.</span> Keep discussions on topic</li>
              <li style={{ fontSize: '0.82rem', color: '#3F3F46', display: 'flex', gap: '0.5rem' }}><span style={{ color: '#6D5DFC', fontWeight: 700 }}>4.</span> Help others learn and grow</li>
            </ul>
          </div>
        </RightPanel>
      );
    }

    return (
      <RightPanel>
        <QuickActions actions={quickActions} />
        <OnlineFriends />
        <UpcomingEvents />
      </RightPanel>
    );
  };

  return (
    <>
      <Background />
      <Header variant="dashboard" activeTab={activeTab} />
      <DashboardLayout wide={isWide}>
        <Sidebar
          activeTab={activeTab === 'community-detail' ? 'communities' : activeTab}
          onTabChange={handleTabChange}
          onCommunityClick={handleOpenCommunity}
        />
        {renderCentre()}
        {renderRightPanel()}
      </DashboardLayout>
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </>
  );
}
