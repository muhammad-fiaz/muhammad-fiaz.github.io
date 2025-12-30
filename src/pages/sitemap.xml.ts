import type { APIRoute } from 'astro';

// Handle sitemap.xml requests
// In development: return a simple XML response
// In production: will be overwritten by the build-generated sitemap
export const GET: APIRoute = async ({ url }) => {
  const isDev = import.meta.env.DEV;
  
  if (isDev) {
    // During development, return a simple placeholder sitemap
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url.origin}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${url.origin}/works</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${url.origin}/projects</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${url.origin}/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${url.origin}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
  
  // In production, this file may be overwritten by the sitemap integration
  // But if it somehow gets called, return the sitemap-index.xml
  try {
    const response = await fetch(`${url.origin}/sitemap-index.xml`);
    if (response.ok) {
      return response;
    }
  } catch (e) {
    // Fallback to simple sitemap
  }
  
  return new Response('Sitemap not found', { status: 404 });
};
