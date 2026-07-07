'use client';

import Link from 'next/link';

export default function Navbar() {
    return (
        <header className="glass-header" style={{ paddingTop: '1rem', paddingBottom: '0.25rem' }}>
            <div className="container header-container" style={{ paddingTop: '0' }}>
                <Link href="/?q=trending" className="logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                    <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px', marginRight: '6px', filter: 'drop-shadow(0 2px 8px rgba(229,9,20,0.6))' }}>
                        <polygon points="5 3 19 12 5 21 5 3" fill="var(--accent-color)" stroke="var(--accent-color)" />
                    </svg>
                    {/* SVG text path for upward curve */}
                    <svg width="115" height="35" viewBox="0 0 115 35" style={{ overflow: 'visible', transform: 'translateY(2px)' }}>
                        <path id="metflix-curve" d="M 0,28 Q 57.5,36 115,28" fill="transparent" />
                        <text fontSize="26" fontWeight="900" letterSpacing="-0.5" fill="#fff" fontFamily="inherit" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                            <textPath href="#metflix-curve" startOffset="50%" textAnchor="middle">
                                MET<tspan fill="var(--accent-color)">FLIX</tspan>
                            </textPath>
                        </text>
                    </svg>
                </Link>

                <nav className="nav-links">
                    <Link href="/?q=trending" className="nav-link">Trending</Link>
                    <Link href="/?q=series" className="nav-link">TV/Series</Link>
                    <Link href="/?q=movies" className="nav-link">Movies</Link>
                    <Link href="/?q=anime" className="nav-link">Anime</Link>
                    <Link href="/watchlist" className="nav-link">Watchlist</Link>
                    <Link href="/history" className="nav-link">History</Link>
                </nav>
            </div>
        </header>
    );
}
