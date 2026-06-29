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
