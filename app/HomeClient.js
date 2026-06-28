'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function HomeClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('Trending Now');

    useEffect(() => {
        const qParam = searchParams.get('q');
        if (qParam === 'movies') {
            setTitle('Trending Movies');
            setQuery('');
            fetchMovies('avengers');
        } else if (qParam === 'series') {
            setTitle('Trending Series');
            setQuery('');
            fetchMovies('breaking');
        } else if (qParam && qParam !== 'trending') {
            setTitle(`Search Results for "${qParam}"`);
            setQuery(qParam);
            fetchMovies(qParam);
        } else {
            setTitle('Trending Now');
            fetchMovies('marvel');
        }
    }, [searchParams]);

    const fetchMovies = async (searchQuery) => {
        setLoading(true);
        setError(null);
        setMovies([]);
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            if (data.data && data.data.items) {
                setMovies(data.data.items);
            } else {
                setMovies([]);
            }
        } catch (err) {
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
            {/* Hero Section */}
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
                                        <img src={coverUrl} alt={movie.title} className="movie-poster" loading="lazy" />
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
