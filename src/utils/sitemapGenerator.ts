import { submitSitemapToSearchEngines } from './searchEngineSubmit';
import { logger } from './logger';

// Note: This client-side sitemap generation is a simplified approach.
// For production applications, especially those with dynamic content,
// it's recommended to generate sitemaps server-side. This ensures
// that the sitemap always reflects the current state of your website
// and can handle larger sites more efficiently.
/**
 * Production Enhancement Recommendations:
 * 1. Server-side generation for dynamic content
 * 2. Automatic route detection from your routing system
 * 3. Sitemap index support for large sites (>50,000 URLs)
 * 4. Database integration for dynamic content URLs
 * 5. Content-based priority calculation
 * 6. Image and video sitemap support if needed
 */

const baseUrl = process.env.VITE_PUBLIC_URL || 'http://localhost:5173';

const pages = [
  { url: '/', changefreq: 'daily', priority: 1 },
  { url: '/about', changefreq: 'weekly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.6 },
  { url: '/api-example', changefreq: 'weekly', priority: 0.7 },
  { url: '/i18n-examples', changefreq: 'weekly', priority: 0.7 },
  { url: '/terms', changefreq: 'monthly', priority: 0.3 },
  { url: '/privacy', changefreq: 'monthly', priority: 0.3 },
];

const languages = ['en', 'es'];

export async function generateSitemap(): Promise<string> {
  try {
    logger.info('Starting sitemap generation', { category: 'SEO' });

    const links = pages.flatMap((page) =>
      languages.map((lang) => ({
        loc: `${baseUrl}/${lang}${page.url}`,
        changefreq: page.changefreq,
        priority: page.priority,
        'xhtml:link': languages.map((l) => ({
          rel: 'alternate',
          hreflang: l,
          href: `${baseUrl}/${l}${page.url}`,
        })),
      })),
    );

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${links
    .map(
      (link) => `
  <url>
    <loc>${link.loc}</loc>
    <changefreq>${link.changefreq}</changefreq>
    <priority>${link.priority}</priority>
    ${link['xhtml:link']
      .map(
        (alt) => `
    <xhtml:link rel="${alt.rel}" hreflang="${alt.hreflang}" href="${alt.href}"/>`,
      )
      .join('')}
  </url>`,
    )
    .join('')}
</urlset>`;

    // Submit to search engines in production only
    if (process.env.NODE_ENV === 'production' && process.env.VITE_PUBLIC_URL) {
      try {
        await submitSitemapToSearchEngines(`${baseUrl}/sitemap.xml`);
      } catch (error) {
        logger.error('Failed to submit sitemap to search engines', {
          category: 'SEO',
          error,
        });
      }
    }

    logger.info('Sitemap generated successfully', { category: 'SEO' });
    return sitemap;
  } catch (error) {
    logger.error('Failed to generate sitemap', {
      category: 'SEO',
      error,
    });
    throw error;
  }
}
