import { INITIAL_COURSES } from '@/lib/db';

export function generateStaticParams() {
  return INITIAL_COURSES.map((course) => ({
    id: course.id,
  }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
