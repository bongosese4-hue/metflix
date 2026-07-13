export const dynamic = 'force-static';

import { API_BASE, getHeaders } from './_api/config';

const BASE_URL = 'https://metflix.afrozex.com';

export default async function sitemap() {
  const now = new Date();

  const staticRoutes = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/?q=movies`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/?q=series`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/?q=anime`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/downloads`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    },
  ];

  try {
    // Add top trending movies to sitemap for deep indexing
    const res = await fetch(`${API_BASE}/subject/search`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ keyword: '2026', page: 1, perPage: 100, subjectType: 0 }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) return staticRoutes;

    const data = await res.json();
    const items = data.data?.items || [];

    const dynamicRoutes = items.map((item) => ({
      url: `${BASE_URL}/watch?detailPath=${encodeURIComponent(item.detailPath)}&subjectId=${item.subjectId}&type=${item.subjectType || 1}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [...staticRoutes, ...dynamicRoutes];
  } catch {
    return staticRoutes;
  }
}
