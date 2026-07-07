'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="bottom-nav">
            <Link href="/" className={`bottom-nav-item ${pathname === '/' ? 'active' : ''}`}>
                <span className="bottom-nav-icon">🏠</span>
                <span>Home</span>
            </Link>
            <Link href="/?q=movies" className="bottom-nav-item">
                <span className="bottom-nav-icon">🎬</span>
                <span>Movies</span>
            </Link>
            <Link href="/?q=series" className="bottom-nav-item">
                <span className="bottom-nav-icon">📺</span>
                <span>Series</span>
            </Link>
            <Link href="/watchlist" className={`bottom-nav-item ${pathname === '/watchlist' ? 'active' : ''}`}>
                <span className="bottom-nav-icon">⭐</span>
                <span>Watchlist</span>
            </Link>
            <Link href="/history" className={`bottom-nav-item ${pathname === '/history' ? 'active' : ''}`}>
                <span className="bottom-nav-icon">🕒</span>
                <span>History</span>
            </Link>
        </nav>
    );
}
