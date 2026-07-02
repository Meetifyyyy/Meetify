import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useSmartBack } from '../hooks/useSmartBack';
import CollegeView from '../components/colleges/CollegeView';

export default function CollegeDetailRoute() {
  const navigate = useNavigate();
  const { id } = useParams();
  const goBack = useSmartBack();

  const handleBack = () => {
    goBack('/colleges');
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
