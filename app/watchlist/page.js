'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function WatchlistPage() {
    const [movies, setMovies] = useState([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem('metflix_watchlist');
        if (stored) {
            try { setMovies(JSON.parse(stored)); } catch (e) {}
        }
    }, []);

    const removeFromWatchlist = (e, subjectId) => {
        e.preventDefault();
        const updated = movies.filter(m => m.subjectId !== subjectId);
        setMovies(updated);
        localStorage.setItem('metflix_watchlist', JSON.stringify(updated));
    };

    if (!mounted) return <div className="page-loading"><div className="spinner"></div></div>;

    return (
        <main className="main-content">
            <section className="results-section container" style={{ paddingTop: '2rem' }}>
                <div className="results-header">
                    <h1 className="section-title">My Watchlist</h1>
                </div>

                {movies.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#aaa' }}>
                        <h2>Your watchlist is empty.</h2>
                        <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>Save movies and series you want to watch later!</p>
                        <Link href="/" className="primary-btn" style={{ display: 'inline-block', marginTop: '2rem' }}>Explore Content</Link>
                    </div>
                ) : (
                    <div className="movies-grid">
                        {movies.map((m, idx) => (
                            <Link href={`/watch?detailPath=${encodeURIComponent(m.detailPath)}&subjectId=${m.subjectId}&type=${m.subjectType}`} key={idx} className="movie-card" style={{ textDecoration: 'none' }}>
                                <div className="poster-container">
                                    <Image src={m.coverUrl || 'https://via.placeholder.com/300x450'} alt={m.title} width={300} height={450} className="movie-poster" unoptimized />
                                </div>
                                <div className="movie-info">
                                    <h3 className="movie-title">{m.title}</h3>
                                    <div className="movie-meta">
                                        <span>{m.subjectType === 2 ? 'Series' : 'Movie'}</span>
                                        <button 
                                            onClick={(e) => removeFromWatchlist(e, m.subjectId)}
                                            style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '0.8rem' }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
