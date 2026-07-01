import { useNavigate, useParams } from 'react-router-dom';
import CollegeView from '../components/colleges/CollegeView';

export default function CollegeDetailRoute() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleBack = () => {
    navigate('/colleges');
  };

  const handlePostClick = (post, sourceContext, communityId) => {
    if (post.id) {
      navigate(`/post/${post.id}`, { state: { post, sourceContext, communityId } });
    }
  };

  return (
    <main className="centre centre-wide">
      <CollegeView 
        collegeId={id} 
        onBack={handleBack} 
        onPostClick={handlePostClick}
      />
    </main>
  );
}
