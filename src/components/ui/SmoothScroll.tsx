'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    lenisRef.current = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });
    
    // Expose lenis globally for page transitions
    (window as any).lenis = lenisRef.current;

    // Sync Lenis with GSAP ScrollTrigger
    lenisRef.current.on('scroll', () => {
      ScrollTrigger.update();
    });

    // RAF loop
    const raf = (time: number) => {
      lenisRef.current?.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lenisRef.current?.destroy();
    };
  }, []);

  return <>{children}</>;
}
