import { getTours } from '@/lib/api/tour';
import ToursHorizontalExperience from './ToursHorizontalExperience';

export default async function ToursPage() {
  const tours = await getTours();

  return <ToursHorizontalExperience tours={tours} />;
}
