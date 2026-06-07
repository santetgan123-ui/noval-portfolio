'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLanguage } from '@/context/LanguageContext';

export default function ProfileImage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Efek interaktif 3D saat kursor digerakkan
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -12; // Maksimal rotasi 12 derajat
    const rotateY = ((x - centerX) / centerX) * 12;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      ease: "power3.out",
      duration: 0.5
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      ease: "elastic.out(1, 0.5)",
      duration: 1.2
    });
  };

  // Efek mengambang (floating) konstan yang mulus
  useEffect(() => {
    if (!wrapperRef.current) return;
    gsap.to(wrapperRef.current, {
      y: -15,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, []);

  return (
    <div className="relative w-full aspect-[4/5] max-w-md mx-auto group perspective-[1200px]" ref={wrapperRef}>
      {/* Latar Belakang Bercahaya (Glow) */}
      <div className="absolute inset-0 bg-green-500/20 blur-[100px] rounded-[2rem] transition-opacity duration-700 group-hover:opacity-100 opacity-50" />
      
      {/* Kontainer Kartu 3D */}
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-full rounded-[2rem] border border-zinc-700/50 bg-zinc-900/40 p-3 lg:p-4 backdrop-blur-md shadow-2xl transition-colors duration-500 group-hover:border-green-500/50"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Pembungkus Gambar dengan efek Depth (Z-axis) */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-zinc-800" style={{ transform: 'translateZ(40px)' }}>
          <Image 
            src="/images/Profil.png"
            alt="Profil Noval Abdillah"
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Overlay Gradasi Hitam di Bawah */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-90" />
          
          {/* Konten Badge di dalam gambar */}
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between" style={{ transform: 'translateZ(20px)' }}>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">Noval Abdillah</h3>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-400 font-medium text-xs">{t.about.profileBadge}</span>
              </div>
            </div>
            
            <div className="h-12 w-12 rounded-xl bg-zinc-900/80 flex items-center justify-center border border-zinc-700 backdrop-blur-md shadow-xl rotate-3 group-hover:rotate-12 transition-transform duration-500">
              <span className="text-green-500 font-black text-lg">NA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
