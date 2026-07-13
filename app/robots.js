export const dynamic = 'force-static';

const BASE_URL = 'https://metflix.afrozex.com';

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
