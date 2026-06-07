import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import '@/app/globals.css';
import { Navbar } from '@/components/layout';
import { Footer } from '@/components/layout';
import { SmoothScroll } from '@/components/ui';
import { PageTransition } from '@/components/ui';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const mono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Noval Abdillah | Full Stack SaaS Developer & AI-Assisted Engineer',
  description: 'Portfolio of Noval Abdillah, a Full Stack Developer specializing in building production-grade SaaS applications with Next.js, Node.js, and PostgreSQL. Expert in AI-assisted development using GitHub Copilot.',
  keywords: [
    'Full Stack Developer',
    'SaaS Engineer',
    'Next.js',
    'TypeScript',
    'Node.js',
    'PostgreSQL',
    'Supabase',
    'Stripe Integration',
    'AI-Assisted Development',
    'GitHub Copilot',
    'Bekasi',
    'Indonesia',
  ],
  authors: [{ name: 'Noval Abdillah' }],
  creator: 'Noval Abdillah',
  publisher: 'Noval Abdillah',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://novalabdillah.com',
    title: 'Noval Abdillah | Full Stack SaaS Developer & AI-Assisted Engineer',
    description: 'Building production-grade SaaS applications with modern technologies',
    siteName: 'Noval Abdillah Portfolio',
    images: [
      {
        url: 'https://novalabdillah.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Noval Abdillah Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Noval Abdillah | Full Stack SaaS Developer',
    description: 'Building production-grade SaaS applications with modern technologies',
    creator: '@novalabdillah',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

import { LanguageProvider } from '@/context/LanguageContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${mono.variable} font-sans bg-zinc-950 text-zinc-100`}
      >
        <LanguageProvider>
          <SmoothScroll>
            <PageTransition>
              <Navbar />
              <main className="min-h-screen pt-16">
                {children}
              </main>
              <Footer />
            </PageTransition>
          </SmoothScroll>
        </LanguageProvider>
      </body>
    </html>
  );
}
