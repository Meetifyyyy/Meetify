import { useNavigate } from 'react-router-dom';
import CollegesBrowse from '../components/colleges/CollegesBrowse';

export default function CollegesRoute() {
  const navigate = useNavigate();

  const handleOpenCollege = (id) => {
    navigate(`/colleges/${id}`);
  };

  return (
    <main className="centre centre-wide animate-in">
      <CollegesBrowse onOpenCollege={handleOpenCollege} />
    </main>
  );
}
