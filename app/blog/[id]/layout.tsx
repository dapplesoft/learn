import { INITIAL_BLOGS } from '@/lib/db';

export function generateStaticParams() {
  return INITIAL_BLOGS.map((blog) => ({
    id: blog.id,
  }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
