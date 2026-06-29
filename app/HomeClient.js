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
    const abortControllerRef = useRef(null);

    useEffect(() => {
        const qParam = searchParams.get('q');
        if (qParam === 'movies') {
            setTitle('Trending Movies');
            setQuery('');
            fetchMultiple(['avengers', 'mission impossible', 'john wick', 'fast', 'matrix']);
        } else if (qParam === 'series') {
            setTitle('Trending Series');
            setQuery('');
            fetchMultiple(['breaking', 'game of thrones', 'stranger', 'boys', 'witcher']);
        } else if (qParam && qParam !== 'trending') {
            setTitle(`Search Results for "${qParam}"`);
            setQuery(qParam);
            fetchMultiple([qParam]); // Single search
        } else {
            setTitle('Trending Now');
            fetchMultiple(['marvel', 'dc', 'avatar', 'spider', 'batman', 'star wars']);
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
            const promises = queries.map(q => 
                fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal }).then(r => r.json())
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
                    <h1 className="hero-title">Unlimited movies,<br />TV shows, and more.</h1>
                    <p className="hero-subtitle">Stream online or download in up to 1080p. Free. No ads.</p>

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
                            const coverUrl = movie.cover?.url || 'https://via.placeholder.com/300x450?text=No+Poster';
                            const year = movie.releaseDate ? movie.releaseDate.split('-')[0] : 'N/A';
                            const sType = movie.subjectType || 1;
                            const watchUrl = `/watch?detailPath=${encodeURIComponent(movie.detailPath)}&subjectId=${movie.subjectId}&type=${sType}`;

                            return (
                                <div className="movie-card" key={`${movie.subjectId}-${index}`}>
                                    <Link href={watchUrl} className="poster-container" style={{ display: 'block', position: 'relative' }}>
                                        <Image src={coverUrl} alt={movie.title} className="movie-poster" width={300} height={450} />
                                        <div className="poster-overlay">
                                            <span className="play-icon">▶</span>
                                        </div>
                                    </Link>
                                    <div className="movie-info">
                                        <div className="movie-title">{movie.title}</div>
                                        <div className="movie-meta">
                                            <span>{year}</span>
                                            <span>{sType === 2 ? 'Series' : 'Movie'}</span>
                                        </div>
                                        <div className="card-btns">
                                            <Link href={watchUrl} className="card-watch-btn">▶ Watch</Link>
                                            <Link href={`${watchUrl}&action=download`} className="card-download-btn">⬇ Download</Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}
