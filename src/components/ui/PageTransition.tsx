'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip animation on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const overlay = overlayRef.current;
    const content = contentRef.current;

    if (!overlay || !content) return;

    // Reset scroll position immediately
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }

    // Create timeline for page transition
    const tl = gsap.timeline();

    // Phase 1: Exit - Overlay slides up from bottom
    tl.set(overlay, {
      yPercent: 100,
      display: 'block',
    })
    .to(overlay, {
      yPercent: 0,
      duration: 0.6,
      ease: 'power3.inOut',
    })
    // Phase 2: Content fade out during overlay
    .to(content, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
    }, '-=0.4')
    // Phase 3: Enter - Overlay slides up and out, content fades in
    .to(content, {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.in',
    }, '+=0.1')
    .to(overlay, {
      yPercent: -100,
      duration: 0.6,
      ease: 'power3.inOut',
    }, '-=0.3')
    .set(overlay, {
      display: 'none',
    });

    return () => {
      tl.kill();
    };
  }, [pathname]);

  return (
    <>
      {/* Page Transition Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9999] pointer-events-none hidden"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f1419 100%)',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Animated Logo/Text */}
            <div className="text-6xl font-bold font-mono text-green-500 animate-pulse">
              NOVAL<span className="text-zinc-500">.</span>
            </div>
            {/* Neon glow effect */}
            <div className="absolute inset-0 blur-2xl opacity-50 bg-green-500/30"></div>
          </div>
        </div>
        
        {/* Animated grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        ></div>
      </div>

      {/* Page Content */}
      <div ref={contentRef}>
        {children}
      </div>
    </>
  );
}
