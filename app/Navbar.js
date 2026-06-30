'use client';

import Link from 'next/link';

export default function Navbar() {
    return (
        <header className="glass-header">
            <div className="container header-container">
                <Link href="/?q=trending" className="logo" style={{ textDecoration: 'none' }}>
                    <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3" fill="var(--accent-color)" stroke="var(--accent-color)" />
                    </svg>
                    <span className="logo-text">MET<span className="logo-accent">FLIX</span></span>
                </Link>

                <nav className="nav-links">
                    <Link href="/?q=trending" className="nav-link">Home</Link>
                    <Link href="/?q=movies" className="nav-link">Movies</Link>
                    <Link href="/?q=series" className="nav-link">Series</Link>
                </nav>
            </div>
        </header>
    );
}
