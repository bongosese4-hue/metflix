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
            <Link href="#" className="bottom-nav-item">
                <span className="bottom-nav-icon">📺</span>
                <span>ShortTV</span>
            </Link>
            <Link href="#" className="bottom-nav-item">
                <span className="bottom-nav-icon">👑</span>
                <span>Premium</span>
            </Link>
            <Link href="/downloads" className={`bottom-nav-item ${pathname === '/downloads' ? 'active' : ''}`}>
                <span className="bottom-nav-icon">📥</span>
                <span>Downloads</span>
            </Link>
            <Link href="#" className="bottom-nav-item">
                <span className="bottom-nav-icon">👤</span>
                <span>Me</span>
            </Link>
        </nav>
    );
}
