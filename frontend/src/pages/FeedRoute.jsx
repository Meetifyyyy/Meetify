import { useNavigate } from 'react-router-dom';
import Feed from '../components/feed/Feed';
import RightPanel, { QuickActions, OnlineFriends, UpcomingEvents } from '../components/layout/RightPanel';

export default function FeedRoute() {
  const navigate = useNavigate();

  const handlePostClick = (post, sourceContext, communityId) => {
    const postId = post.id;
    if (postId) {
      navigate(`/post/${postId}`, { state: { post, sourceContext, communityId } });
    }
  };

  const quickActions = [
    {
      label: 'Find Crew',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>,
      onClick: () => navigate('/crew'),
    },
    {
      label: 'Find People',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
      onClick: () => navigate('/search'),
    },
    {
      label: 'Send Message',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
      onClick: () => navigate('/messages'),
    },
  ];

  return (
    <>
      <main className="centre animate-in">
        <Feed onPostClick={handlePostClick} />
      </main>
      <RightPanel className="animate-in">
        <QuickActions actions={quickActions} />
        <OnlineFriends />
        <UpcomingEvents />
      </RightPanel>
    </>
  );
}
