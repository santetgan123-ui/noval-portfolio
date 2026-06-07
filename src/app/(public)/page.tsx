import { Hero } from '@/components/home';
import { Projects } from '@/components/projects';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="relative">
        <Projects limit={3} />
        <div className="flex justify-center pb-24 bg-zinc-950">
          <Link 
            href="/projects"
            className="px-8 py-3 border border-green-500 text-green-500 hover:bg-green-500 hover:text-zinc-950 font-mono rounded-lg transition-all duration-300"
          >
            SEE ALL PROJECTS
          </Link>
        </div>
      </div>
    </div>
  );
}
