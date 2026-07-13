import { Suspense } from 'react';
import HomeClient from './HomeClient';
import { API_BASE, getHeaders } from './_api/config';

export const metadata = {
  title: "MetFlix | Stream & Download Movies Free",
  description: "Watch and download the latest movies, series, anime and K-drama in HD — free. No subscription needed.",
};

async function getInitialMovies() {
  try {
    const res = await fetch(`${API_BASE}/subject/search`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ keyword: '2026', page: 1, perPage: 24, subjectType: 0 }),
      cache: 'force-cache',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data?.items || [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const initialMovies = await getInitialMovies();

  return (
    <>
      {/*
        SEO: Server-rendered movie list baked into the static HTML at build time.
        Googlebot reads this on first crawl — no JS needed.
      */}
      {initialMovies.length > 0 && (
        <section className="seo-index-grid" aria-label="Featured Movies">
          <h1 className="seo-index-title">Latest Movies &amp; Series — Watch Free in HD</h1>
          <ul className="seo-index-list">
            {initialMovies.map((movie) => {
              const year = movie.releaseDate ? movie.releaseDate.split('-')[0] : '';
              const type = movie.subjectType === 2 ? 'Series' : 'Movie';
              const watchUrl = `/watch?detailPath=${encodeURIComponent(movie.detailPath)}&subjectId=${movie.subjectId}&type=${movie.subjectType || 1}`;
              return (
                <li key={movie.subjectId}>
                  <a href={watchUrl}>
                    <strong>{movie.title}</strong>
                    {year && <span> ({year})</span>}
                    <span> — {type}</span>
                    {movie.description && <p>{movie.description.slice(0, 150)}</p>}
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Interactive client-side UI — overlays the static section above */}
      <Suspense fallback={
        <div className="page-loading">
          <div className="spinner" style={{ width: '60px', height: '60px', borderWidth: '4px' }}></div>
          <p>Loading MetFlix...</p>
        </div>
      }>
        <HomeClient initialMovies={initialMovies} />
      </Suspense>
    </>
  );
}
