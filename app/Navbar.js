'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const q = searchParams.get('q');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isMovies = q === 'movies';
    const isSeries = q === 'series';
    const isHome = !q || q === 'trending';

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="glass-header">
            <div className="container header-container">
                <Link href="/?q=trending" className="logo" style={{ textDecoration: 'none' }}>
                    <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3" fill="var(--accent-color)" stroke="var(--accent-color)" />
                    </svg>
                    <span className="logo-text">MET<span className="logo-accent">FLIX</span></span>
                </Link>
                
                <button className="hamburger-btn" onClick={toggleMenu} aria-label="Toggle Menu">
                    <span className={`hamburger-line ${isMenuOpen ? 'open-1' : ''}`}></span>
                    <span className={`hamburger-line ${isMenuOpen ? 'open-2' : ''}`}></span>
                    <span className={`hamburger-line ${isMenuOpen ? 'open-3' : ''}`}></span>
                </button>

                <nav className={`nav-links ${isMenuOpen ? 'mobile-open' : ''}`}>
                    <Link href="/?q=trending" className={`nav-link${isHome && pathname === '/' ? ' active' : ''}`} onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link href="/?q=movies"   className={`nav-link${isMovies ? ' active' : ''}`} onClick={() => setIsMenuOpen(false)}>Movies</Link>
                    <Link href="/?q=series"   className={`nav-link${isSeries ? ' active' : ''}`} onClick={() => setIsMenuOpen(false)}>Series</Link>
                </nav>
            </div>
            {isMenuOpen && <div className="mobile-overlay" onClick={toggleMenu}></div>}
        </header>
    );
}
