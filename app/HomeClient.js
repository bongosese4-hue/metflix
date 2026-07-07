'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

export default function HomeClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('Trending Now');
    const [bannerIndex, setBannerIndex] = useState(0);
    const abortControllerRef = useRef(null);

    useEffect(() => {
        if (movies.length === 0) return;
        const interval = setInterval(() => {
            setBannerIndex((prev) => (prev + 1) % Math.min(5, movies.length));
        }, 5000);
        return () => clearInterval(interval);
    }, [movies]);

    useEffect(() => {
        const qParam = searchParams.get('q');
        if (qParam === 'movies') {
            setTitle('Trending Movies');
            setQuery('');
            fetchMultiple([{q: '2026', type: 1}, {q: 'avengers', type: 1}, {q: 'matrix', type: 1}]);
        } else if (qParam === 'series') {
            setTitle('Trending Series');
            setQuery('');
            fetchMultiple([{q: '2026', type: 2}, {q: 'breaking', type: 2}, {q: 'boys', type: 2}]);
        } else if (qParam && qParam !== 'trending') {
            setTitle(`Search Results for "${qParam}"`);
            setQuery(qParam);
            fetchMultiple([{q: qParam, type: 0}]); // Single search
        } else {
            setTitle('2026 Latest Releases');
            fetchMultiple([{q: '2026', type: 0}, {q: 'latest', type: 0}]);
        }
    }, [searchParams]);

    const fetchMultiple = async (queries) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        setLoading(true);
        setError(null);
        setMovies([]);
        try {
            const promises = queries.map(queryObj => 
                fetch(`/api/search?q=${encodeURIComponent(queryObj.q)}&type=${queryObj.type}`, { signal }).then(r => r.json())
            );
            const results = await Promise.all(promises);
            let combined = [];
            results.forEach(data => {
                if (data.data && data.data.items) {
                    combined = combined.concat(data.data.items);
                }
            });
            // Remove duplicates by subjectId
            const unique = [];
            const seen = new Set();
            for (const m of combined) {
                if (!seen.has(m.subjectId)) {
                    seen.add(m.subjectId);
                    unique.push(m);
                }
            }
            setMovies(unique);
        } catch (err) {
            if (err.name === 'AbortError') return;
            setError(err.message);
        }
        setLoading(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <main className="main-content">
            {/* Netflix-Style Mosaic Background */}
            {movies.length > 0 && (
                <div className="mosaic-background">
                    <div className="mosaic-grid">
                        {movies.slice(0, 30).map((m, i) => (
                            <Image key={`mosaic-${i}`} src={m.cover?.url || 'https://via.placeholder.com/300x450'} alt="" width={300} height={450} />
                        ))}
                    </div>
                    <div className="mosaic-overlay"></div>
                </div>
            )}

            {/* Hero Section (Hidden on Mobile) */}
            <section className="hero-section container">
                <div className="hero-content">
                    <h1 className="hero-title">Cinematic Brilliance.<br />Zero Interruptions.</h1>
                    <p className="hero-subtitle">Experience the ultimate collection of blockbuster movies and binge-worthy series in stunning 4K. Completely free. No strings attached.</p>

                    <form className="search-bar" onSubmit={handleSearch}>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search for movies, series, or actors..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button type="submit" className="primary-btn search-btn">
                            Search
                        </button>
                    </form>
                </div>
            </section>

            {/* Mobile Search and Tabs (Hidden on Desktop) */}
            <div className="container" style={{ display: 'block' }}>
                <form className="search-bar-mobile" onSubmit={handleSearch}>
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Search for movies, series..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </form>

                <div className="category-tabs">
                    <div className="category-tab active" onClick={() => router.push('/?q=trending')}>Trending</div>
                    <div className="category-tab" onClick={() => router.push('/?q=series')}>TV/Series</div>
                    <div className="category-tab" onClick={() => router.push('/?q=movies')}>Movie</div>
                    <div className="category-tab" onClick={() => router.push('/?q=anime')}>Anime</div>
                </div>

                <div className="category-tabs" style={{ marginBottom: '2rem' }}>
                    <div className="category-tab" style={{fontSize: '0.85rem', background: '#333', padding: '0.3rem 0.8rem', borderRadius: '20px'}}>Hollywood</div>
                    <div className="category-tab" style={{fontSize: '0.85rem', background: '#333', padding: '0.3rem 0.8rem', borderRadius: '20px'}}>Nollywood</div>
                    <div className="category-tab" style={{fontSize: '0.85rem', background: '#333', padding: '0.3rem 0.8rem', borderRadius: '20px'}}>Bollywood</div>
                    <div className="category-tab" style={{fontSize: '0.85rem', background: '#333', padding: '0.3rem 0.8rem', borderRadius: '20px'}}>Western</div>
                    <div className="category-tab" style={{fontSize: '0.85rem', background: '#333', padding: '0.3rem 0.8rem', borderRadius: '20px'}}>K-Drama</div>
                    <div className="category-tab" style={{fontSize: '0.85rem', background: '#333', padding: '0.3rem 0.8rem', borderRadius: '20px'}}>Filter ▼</div>
                </div>

                {/* Mobile Slider Banner */}
                {movies.length > 0 && (
                    <div className="mobile-banner-carousel">
                        <div className="banner-track" style={{ transform: `translateX(-${bannerIndex * 100}%)` }}>
                            {movies.slice(0, 5).map((m, idx) => {
                                const cover = m.cover?.url || '';
                                const year = m.releaseDate ? m.releaseDate.split('-')[0] : '';
                                const sT = m.subjectType || 1;
                                const wUrl = `/watch?detailPath=${encodeURIComponent(m.detailPath)}&subjectId=${m.subjectId}&type=${sT}`;
                                return (
                                    <div className="banner-slide" key={`banner-${idx}`}>
                                        <div className="banner-image" style={{ backgroundImage: `url('${cover}')` }}></div>
                                        <div className="banner-overlay"></div>
                                        <div className="banner-content">
                                            <h2 className="banner-title">{m.title}</h2>
                                            <div className="banner-meta">
                                                <span>{year}</span>
                                                <span>{sT === 2 ? 'Series' : 'Movie'}</span>
                                            </div>
                                            <Link href={wUrl} className="primary-btn banner-btn">
                                                ▶ Play Now
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="banner-indicators">
                            {movies.slice(0, 5).map((_, idx) => (
                                <div key={idx} className={`indicator ${idx === bannerIndex ? 'active' : ''}`}></div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Results Section */}
            <section className="results-section container">
                <div className="results-header">
                    <h2 id="resultsTitle" className="section-title">{title}</h2>
                </div>

                {loading && (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Searching universe...</p>
                    </div>
                )}

                {error && (
                    <p style={{ textAlign: 'center', color: '#ff4444', padding: '2rem' }}>
                        Error: {error}
                    </p>
                )}

                {!loading && !error && movies.length === 0 && (
                    <p className="text-secondary" style={{ textAlign: 'center', padding: '2rem' }}>
                        No movies found. Try another search.
                    </p>
                )}

                {!loading && movies.length > 0 && (
                    <div className="movies-grid">
                        {movies.map((movie, index) => {
                            const coverUrl = movie.cover?.url || '';
                            const year = movie.releaseDate ? movie.releaseDate.split('-')[0] : 'N/A';
                            const sType = movie.subjectType || 1;
                            const watchUrl = `/watch?detailPath=${encodeURIComponent(movie.detailPath)}&subjectId=${movie.subjectId}&type=${sType}`;

                            return (
                                <Link href={watchUrl} className="movie-card" key={`${movie.subjectId}-${index}`} style={{ textDecoration: 'none' }}>
                                    <div className="poster-container" style={{ display: 'block', position: 'relative' }}>
                                        {coverUrl
                                            ? <Image src={coverUrl} alt={movie.title} className="movie-poster" width={300} height={450} unoptimized />
                                            : <div className="poster-placeholder">{movie.title}</div>
                                        }
                                        <div className="poster-overlay">
                                            <span className="play-icon">▶</span>
                                        </div>
                                    </div>
                                    <div className="movie-info">
                                        <div className="movie-title">{movie.title}</div>
                                        <div className="movie-meta">
                                            <span>{year}</span>
                                            <span>{sType === 2 ? 'Series' : 'Movie'}</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}
