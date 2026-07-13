import { Suspense } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './Navbar';
import BottomNav from './components/BottomNav';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '600', '700', '800'],
});

const BASE_URL = 'https://metflix.vercel.app'; // ← update to your final domain

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "MetFlix | Stream & Download Movies Free",
    template: "%s | MetFlix",
  },
  description: "Watch and download the latest movies, series, anime and K-drama in HD — free. No subscription needed.",
  keywords: [
    "movies", "free movies", "watch movies online", "download movies", "series", "tv shows",
    "metflix", "free series", "streaming", "1080p", "4k", "watch free",
    "latest movies", "hollywood", "bollywood", "nollywood", "anime", "kdrama",
    "download series", "free streaming", "movie app", "best movie app",
    "netflix alternative", "free netflix", "watch online", "cinema", "hd movies",
    "action movies", "comedy movies", "horror movies", "sci-fi movies",
    "watch series online", "free tv shows", "latest series",
    "best streaming site", "download free movies", "watch 4k movies",
    "1080p movies free", "latest hollywood movies", "new releases",
    "2026 movies", "2026 series", "trending movies", "trending series",
  ],
  authors: [{ name: "MetFlix" }],
  creator: "MetFlix",
  publisher: "MetFlix",
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
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "MetFlix",
    title: "MetFlix | Stream & Download Movies Free",
    description: "Watch and download the latest movies, series, anime and K-drama in HD — free. No subscription needed.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "MetFlix - Free HD Streaming",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MetFlix | Stream & Download Movies Free",
    description: "Watch and download the latest movies, series, anime and K-drama in HD — free.",
    images: [`${BASE_URL}/og-image.png`],
    creator: "@metflix",
  },
  verification: {
    // ↓ Paste your GSC verification code here after registering
    google: "yfLIsxVRll444OC5LaY7ipGFV3gTYAY0SzIwSPU4RkA",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'MetFlix',
  url: BASE_URL,
  description: 'Watch and download the latest movies, series, anime and K-drama in HD — free.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* JSON-LD structured data for Google rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {/* Ambient glow background */}
        <div className="background-effects">
          <div className="glow-orb top-left"></div>
          <div className="glow-orb bottom-right"></div>
        </div>

        {/* Navbar - wrapped in Suspense because it uses useSearchParams */}
        <Suspense fallback={
          <header className="glass-header">
            <div className="container header-container">
              <span className="logo-text">MET<span className="logo-accent">FLIX</span></span>
            </div>
          </header>
        }>
          <Navbar />
        </Suspense>

        {children}

        <BottomNav />
      </body>
    </html>
  );
}
