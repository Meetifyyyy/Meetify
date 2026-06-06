import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import CommunityView from '../components/communities/CommunityView';

export default function CommunityDetailRoute() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { communities } = useData();

  const comm = communities[id];

  if (comm?.isUniversity) {
    return <Navigate to={`/colleges/${id}`} replace />;
  }

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
