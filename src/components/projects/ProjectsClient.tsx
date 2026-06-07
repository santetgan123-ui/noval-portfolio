'use client';

import Image from 'next/image';
import { Project } from '@/types';
import { GitHubIcon, ExternalLinkIcon } from '@/components/ui';
import { useLanguage } from '@/context/LanguageContext';

export default function ProjectsClient({ projects, limit }: { projects: Project[]; limit?: number }) {
  const { t } = useLanguage();
  const displayProjects = limit ? projects.slice(0, limit) : projects;

  return (
    <section id="projects" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.projects.title}</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            {t.projects.subtitle}
          </p>
        </div>

        {displayProjects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-zinc-500 font-mono">// No projects yet — add some via the admin dashboard</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const { t } = useLanguage();
  
  return (
    <article className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-green-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.08)]">
      <div className="relative aspect-video overflow-hidden bg-zinc-800">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-500 transition-colors">
          {project.title}
        </h3>
        <p className="text-zinc-400 text-sm mb-4 line-clamp-3">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-5">
          {project.tech_stack.map((tech) => (
            <span key={tech} className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded font-mono">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-4">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-400 hover:text-green-500 transition-colors text-sm"
            >
              <GitHubIcon className="w-4 h-4" />
              {t.projects.viewCode}
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-400 hover:text-green-500 transition-colors text-sm"
            >
              <ExternalLinkIcon className="w-4 h-4" />
              {t.projects.viewLive}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
