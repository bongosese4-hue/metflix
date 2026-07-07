'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// ── Helpers ────────────────────────────────────────────────────────
const getQualBtnClass = (res) => {
    const r = parseInt(res);
    if (r >= 2160) return 'qual-4k';
    if (r >= 1080) return 'qual-fhd';
    if (r >= 720)  return 'qual-hd';
    if (r >= 480)  return 'qual-sd';
    return 'qual-low';
};
const getBadgeClass = (res) => {
    const r = parseInt(res);
    if (r >= 2160) return 'badge-4k';
    if (r >= 1080) return 'badge-fhd';
    if (r >= 720)  return 'badge-hd';
    if (r >= 480)  return 'badge-sd';
    return 'badge-low';
};
const getQualityLabel = (res) => {
    const r = parseInt(res);
    if (r >= 2160) return '4K Ultra HD';
    if (r >= 1080) return 'Full HD 1080p';
    if (r >= 720)  return 'HD 720p';
    if (r >= 480)  return 'SD 480p';
    return `Low ${res}p`;
};

export default function WatchClient() {
    const searchParams = useSearchParams();
    const detailPath  = searchParams.get('detailPath');
    const subjectId   = searchParams.get('subjectId');
    const subjectType = parseInt(searchParams.get('type') || '1');
    const action      = searchParams.get('action');

    const [movie,   setMovie]   = useState(null);
    const [stars,   setStars]   = useState([]);
    const [related, setRelated] = useState([]);

    // seasons discovered from API
    const [seasons,     setSeasons]     = useState([]);
    const [seasonsLoading, setSeasonsLoading] = useState(false);

    // Player state
    const [playerSe,  setPlayerSe]  = useState(1);
    const [playerEp,  setPlayerEp]  = useState(1);
    const [playerDls, setPlayerDls] = useState([]);
    const [playerDlLoading, setPlayerDlLoading] = useState(false);
    const [activeQIdx, setActiveQIdx] = useState(-1);
    const [streamUrl, setStreamUrl]  = useState('');
    const [isPlaying, setIsPlaying]  = useState(false);

    // Download section state
    const [dlSe,      setDlSe]      = useState(1);
    const [dlEp,      setDlEp]      = useState(1);
    const [dlLinks,   setDlLinks]   = useState([]);
    const [dlLoading, setDlLoading] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);

    const videoRef = useRef(null);

    // ── Fetch downloads for a given se/ep ──────────────────────────
    const fetchLinks = useCallback(async (sid, se, ep, dPath) => {
        try {
            const res  = await fetch(`/api/download?subjectId=${sid}&se=${se}&ep=${ep}&detailPath=${encodeURIComponent(dPath)}`);
            const data = await res.json();
            return (data.data && (data.data.downloads || data.data.list)) || [];
        } catch { return []; }
    }, []);

    // ── Initial data load ──────────────────────────────────────────
    useEffect(() => {
        let isMounted = true;
        async function loadData() {
            if (!detailPath) {
                if (isMounted) { setError('No movie specified.'); setLoading(false); }
                return;
            }
            try {
                const resDetail = await fetch(`/api/detail?detailPath=${encodeURIComponent(detailPath)}`);
                const detailData = await resDetail.json();
                const m = detailData.data?.subject || detailData.data;
                if (!m) throw new Error('Movie data not found');
                if (isMounted) { setMovie(m); setStars(detailData.data?.stars || []); }

                if (m.genre) {
                    fetch(`/api/related?genre=${encodeURIComponent(m.genre)}&exclude_id=${subjectId}`)
                        .then(r => r.json())
                        .then(d => { if (d.data?.items && isMounted) setRelated(d.data.items); });
                }

                // Load first episode downloads
                const initSe = subjectType === 2 ? 1 : 0;
                const initEp = subjectType === 2 ? 1 : 0;
                const dls = await fetchLinks(subjectId, initSe, initEp, detailPath);
                if (isMounted) {
                    setPlayerDls(dls);
                    setDlLinks(dls);
                    setLoading(false);
                }

                if (action === 'download' && isMounted) {
                    setTimeout(() => document.getElementById('downloadSection')?.scrollIntoView({ behavior: 'smooth' }), 600);
                }

                // For series: discover seasons/episodes in the background
                if (subjectType === 2 && isMounted) {
                    setSeasonsLoading(true);
                    fetch(`/api/seasons?subjectId=${subjectId}&detailPath=${encodeURIComponent(detailPath)}`)
                        .then(r => r.json())
                        .then(d => {
                            if (isMounted && d.seasons?.length) {
                                setSeasons(d.seasons);
                            }
                        })
                        .catch(() => {})
                        .finally(() => { if (isMounted) setSeasonsLoading(false); });
                }
            } catch (err) {
                if (isMounted) { setError(err.message); setLoading(false); }
            }
        }
        loadData();
        return () => { isMounted = false; };
    }, [detailPath, subjectId, subjectType, action, fetchLinks]);

    // ── Player: season/ep change ───────────────────────────────────
    const handlePlayerSeasonChange = async (se) => {
        setPlayerSe(se); setPlayerEp(1);
        setIsPlaying(false); setStreamUrl(''); setActiveQIdx(-1);
        setPlayerDlLoading(true);
        const dls = await fetchLinks(subjectId, se, 1, detailPath);
        setPlayerDls(dls);
        setPlayerDlLoading(false);
    };
    const handlePlayerEpChange = async (ep) => {
        setPlayerEp(ep);
        setIsPlaying(false); setStreamUrl(''); setActiveQIdx(-1);
        setPlayerDlLoading(true);
        const dls = await fetchLinks(subjectId, playerSe, ep, detailPath);
        setPlayerDls(dls);
        setPlayerDlLoading(false);
    };

    // ── Download: season/ep change ─────────────────────────────────
    const handleDlSeasonChange = async (se) => {
        setDlSe(se); setDlEp(1);
        setDlLoading(true); setDlLinks([]);
        const dls = await fetchLinks(subjectId, se, 1, detailPath);
        setDlLinks(dls); setDlLoading(false);
    };
    const handleDlEpChange = async (ep) => {
        setDlEp(ep);
        setDlLoading(true); setDlLinks([]);
        const dls = await fetchLinks(subjectId, dlSe, ep, detailPath);
        setDlLinks(dls); setDlLoading(false);
    };

    // ── Play a quality ─────────────────────────────────────────────
    const playQuality = (index, dlList) => {
        const list = dlList || playerDls;
        const dl = list[index];
        if (!dl) return;
        setActiveQIdx(index);
        setStreamUrl(`/api/stream-video?url=${encodeURIComponent(dl.url)}`);
        setIsPlaying(true);
        setTimeout(() => {
            if (videoRef.current) { videoRef.current.load(); videoRef.current.play().catch(() => {}); }
        }, 100);
    };

    // ── Render guards ──────────────────────────────────────────────
    if (loading) return (
        <div className="page-loading">
            <div className="spinner" style={{ width: '60px', height: '60px', borderWidth: '4px' }}></div>
            <p>Loading...</p>
        </div>
    );
    if (error) return (
        <div className="page-loading">
            <p style={{ color: '#ff4444', marginBottom: '1rem' }}>{error}</p>
            <Link href="/" className="primary-btn">← Back to Home</Link>
        </div>
    );
    if (!movie) return null;

    const backdropImg = movie.stills?.url || movie.cover?.url || '';
    const coverUrl    = movie.cover?.url  || '';
    const year        = movie.releaseDate ? movie.releaseDate.split('-')[0] : '';
    const rating      = movie.imdbRatingValue;
    const safeTitle   = (movie.title || 'Video').replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_');

    const playerSeasonData = seasons.find(s => s.se === playerSe);
    const playerTotalEps   = playerSeasonData?.maxEp || 1;
    const dlSeasonData     = seasons.find(s => s.se === dlSe);
    const dlTotalEps       = dlSeasonData?.maxEp || 1;
    const isSeries         = subjectType === 2;

    return (
        <>
            {backdropImg && (
                <div className="hero-backdrop" style={{ backgroundImage: `url('${backdropImg}')` }}>
                    <div className="backdrop-overlay"></div>
                </div>
            )}

            <div className="watch-main container">

                {/* ═══════════════════════════════════════════════
                    PLAYER
                ═══════════════════════════════════════════════ */}
                <section className="player-section">
                    {/* Video */}
                    <div className="player-wrapper">
                        <video ref={videoRef} id="videoPlayer" controls preload="metadata"
                            poster={!isPlaying ? coverUrl : undefined}
                            src={streamUrl || undefined}
                        />
                        {!isPlaying && (
                            <div className="player-overlay">
                                <button className="big-play-btn"
                                    onClick={() => playerDls.length > 0 && playQuality(0)}>▶</button>
                                <p className="player-msg">
                                    {playerDls.length > 0 ? 'Tap to watch' : 'No streams available'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Quality bar */}
                    <div className="quality-bar">
                        <span className="quality-bar-label">Quality:</span>
                        <div className="quality-btns">
                            {playerDlLoading
                                ? <div className="spinner" style={{ width: '20px', height: '20px', margin: 0, borderWidth: '2px' }}></div>
                                : playerDls.length > 0
                                    ? playerDls.map((dl, i) => (
                                        <button key={i}
                                            className={`qual-btn ${getQualBtnClass(dl.resolution || 360)}${activeQIdx === i ? ' active' : ''}`}
                                            onClick={() => playQuality(i)}>
                                            {dl.resolution || 'HD'}p
                                        </button>
                                    ))
                                    : <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No streams available</span>
                            }
                        </div>
                    </div>

                    {/* Series season/episode selector for PLAYER */}
                    {isSeries && (
                        <div className="seasons-ep-panel">
                            <div className="sep-row">
                                <span className="sep-label">Season</span>
                                {seasonsLoading && (
                                    <span className="sep-discovering">⟳ Discovering seasons...</span>
                                )}
                            </div>
                            <div className="sep-seasons">
                                {seasons.length > 0
                                    ? seasons.map(s => (
                                        <button key={s.se}
                                            className={`sep-btn${s.se === playerSe ? ' active' : ''}`}
                                            onClick={() => handlePlayerSeasonChange(s.se)}>
                                            S{s.se}
                                        </button>
                                    ))
                                    : seasonsLoading
                                        ? [1,2,3].map(n => <div key={n} className="sep-btn-skeleton"></div>)
                                        : <button className="sep-btn active">S1</button>
                                }
                            </div>

                            <div className="sep-label" style={{ marginTop: '0.85rem' }}>Episode</div>
                            <div className="sep-episodes">
                                {Array.from({ length: seasons.length > 0 ? playerTotalEps : 24 }, (_, i) => i + 1).map(ep => (
                                    <button key={ep}
                                        className={`sep-ep-btn${ep === playerEp ? ' active' : ''}`}
                                        onClick={() => handlePlayerEpChange(ep)}>
                                        {ep}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                {/* ═══════════════════════════════════════════════
                    MOVIE / SERIES INFO
                ═══════════════════════════════════════════════ */}
                <section className="info-section">
                    <div className="info-left">
                        {coverUrl && <Image className="watch-poster" src={coverUrl} alt={movie.title} width={300} height={450} />}
                    </div>
                    <div className="info-right">
                        {movie.corner && <div className="corner-badge">{movie.corner}</div>}
                        <h1 className="watch-title">{movie.title}</h1>
                        <div className="watch-meta">
                            {rating && <span className="meta-chip rating">★ {rating} IMDB</span>}
                            {year && <span className="meta-chip">📅 {year}</span>}
                            <span className="meta-chip">{isSeries ? '📺 Series' : '🎬 Movie'}</span>
                            {isSeries && seasons.length > 0 && (
                                <span className="meta-chip" style={{ background: 'rgba(229,9,20,0.15)', borderColor: 'rgba(229,9,20,0.35)', color: '#ff6b6b' }}>
                                    {seasons.length} Season{seasons.length > 1 ? 's' : ''}
                                </span>
                            )}
                            {isSeries && seasons.length > 0 && (
                                <span className="meta-chip">
                                    {seasons.reduce((acc, s) => acc + s.maxEp, 0)} Episodes
                                </span>
                            )}
                            {movie.genre && <span className="meta-chip">🎭 {movie.genre}</span>}
                            {movie.countryName && <span className="meta-chip">🌍 {movie.countryName}</span>}
                        </div>
                        <p className="watch-desc">{movie.description || movie.desc || 'No synopsis available.'}</p>

                        {/* ═══════════════════════════════════════
                            DOWNLOAD SECTION
                        ═══════════════════════════════════════ */}
                        <div id="downloadSection" className="download-section">
                            <h3>⬇ Download</h3>

                            {/* Series: season + episode picker for download */}
                            {isSeries && (
                                <div className="seasons-ep-panel" style={{ marginBottom: '1.25rem' }}>
                                    <div className="sep-row">
                                        <span className="sep-label">Season</span>
                                        {seasonsLoading && <span className="sep-discovering">⟳ Discovering...</span>}
                                    </div>
                                    <div className="sep-seasons">
                                        {seasons.length > 0
                                            ? seasons.map(s => (
                                                <button key={s.se}
                                                    className={`sep-btn${s.se === dlSe ? ' active' : ''}`}
                                                    onClick={() => handleDlSeasonChange(s.se)}>
                                                    S{s.se}
                                                </button>
                                            ))
                                            : seasonsLoading
                                                ? [1,2,3].map(n => <div key={n} className="sep-btn-skeleton"></div>)
                                                : <button className="sep-btn active">S1</button>
                                        }
                                    </div>

                                    <div className="sep-label" style={{ marginTop: '0.85rem' }}>Episode</div>
                                    <div className="sep-episodes">
                                        {Array.from({ length: seasons.length > 0 ? dlTotalEps : 24 }, (_, i) => i + 1).map(ep => (
                                            <button key={ep}
                                                className={`sep-ep-btn${ep === dlEp ? ' active' : ''}`}
                                                onClick={() => handleDlEpChange(ep)}>
                                                {ep}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Download quality links */}
                            <div className="quality-grid">
                                {dlLoading && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', padding: '1rem 0' }}>
                                        <div className="spinner" style={{ width: '22px', height: '22px', margin: 0, borderWidth: '2px' }}></div>
                                        <span>Loading download links...</span>
                                    </div>
                                )}
                                {!dlLoading && dlLinks.length > 0
                                    ? dlLinks.map((dl, i) => {
                                        const sizeMB  = (parseInt(dl.size || 0) / (1024 * 1024)).toFixed(1);
                                        const res     = dl.resolution || 'HD';
                                        const filename = `${safeTitle}_MetFlix_${res}p.mp4`;
                                        const proxyUrl = `/api/stream-download?url=${encodeURIComponent(dl.url)}&filename=${encodeURIComponent(filename)}`;
                                        return (
                                            <a key={i} href={proxyUrl} download={filename} className="download-link">
                                                <div className="dl-quality-row">
                                                    <span className={`quality-badge ${getBadgeClass(res)}`}>{res}p</span>
                                                    <div className="download-quality">{getQualityLabel(res)}</div>
                                                </div>
                                                <span className="download-size">{sizeMB} MB ↓</span>
                                            </a>
                                        );
                                    })
                                    : !dlLoading && <p className="text-secondary" style={{ color: 'var(--text-secondary)' }}>No download links available.</p>
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
                                    <Image src={s.avatarUrl || 'https://placehold.co/80x80?text=?'}
                                        className="cast-avatar" alt={s.name} width={80} height={80} unoptimized />
                                    <div className="cast-name">{s.name}</div>
                                    <div className="cast-role">{s.character || ''}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Related */}
                {related.length > 0 && (
                    <section className="related-section">
                        <h2 className="section-title">
                            {isSeries ? 'More Series Like This' : 'Movies You Might Like'}
                        </h2>
                        <div className="movies-grid related-grid">
                            {related.map(m => {
                                const cover = m.cover?.url || '';
                                const y  = m.releaseDate ? m.releaseDate.split('-')[0] : 'N/A';
                                const sT = m.subjectType || 1;
                                const wUrl = `/watch?detailPath=${encodeURIComponent(m.detailPath)}&subjectId=${m.subjectId}&type=${sT}`;
                                return (
                                    <Link href={wUrl} className="movie-card" key={m.subjectId} style={{ textDecoration: 'none' }}>
                                        <div className="poster-container" style={{ display: 'block', position: 'relative' }}>
                                            {cover
                                                ? <Image src={cover} alt={m.title} className="movie-poster" width={200} height={300} unoptimized />
                                                : <div className="poster-placeholder">{m.title}</div>
                                            }
                                            <div className="poster-overlay"><span className="play-icon">▶</span></div>
                                        </div>
                                        <div className="movie-info">
                                            <div className="movie-title">{m.title}</div>
                                            <div className="movie-meta">
                                                <span>{y}</span>
                                                <span>{sT === 2 ? 'Series' : 'Movie'}</span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}
