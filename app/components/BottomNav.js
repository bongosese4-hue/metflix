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
            <Link href="/?q=anime" className="bottom-nav-item">
                <span className="bottom-nav-icon">⚡</span>
                <span>Anime</span>
            </Link>
        </nav>
    );
}
