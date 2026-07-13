export const dynamic = 'force-static';

const BASE_URL = 'https://metflix.vercel.app'; // ← update to your final domain

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_api/',
          '/history/',
          '/watchlist/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
