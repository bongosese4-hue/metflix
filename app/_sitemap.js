import { API_BASE, getHeaders } from './api/config';

export default async function sitemap() {
  const baseUrl = 'https://metflix.com'; // You can change this to the real deployed domain

  const routes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${baseUrl}/?q=movies`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/?q=series`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/?q=anime`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/downloads`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }
  ];

  try {
    // Fetch some top movies to add to sitemap for deep crawling
    const res = await fetch(`${API_BASE}/subject/search`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ keyword: '2026', page: 1, perPage: 100, subjectType: 0 })
    });
    const data = await res.json();
    const items = data.data?.items || [];
    
    const dynamicRoutes = items.map(item => ({
        url: `${baseUrl}/watch?detailPath=${encodeURIComponent(item.detailPath)}&subjectId=${item.subjectId}&type=${item.subjectType || 1}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    return [...routes, ...dynamicRoutes];
  } catch (err) {
    // If fetch fails during build, just return static routes
    return routes;
  }
}
