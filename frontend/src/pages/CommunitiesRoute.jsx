import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import CommunitiesBrowse from '../components/communities/CommunitiesBrowse';

export default function CommunitiesRoute() {
  const navigate = useNavigate();

  const handleOpenCommunity = (id) => {
    navigate(`/communities/${id}`);
  };

  return (
    <PageLayout>
      <CommunitiesBrowse onOpenCommunity={handleOpenCommunity} />
    </PageLayout>
  );
}
