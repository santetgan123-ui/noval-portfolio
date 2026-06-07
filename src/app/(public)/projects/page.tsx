import { Projects } from '@/components/projects';

export const metadata = {
  title: 'Projects | Noval Abdillah',
  description: 'Explore my portfolio of production-grade SaaS applications and full-stack projects built with Next.js, TypeScript, and modern web technologies.',
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      <Projects />
    </div>
  );
}
