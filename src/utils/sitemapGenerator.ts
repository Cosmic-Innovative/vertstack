import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

const baseUrl = 'http://localhost:5173'; // Update this to your production URL when deploying

const pages = [
  { url: '/', changefreq: 'daily', priority: 1 },
  { url: '/about', changefreq: 'weekly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.6 },
  { url: '/api-example', changefreq: 'weekly', priority: 0.7 },
];

const languages = ['en', 'es']; // Add more languages as needed

export async function generateSitemap(): Promise<string> {
  console.log('Starting sitemap generation');

  try {
    const links = pages.flatMap((page) =>
      languages.map((lang) => ({
        url: `/${lang}${page.url}`,
        changefreq: page.changefreq,
        priority: page.priority,
        links: languages.map((l) => ({
          lang: l,
          url: `${baseUrl}/${l}${page.url}`,
        })),
      })),
    );

    // Add root URL that redirects to default language
    links.push({
      url: '/',
      changefreq: 'daily',
      priority: 1,
    });

    console.log('Links generated:', JSON.stringify(links, null, 2));

    const stream = new SitemapStream({ hostname: baseUrl });
    console.log('SitemapStream created');

    const sitemap = await streamToPromise(
      Readable.from(links).pipe(stream),
    ).then((data) => {
      console.log('Sitemap generated successfully');
      return data.toString();
    });

    console.log('Sitemap content:', sitemap);
    return sitemap;
  } catch (error) {
    console.error('Error in generateSitemap:', error);
    return '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>';
  }
}
