'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DownloadIcon } from '@/components/ui';
import { useLanguage } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

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
  const [resumeUrl, setResumeUrl] = useState('/resume/noval-abdillah.pdf');
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  useEffect(() => {
    // Use gsap.context for proper cleanup on unmount/re-renders in React 18+
    const ctx = gsap.context(() => {
      // Headline fade-up (removed the manual split-span logic that was destroying HTML)
      gsap.fromTo(
        headlineRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.3 }
      );

      // Subtitle fade-up
      gsap.fromTo(
        subtitleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.6, ease: 'power3.out' }
      );

      // CTA fade-up
      gsap.fromTo(
        ctaRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.9, ease: 'power3.out' }
      );
    }, containerRef);

    return () => ctx.revert(); // Cleanup animation state on unmount
  }, []);

  useEffect(() => {
    let active = true;

    const loadResumeUrl = async () => {
      try {
        const supabase = createClient();
        
        // Coba ambil dari database settings dulu
        const { data: settingsData } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'resume_url')
          .single();

        if (settingsData?.value) {
          setResumeUrl(settingsData.value);
        } else {
          // Fallback ke file fisik lama
          const { data } = supabase.storage.from('resume').getPublicUrl('resume.pdf');
          if (data?.publicUrl) {
            const response = await fetch(data.publicUrl, { method: 'HEAD' });
            if (active && response.ok) {
              setResumeUrl(data.publicUrl);
            }
          }
        }
      } catch {
        // fallback
      }
    };

    loadResumeUrl();

    return () => {
      active = false;
    };
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
            onClick={() => setIsResumeModalOpen(true)}
            className="px-8 py-4 border border-zinc-700 hover:border-green-500 text-zinc-300 hover:text-green-500 font-semibold rounded-lg transition-all duration-300 flex items-center gap-2"
          >
            <DownloadIcon className="w-5 h-5" />
            {t.hero.downloadResume}
          </button>
        </div>
      </div>

      {/* Modern PDF Viewer Modal */}
      {isResumeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col relative overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <h3 className="ml-2 text-sm font-medium text-zinc-300 font-mono">resume_noval_abdillah.pdf</h3>
              </div>
              <button 
                onClick={() => setIsResumeModalOpen(false)}
                className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* PDF Viewer Frame */}
            <div className="flex-1 bg-zinc-800">
              <iframe 
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(resumeUrl)}&embedded=true`} 
                className="w-full h-full border-none"
                title="Resume Preview"
              />
            </div>

            {/* Footer with Info */}
            <div className="bg-zinc-900 border-t border-zinc-800 p-3 text-center">
              <p className="text-xs text-zinc-500 font-mono">Sistem Preview PDF Aktif - Gunakan scroll untuk melihat</p>
            </div>
          </div>
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
