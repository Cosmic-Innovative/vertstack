// Note: This client-side sitemap generation is a simplified approach.
// For production applications, especially those with dynamic content,
// it's recommended to generate sitemaps server-side. This ensures
// that the sitemap always reflects the current state of your website
// and can handle larger sites more efficiently.

const baseUrl = 'http://localhost:5173'; // Update this to your production URL when deploying

const pages = [
  { url: '/', changefreq: 'daily', priority: 1 },
  { url: '/about', changefreq: 'weekly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.6 },
  { url: '/api-example', changefreq: 'weekly', priority: 0.7 },
];

const languages = ['en', 'es']; // Add more languages as needed

export async function generateSitemap(): Promise<string> {
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

  return sitemap;
}
