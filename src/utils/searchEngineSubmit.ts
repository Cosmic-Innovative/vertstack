import { logger } from './logger';

/**
 * Search Engine Submission
 *
 * Important: This automated ping is supplementary to required search engine webmaster tools setup.
 * For proper indexing, you must verify site ownership through:
 *
 * 1. Google Search Console: https://search.google.com/search-console
 *    - Required for Google indexing
 *    - Verify site ownership
 *    - Submit sitemap directly in console
 *
 * 2. Bing Webmaster Tools: https://www.bing.com/webmasters
 *    - Required for Bing and DuckDuckGo indexing
 *    - DuckDuckGo uses Bing's index
 *    - Verify site ownership
 *
 * 3. Yandex Webmaster: https://webmaster.yandex.com
 *    - Important for Russian-language markets
 *    - Verify site ownership
 *    - Submit sitemap directly in console
 */

interface SearchEngine {
  name: string;
  submitUrl: (sitemapUrl: string) => string;
}

const searchEngines: SearchEngine[] = [
  {
    name: 'Google',
    submitUrl: (sitemapUrl) =>
      `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
  },
  {
    name: 'Bing',
    submitUrl: (sitemapUrl) =>
      `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
  },
  {
    name: 'Yandex',
    submitUrl: (sitemapUrl) =>
      `https://webmaster.yandex.com/ping?sitemap=${encodeURIComponent(
        sitemapUrl,
      )}`,
  },
];

export async function submitSitemapToSearchEngines(
  sitemapUrl: string,
): Promise<void> {
  logger.info(
    'Submitting sitemap to search engines - Note: This is supplementary to required webmaster tools setup',
    {
      category: 'SEO',
      sitemapUrl,
    },
  );

  const submissionResults = await Promise.allSettled(
    searchEngines.map(async (engine) => {
      try {
        const response = await fetch(engine.submitUrl(sitemapUrl), {
          method: 'GET',
          headers: {
            'User-Agent': 'VERT Stack Template Bot',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        logger.info(`Successfully pinged ${engine.name} about sitemap update`, {
          category: 'SEO',
          engine: engine.name,
          status: response.status,
        });
      } catch (error) {
        logger.error(`Failed to ping ${engine.name}`, {
          category: 'SEO',
          engine: engine.name,
          error,
        });
        throw error;
      }
    }),
  );

  const failures = submissionResults.filter(
    (result) => result.status === 'rejected',
  );
  if (failures.length > 0) {
    logger.warn('Some sitemap pings failed', {
      category: 'SEO',
      failureCount: failures.length,
      totalCount: searchEngines.length,
    });
  } else {
    logger.info('Successfully pinged all search engines about sitemap update', {
      category: 'SEO',
      engineCount: searchEngines.length,
    });
  }
}
