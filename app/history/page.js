'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HistoryPage() {
    const [movies, setMovies] = useState([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem('metflix_history');
        if (stored) {
            try { setMovies(JSON.parse(stored)); } catch (e) {}
        }
    }, []);

    const clearHistory = () => {
        setMovies([]);
        localStorage.removeItem('metflix_history');
    };

    if (!mounted) return <div className="page-loading"><div className="spinner"></div></div>;

    return (
        <main className="main-content">
            <section className="results-section container" style={{ paddingTop: '2rem' }}>
                <div className="results-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 className="section-title">Watch History</h1>
                    {movies.length > 0 && (
                        <button onClick={clearHistory} style={{ background: 'transparent', border: '1px solid #555', color: '#ccc', padding: '0.4rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
                            Clear All
                        </button>
                    )}
                </div>

                {movies.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#aaa' }}>
                        <h2>No watch history yet.</h2>
                        <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>Start watching movies and series to build your history!</p>
                        <Link href="/" className="primary-btn" style={{ display: 'inline-block', marginTop: '2rem' }}>Start Watching</Link>
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
                                        {m.lastWatched && <span style={{ color: '#888' }}>{new Date(m.lastWatched).toLocaleDateString()}</span>}
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
