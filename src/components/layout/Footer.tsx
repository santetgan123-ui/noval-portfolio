'use client';

import Link from 'next/link';
import { GitHubIcon, LinkedInIcon, EmailIcon } from '@/components/ui';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold font-mono text-green-500 hover:text-green-400 transition-colors">
              NOVAL<span className="text-zinc-500">.</span>
            </Link>
            <p className="text-zinc-400 mt-4 max-w-md">
              {t.footer.description}
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-zinc-400 hover:text-green-500 transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-zinc-400 hover:text-green-500 transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-zinc-400 hover:text-green-500 transition-colors">
                  {t.nav.projects}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-400 hover:text-green-500 transition-colors">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t.footer.connect}</h4>
            <div className="flex space-x-4">
              <a
                href="https://github.com/santetgan123-ui"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-green-500 transition-colors"
                aria-label="GitHub"
              >
                <GitHubIcon className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com/in/noval-abdillah"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-green-500 transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="w-6 h-6" />
              </a>
              <a
                href="mailto:noval.abdillah223@gmail.com"
                className="text-zinc-400 hover:text-green-500 transition-colors"
                aria-label="Email"
              >
                <EmailIcon className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800 text-center">
          <p className="text-zinc-500">
            &copy; {currentYear} Noval Abdillah. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
