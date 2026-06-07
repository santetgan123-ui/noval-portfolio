'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { GitHubIcon, LinkedInIcon, EmailIcon, InstagramIcon } from '@/components/ui';
import { useLanguage } from '@/context/LanguageContext';

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (!sectionRef.current) return;

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
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t.contact.title}
            </h2>
            <p className="text-zinc-300 text-lg leading-relaxed mb-8">
              {t.contact.subtitle}
            </p>

            <div className="space-y-4">
              <a
                href="mailto:noval.abdillah223@gmail.com"
                className="flex items-center gap-4 p-4 border border-zinc-800 rounded-lg hover:border-green-500 transition-colors group"
              >
                <div className="p-3 bg-zinc-900 rounded-lg group-hover:bg-green-500/10 transition-colors">
                  <EmailIcon className="w-6 h-6 text-zinc-400 group-hover:text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Email</p>
                  <p className="text-white font-medium">noval.abdillah223@gmail.com</p>
                </div>
              </a>

              <a
                href="https://github.com/santetgan123-ui"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 border border-zinc-800 rounded-lg hover:border-green-500 transition-colors group"
              >
                <div className="p-3 bg-zinc-900 rounded-lg group-hover:bg-green-500/10 transition-colors">
                  <GitHubIcon className="w-6 h-6 text-zinc-400 group-hover:text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">GitHub</p>
                  <p className="text-white font-medium">github.com/santetgan123-ui</p>
                </div>
              </a>

              <a
                href="https://linkedin.com/in/noval-abdillah"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 border border-zinc-800 rounded-lg hover:border-green-500 transition-colors group"
              >
                <div className="p-3 bg-zinc-900 rounded-lg group-hover:bg-green-500/10 transition-colors">
                  <LinkedInIcon className="w-6 h-6 text-zinc-400 group-hover:text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">LinkedIn</p>
                  <p className="text-white font-medium">linkedin.com/in/noval-abdillah</p>
                </div>
              </a>

              <a
                href="https://instagram.com/novalnkw.__"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 border border-zinc-800 rounded-lg hover:border-green-500 transition-colors group"
              >
                <div className="p-3 bg-zinc-900 rounded-lg group-hover:bg-green-500/10 transition-colors">
                  <InstagramIcon className="w-6 h-6 text-zinc-400 group-hover:text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Instagram</p>
                  <p className="text-white font-medium">@novalnkw.__</p>
                </div>
              </a>
            </div>
          </div>

          <div ref={contentRef} className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-xl shadow-black/50">
            <h3 className="text-2xl font-bold text-white mb-6">{t.contact.title}</h3>
            <form className="space-y-6">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-zinc-300 mb-2">
                  {t.contact.nameLabel}
                </label>
                <input
                  type="text"
                  id="contact-name"
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
                  placeholder={t.contact.namePlaceholder}
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-zinc-300 mb-2">
                  {t.contact.emailLabel}
                </label>
                <input
                  type="email"
                  id="contact-email"
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
                  placeholder={t.contact.emailPlaceholder}
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-zinc-300 mb-2">
                  {t.contact.messageLabel}
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors resize-none"
                  placeholder={t.contact.messagePlaceholder}
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-green-500 hover:bg-green-400 text-zinc-950 font-bold rounded-lg transition-colors"
              >
                {t.contact.sendMessage}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
