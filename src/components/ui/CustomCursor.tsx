'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface CustomCursorProps {
  children: React.ReactNode;
}

export default function CustomCursor({ children }: CustomCursorProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e: MouseEvent) => {
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' });
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.35, ease: 'power3.out' });
    };

    const onEnter = () => {
      gsap.to(dot, { scale: 1.5, opacity: 0.4, duration: 0.25 });
      gsap.to(ring, { scale: 2.2, borderColor: '#22c55e', duration: 0.25 });
    };

    const onLeave = () => {
      gsap.to(dot, { scale: 1, opacity: 1, duration: 0.25 });
      gsap.to(ring, { scale: 1, borderColor: 'rgba(34,197,94,0.5)', duration: 0.25 });
    };

    document.addEventListener('mousemove', onMove);

    const interactives = document.querySelectorAll('a, button, input, textarea, [data-cursor]');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      document.removeEventListener('mousemove', onMove);
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-green-500 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 border border-green-500/50 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
      />
      {children}
    </>
  );
}
