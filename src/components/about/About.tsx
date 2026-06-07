'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import dynamic from 'next/dynamic';
import { GitHubIcon, LinkedInIcon, EmailIcon, CheckIcon } from '@/components/ui';

import { ProfileImage } from '@/components/about';
import { useLanguage } from '@/context/LanguageContext';

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const [selectedCert, setSelectedCert] = useState<{title: string; img: string} | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Standard GSAP animation on mount, without ScrollTrigger since this is a dedicated page
    gsap.fromTo(
      titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );

    if (contentRef.current) {
      gsap.fromTo(
        Array.from(contentRef.current.children),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.2, ease: 'power3.out' }
      );
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-white mb-16 text-center">
          {t.about.title}
        </h2>

        <div ref={contentRef} className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: 3D Profile Picture */}
          <div className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-green-500/10 blur-[100px] rounded-full pointer-events-none" />
            <ProfileImage />
          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2 space-y-6">
            <h3 className="text-2xl font-semibold text-green-500">{t.about.role}</h3>
            <p className="text-zinc-300 leading-relaxed text-lg">
              {t.about.p1}
            </p>
            <p className="text-zinc-300 leading-relaxed text-lg">
              {t.about.p2}
            </p>
            <p className="text-zinc-300 leading-relaxed text-lg">
              {t.about.p3}
            </p>

            <div className="p-6 border border-zinc-800 rounded-lg bg-zinc-900/50 mt-8">
              <h4 className="text-lg font-semibold text-white mb-4">{t.about.techStack}</h4>
              <div className="flex flex-wrap gap-2">
                {['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Supabase', 'Tailwind CSS', 'Three.js', 'GSAP', 'AI Prompting'].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-zinc-800 text-zinc-100 text-sm rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="p-6 border border-zinc-800 rounded-lg bg-zinc-900/50">
              <h4 className="text-lg font-semibold text-white mb-4">{t.about.officeTools}</h4>
              <div className="flex flex-wrap gap-2">
                {['Microsoft Excel', 'Microsoft Word', 'Microsoft PowerPoint'].map((tool) => (
                  <span key={tool} className="px-3 py-1 bg-zinc-800 text-zinc-100 text-sm rounded-full">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 border border-zinc-800 rounded-lg bg-zinc-900/50">
              <h4 className="text-lg font-semibold text-white mb-4">{t.about.certifications}</h4>
              <ul className="space-y-4">
                <li className="flex items-start justify-between gap-3">
                  <div className="flex gap-3 items-start">
                    <div className="mt-1 text-green-500">
                      <CheckIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-white font-medium">{t.about.aiAssisted}</span>
                      <span className="text-zinc-400 text-sm">GitHub Copilot (Microsoft Applied Skills)</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedCert({ title: t.about.aiAssisted, img: '/cert-github.png' })}
                    className="px-3 py-1 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-white rounded-md transition-colors whitespace-nowrap"
                  >
                    {t.about.previewCert}
                  </button>
                </li>
                <li className="flex items-start justify-between gap-3">
                  <div className="flex gap-3 items-start">
                    <div className="mt-1 text-green-500">
                      <CheckIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-white font-medium">{t.about.problemSolving}</span>
                      <span className="text-zinc-400 text-sm">HackerRank</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedCert({ title: t.about.problemSolving, img: '/cert-hackerrank.png' })}
                    className="px-3 py-1 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-white rounded-md transition-colors whitespace-nowrap"
                  >
                    {t.about.previewCert}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Preview Modal */}
      {selectedCert && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedCert(null)}
        >
          <div 
            className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h3 className="text-lg font-semibold text-white">{selectedCert.title}</h3>
              <button 
                onClick={() => setSelectedCert(null)}
                className="text-zinc-400 hover:text-white transition-colors p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-4 flex items-center justify-center bg-zinc-950 min-h-[300px] sm:min-h-[400px] relative">
              <div className="relative w-full aspect-[4/3] bg-zinc-800 flex items-center justify-center rounded border border-zinc-700 overflow-hidden">
                <Image 
                  src={selectedCert.img} 
                  alt={selectedCert.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
