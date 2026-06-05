import { useNavigate, useParams } from 'react-router-dom';
import CommunityView from '../components/communities/CommunityView';

export default function CommunityDetailRoute() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleBack = () => {
    navigate('/communities');
  };

  const handlePostClick = (post, sourceContext, communityId) => {
    if (post.id) {
      navigate(`/post/${post.id}`, { state: { post, sourceContext, communityId } });
    }
  };

  return (
    <main className="centre centre-wide">
      <CommunityView 
        communityId={id} 
        onBack={handleBack} 
        onPostClick={handlePostClick}
      />
    </main>
  );
}
