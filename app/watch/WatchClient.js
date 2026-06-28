'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function WatchClient() {
    const searchParams = useSearchParams();
    const detailPath = searchParams.get('detailPath');
    const subjectId = searchParams.get('subjectId');
    const subjectType = parseInt(searchParams.get('type') || '1');
    const action = searchParams.get('action');

    const [movie, setMovie] = useState(null);
    const [stars, setStars] = useState([]);
    const [downloads, setDownloads] = useState([]);
    const [related, setRelated] = useState([]);
    const [currentSeason, setCurrentSeason] = useState(1);
    const [currentEp, setCurrentEp] = useState(1);
    const [activeStreamUrl, setActiveStreamUrl] = useState('');
    const [activeQualityIndex, setActiveQualityIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const videoRef = useRef(null);

    useEffect(() => {
        if (!detailPath) {
            setError('No movie specified.');
            setLoading(false);
            return;
        }
        loadData();
    }, [detailPath, subjectId, subjectType]);

    async function loadData() {
        try {
            const resDetail = await fetch(`/api/detail?detailPath=${encodeURIComponent(detailPath)}`);
            const detailData = await resDetail.json();
            const m = detailData.data?.subject || detailData.data;
            if (!m) throw new Error('Movie data not found');

            setMovie(m);
            setStars(detailData.data?.stars || []);

            if (m.genre) {
                fetch(`/api/related?genre=${encodeURIComponent(m.genre)}&exclude_id=${subjectId}`)
                    .then(r => r.json())
                    .then(d => { if (d.data?.items) setRelated(d.data.items); });
            }

            await fetchDownloads(subjectId, subjectType === 2 ? 1 : 0, subjectType === 2 ? 1 : 0, detailPath);
            setLoading(false);

            if (action === 'download') {
                setTimeout(() => {
                    document.getElementById('downloadSection')?.scrollIntoView({ behavior: 'smooth' });
                }, 600);
            }
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }

    const fetchDownloads = async (sid, se, ep, dPath) => {
        try {
            const res = await fetch(`/api/download?subjectId=${sid}&se=${se}&ep=${ep}&detailPath=${encodeURIComponent(dPath)}`);
            const data = await res.json();
            const dls = (data.data && (data.data.downloads || data.data.list)) || [];
            setDownloads(dls);
            setActiveQualityIndex(-1);
            return dls;
        } catch (e) {
            console.error('Downloads failed', e);
            return [];
        }
    };

    const handleSeasonChange = (se) => {
        setCurrentSeason(se);
        setCurrentEp(1);
        setIsPlaying(false);
        setActiveStreamUrl('');
        fetchDownloads(subjectId, se, 1, detailPath);
    };

    const handleEpChange = (ep) => {
        setCurrentEp(ep);
        setIsPlaying(false);
        setActiveStreamUrl('');
        fetchDownloads(subjectId, currentSeason, ep, detailPath);
    };

    const playQuality = (index, dlList) => {
        const list = dlList || downloads;
        const dl = list[index];
        if (!dl) return;
        setActiveQualityIndex(index);
        const url = `/api/stream-video?url=${encodeURIComponent(dl.url)}`;
        setActiveStreamUrl(url);
        setIsPlaying(true);
        setTimeout(() => {
            if (videoRef.current) {
                videoRef.current.load();
                videoRef.current.play().catch(() => {});
            }
        }, 100);
    };

    if (loading) {
        return (
            <div className="page-loading">
                <div className="spinner" style={{ width: '60px', height: '60px', borderWidth: '4px' }}></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-loading">
                <p style={{ color: '#ff4444', marginBottom: '1rem' }}>{error}</p>
                <Link href="/" className="primary-btn">← Back to Home</Link>
            </div>
        );
    }

    if (!movie) return null;

    const backdropImg = movie.stills?.url || movie.cover?.url || '';
    const coverUrl = movie.cover?.url || '';
    const year = movie.releaseDate ? movie.releaseDate.split('-')[0] : '';
    const rating = movie.imdbRatingValue;
    const safeTitle = (movie.title || 'Video').replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_');

    return (
        <>
            {/* Backdrop */}
            {backdropImg && (
                <div
                    className="hero-backdrop"
                    style={{ backgroundImage: `url('${backdropImg}')` }}
                >
                    <div className="backdrop-overlay"></div>
                </div>
            )}

            <div className="watch-main container">
                {/* Player */}
                <section className="player-section">
                    <div className="player-wrapper">
                        <video
                            ref={videoRef}
                            id="videoPlayer"
                            controls
                            preload="metadata"
                            poster={!isPlaying ? coverUrl : undefined}
                            src={activeStreamUrl || undefined}
                        />
                        {!isPlaying && (
                            <div className="player-overlay">
                                <button className="big-play-btn" onClick={() => downloads.length > 0 && playQuality(0)}>▶</button>
                                <p className="player-msg">
                                    {downloads.length > 0 ? 'Click to start watching' : 'No streams available'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Quality bar */}
                    <div className="quality-bar">
                        <span className="quality-bar-label">Watch in:</span>
                        <div className="quality-btns">
                            {downloads.length > 0
                                ? downloads.map((dl, i) => (
                                    <button
                                        key={i}
                                        className={`qual-btn${activeQualityIndex === i ? ' active' : ''}`}
                                        onClick={() => playQuality(i)}
                                    >
                                        {dl.resolution || 'HD'}p
                                    </button>
                                ))
                                : <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No streams available</span>
                            }
                        </div>

                        {subjectType === 2 && movie.resource?.seasons && (
                            <div className="ep-selector">
                                <label>Season:</label>
                                <select value={currentSeason} onChange={e => handleSeasonChange(parseInt(e.target.value))}>
                                    {movie.resource.seasons.map(s => (
                                        <option key={s.se} value={s.se}>Season {s.se}</option>
                                    ))}
                                </select>
                                <label>Episode:</label>
                                <select value={currentEp} onChange={e => handleEpChange(parseInt(e.target.value))}>
                                    {Array.from(
                                        { length: movie.resource.seasons.find(s => s.se === currentSeason)?.maxEp || 1 },
                                        (_, i) => (
                                            <option key={i + 1} value={i + 1}>Ep {i + 1}</option>
                                        )
                                    )}
                                </select>
                            </div>
                        )}
                    </div>
                </section>

                {/* Movie Info */}
                <section className="info-section">
                    <div className="info-left">
                        {coverUrl && <img className="watch-poster" src={coverUrl} alt={movie.title} />}
                    </div>
                    <div className="info-right">
                        {movie.corner && <div className="corner-badge">{movie.corner}</div>}
                        <h1 className="watch-title">{movie.title}</h1>
                        <div className="watch-meta">
                            {rating && <span className="meta-chip rating">★ {rating} IMDB</span>}
                            {year && <span className="meta-chip">📅 {year}</span>}
                            <span className="meta-chip">{subjectType === 2 ? 'Series' : 'Movie'}</span>
                            {movie.genre && <span className="meta-chip">🎬 {movie.genre}</span>}
                            {movie.countryName && <span className="meta-chip">🌍 {movie.countryName}</span>}
                        </div>
                        <p className="watch-desc">{movie.description || movie.desc || 'No synopsis available.'}</p>

                        {/* Downloads */}
                        <div id="downloadSection" className="download-section">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                                <h3 style={{ margin: 0 }}>⬇ Download Options</h3>
                                {subjectType === 2 && movie.resource?.seasons && (
                                    <div className="ep-selector" style={{ margin: 0 }}>
                                        <label>Season:</label>
                                        <select value={currentSeason} onChange={e => handleSeasonChange(parseInt(e.target.value))}>
                                            {movie.resource.seasons.map(s => (
                                                <option key={s.se} value={s.se}>Season {s.se}</option>
                                            ))}
                                        </select>
                                        <label>Ep:</label>
                                        <select value={currentEp} onChange={e => handleEpChange(parseInt(e.target.value))}>
                                            {Array.from(
                                                { length: movie.resource.seasons.find(s => s.se === currentSeason)?.maxEp || 1 },
                                                (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>
                                            )}
                                        </select>
                                    </div>
                                )}
                            </div>
                            <div className="quality-grid">
                                {downloads.length > 0
                                    ? downloads.map((dl, i) => {
                                        const sizeMB = (parseInt(dl.size || 0) / (1024 * 1024)).toFixed(1);
                                        const res = dl.resolution || 'HD';
                                        const filename = `${safeTitle}_MetFlix_${res}p.mp4`;
                                        const proxyUrl = `/api/stream-download?url=${encodeURIComponent(dl.url)}&filename=${encodeURIComponent(filename)}`;
                                        let badgeClass = 'badge-sd';
                                        if (res >= 1080) badgeClass = 'badge-fhd';
                                        else if (res >= 720) badgeClass = 'badge-hd';
                                        return (
                                            <a key={i} href={proxyUrl} download={filename} className="download-link">
                                                <div className="dl-quality-row">
                                                    <span className={`quality-badge ${badgeClass}`}>{res}p</span>
                                                    <div>
                                                        <div className="download-quality">
                                                            {res >= 1080 ? 'Full HD' : res >= 720 ? 'HD 720p' : res >= 480 ? 'SD 480p' : `Low ${res}p`}
                                                        </div>
                                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{filename}</div>
                                                    </div>
                                                </div>
                                                <span className="download-size">{sizeMB} MB ↓</span>
                                            </a>
                                        );
                                    })
                                    : <p className="text-secondary">No download links available.</p>
                                }
                            </div>
                        </div>
                    </div>
                </section>

                {/* Cast */}
                {stars.length > 0 && (
                    <section className="cast-section">
                        <h2 className="section-title">Cast</h2>
                        <div className="cast-grid">
                            {stars.slice(0, 10).map((s, i) => (
                                <div className="cast-card" key={i}>
                                    <img
                                        src={s.avatarUrl || 'https://via.placeholder.com/80?text=?'}
                                        className="cast-avatar"
                                        alt={s.name}
                                        onError={e => { e.target.src = 'https://via.placeholder.com/80?text=?'; }}
                                    />
                                    <div className="cast-name">{s.name}</div>
                                    <div className="cast-role">{s.character || ''}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Seasons */}
                {subjectType === 2 && movie.resource?.seasons && (
                    <section className="seasons-section">
                        <h2 className="section-title">Seasons & Episodes</h2>
                        <div className="seasons-grid">
                            {movie.resource.seasons.map(s => (
                                <div
                                    key={s.se}
                                    className={`season-card${s.se === currentSeason ? ' active' : ''}`}
                                    onClick={() => handleSeasonChange(s.se)}
                                >
                                    <div className="season-num">S{s.se}</div>
                                    <div className="season-eps">{s.maxEp} episodes</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Related */}
                {related.length > 0 && (
                    <section className="related-section">
                        <h2 className="section-title">
                            {subjectType === 2 ? 'More Series Like This' : 'Movies You Might Like'}
                        </h2>
                        <div className="movies-grid related-grid">
                            {related.map(m => {
                                const cover = m.cover?.url || 'https://via.placeholder.com/200x300?text=No+Poster';
                                const y = m.releaseDate ? m.releaseDate.split('-')[0] : 'N/A';
                                const sT = m.subjectType || 1;
                                const wUrl = `/watch?detailPath=${encodeURIComponent(m.detailPath)}&subjectId=${m.subjectId}&type=${sT}`;
                                return (
                                    <div className="movie-card" key={m.subjectId}>
                                        <Link href={wUrl} className="poster-container" style={{ display: 'block', position: 'relative' }}>
                                            <img src={cover} alt={m.title} className="movie-poster" loading="lazy" />
                                            <div className="poster-overlay"><span className="play-icon">▶</span></div>
                                        </Link>
                                        <div className="movie-info">
                                            <div className="movie-title">{m.title}</div>
                                            <div className="movie-meta">
                                                <span>{y}</span>
                                                <span>{sT === 2 ? 'Series' : 'Movie'}</span>
                                            </div>
                                            <div className="card-btns">
                                                <Link href={wUrl} className="card-watch-btn">▶ Watch</Link>
                                                <Link href={`${wUrl}&action=download`} className="card-download-btn">⬇ Download</Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}
