import { INITIAL_COURSES } from '@/lib/db';
import CoursePlayer from './CoursePlayer';

export async function generateStaticParams() {
  return INITIAL_COURSES.map((course) => ({
    id: course.id,
  }));
}

export default function Page() {
  return <CoursePlayer />;
}
