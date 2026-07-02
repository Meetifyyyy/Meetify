import { useNavigate } from 'react-router-dom';
import Feed from '../components/feed/Feed';
import RightPanel, { NotificationsActivity, OnlineFriends, UpcomingEvents } from '../components/layout/RightPanel';

export default function FeedRoute() {
  const navigate = useNavigate();

  const handlePostClick = (post, sourceContext, communityId) => {
    const postId = post.id;
    if (postId) {
      navigate(`/post/${postId}`, { state: { post, sourceContext, communityId } });
    }
  };



  return (
    <>
      <main className="centre animate-in">
        <Feed onPostClick={handlePostClick} />
      </main>
      <RightPanel className="animate-in">
        <OnlineFriends />
        <NotificationsActivity />
        <UpcomingEvents />
      </RightPanel>
    </>
  );
}
