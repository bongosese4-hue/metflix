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

export const metadata = {
  title: "MetFlix | Midnight Cinema",
  description: "Premium VOD streaming. Watch or download movies and series in up to 1080p.",
  keywords: [
    "movies", "free movies", "watch movies online", "download movies", "series", "tv shows", 
    "netflix", "metflix", "free series", "streaming", "1080p", "4k", "watch free", 
    "latest movies", "hollywood", "bollywood", "nollywood", "anime", "kdrama", 
    "download series", "free streaming", "movie app", "best movie app", "metflix app", 
    "netflix alternative", "free netflix", "watch online", "cinema", "hd movies", 
    "free hd", "action movies", "comedy movies", "horror movies", "sci-fi movies",
    "watch series online", "free tv shows", "latest series", "watch netflix free", 
    "netflix movies", "netflix series", "best streaming site", "download free movies", 
    "watch 4k movies", "1080p movies free", "latest hollywood movies", "new releases",
    "2026 movies", "2026 series", "trending movies", "trending series"
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
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
