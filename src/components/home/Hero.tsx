'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DownloadIcon, CloseIcon } from '@/components/ui';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

// Dynamically import Canvas3D to avoid SSR issues
const Canvas3D = dynamic(() => import('@/components/canvas/Canvas3D'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
      <svg className="animate-spin w-12 h-12 text-green-500" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  ),
});

// Suppress THREE.Clock deprecation warning from R3F
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('THREE.Clock')) return;
    originalWarn(...args);
  };
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const [resumeUrl, setResumeUrl] = useState('/resume/CV_Frontend_Backend (1).pdf');
  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headlineRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.3 }
      );
      gsap.fromTo(
        subtitleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.6, ease: 'power3.out' }
      );
      gsap.fromTo(
        ctaRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.9, ease: 'power3.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    let active = true;
    const loadResumeUrl = async () => {
      try {
        const supabase = createClient();
        const { data: settingsData } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'resume_url')
          .single();

        if (settingsData?.value && active) {
          setResumeUrl(settingsData.value);
        }
      } catch (error) {
        console.error('Error loading resume:', error);
      }
    };
    loadResumeUrl();
    return () => { active = false; };
  }, []);

  return (
    <section id="home" ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas3D />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/50 to-zinc-950 z-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
        <h1
          ref={headlineRef}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-none flex flex-col items-center gap-2"
        >
          <span>NOVAL ABDILLAH</span>
          <span className="text-3xl md:text-5xl lg:text-6xl text-zinc-300">{t.hero.role}</span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed font-mono"
        >
          {t.hero.subtitle}
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/projects"
            className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]"
          >
            {t.hero.viewProjects}
          </Link>
          <button
            onClick={() => setShowResume(true)}
            className="px-8 py-4 border border-zinc-700 hover:border-green-500 text-zinc-300 hover:text-green-500 font-semibold rounded-lg transition-all duration-300 flex items-center gap-2"
          >
            <DownloadIcon className="w-5 h-5" />
            {t.hero.downloadResume}
          </button>
        </div>
      </div>

      {/* Resume Preview Modal */}
      {showResume && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-6 animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl h-[85vh] bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
              <h3 className="text-xl font-bold text-white tracking-tight">Curriculum Vitae</h3>
              <button
                onClick={() => setShowResume(false)}
                className="p-2 hover:bg-zinc-800 rounded-full transition-colors group"
                aria-label="Close modal"
              >
                <CloseIcon className="w-6 h-6 text-zinc-400 group-hover:text-white" />
              </button>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 bg-zinc-950 overflow-hidden relative">
              <iframe
                src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                className="w-full h-full border-none"
                title="Resume Preview"
              />
            </div>

            {/* Modal Footer (Optional: Quick actions) */}
            <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-end gap-4">
              <p className="text-xs text-zinc-500 mr-auto font-mono uppercase tracking-widest hidden sm:block">
                Noval Abdillah Portfolio
              </p>
              <button
                onClick={() => setShowResume(false)}
                className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all text-sm font-semibold"
              >
                Tutup
              </button>
              <a
                href={resumeUrl}
                download
                className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-all text-sm font-semibold shadow-[0_0_15px_rgba(34,197,94,0.3)]"
              >
                Download PDF
              </a>
            </div>
          </div>
          {/* Backdrop Close Trigger */}
          <div 
            className="absolute inset-0 -z-10" 
            onClick={() => setShowResume(false)} 
          />
        </div>
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 border-2 border-zinc-600 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-green-500 rounded-full" />
        </div>
      </div>
    </section>
  );
}
