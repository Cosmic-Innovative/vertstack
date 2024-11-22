import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import {
  loadPageTranslations,
  type PageNamespace,
} from '../utils/i18n/page-loader';
import { loadLegalTranslations } from '../utils/i18n/legal-loader';
import { logger } from '../utils/logger';

interface PageInfo {
  namespace: PageNamespace | 'legal';
  titleKey: string;
  descriptionKey: string;
  type?: '404';
  isLegal?: boolean;
}

const VALID_ROUTES = new Map<string, PageInfo>([
  [
    '',
    {
      namespace: 'home',
      titleKey: 'title',
      descriptionKey: 'description',
    },
  ],
  [
    'about',
    {
      namespace: 'about',
      titleKey: 'title',
      descriptionKey: 'description',
    },
  ],
  [
    'contact',
    {
      namespace: 'contact',
      titleKey: 'title',
      descriptionKey: 'description',
    },
  ],
  [
    'api-example',
    {
      namespace: 'apiExample',
      titleKey: 'title',
      descriptionKey: 'description',
    },
  ],
  [
    'i18n-examples',
    {
      namespace: 'i18nExamples',
      titleKey: 'title',
      descriptionKey: 'description',
    },
  ],
  // Legal pages
  [
    'terms',
    {
      namespace: 'legal',
      titleKey: 'termsOfService.title',
      descriptionKey: 'termsOfService.description',
      isLegal: true,
    },
  ],
  [
    'privacy',
    {
      namespace: 'legal',
      titleKey: 'privacyPolicy.title',
      descriptionKey: 'privacyPolicy.description',
      isLegal: true,
    },
  ],
]);

const TitleComponent: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef<ReturnType<typeof setTimeout>>();

  const getPageInfo = useCallback((): PageInfo => {
    const path = pathname.split('/')[2] || '';

    if (VALID_ROUTES.has(path)) {
      return VALID_ROUTES.get(path)!;
    }

    return {
      namespace: 'notFound',
      titleKey: 'title',
      descriptionKey: 'description',
      type: '404',
    };
  }, [pathname]);

  useEffect(() => {
    let mounted = true;

    const loadTranslations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const pageInfo = getPageInfo();

        if (loadingRef.current) {
          clearTimeout(loadingRef.current);
        }

        loadingRef.current = setTimeout(async () => {
          try {
            if (pageInfo.isLegal) {
              await loadLegalTranslations(i18n.language);
              // If no error was thrown, consider it successful
              if (mounted) {
                setIsLoading(false);
              }
            } else if (pageInfo.type === '404') {
              if (mounted) {
                setIsLoading(false);
              }
            } else {
              const success = await loadPageTranslations(
                pageInfo.namespace as PageNamespace,
                i18n.language,
              );
              if (!success) {
                throw new Error('Failed to load translations');
              }
              if (mounted) {
                setIsLoading(false);
              }
            }
          } catch (error) {
            if (mounted) {
              logger.error('Translation loading failed', {
                error,
                pageType: pageInfo.isLegal ? 'legal' : 'regular',
                namespace: pageInfo.namespace,
                language: i18n.language,
              });
              setError(
                error instanceof Error ? error.message : 'Unknown error',
              );
              setIsLoading(false);
            }
          }
        }, 100);
      } catch (error) {
        if (mounted) {
          logger.error('Translation setup failed', {
            error,
            pathname,
            language: i18n.language,
          });
          setError(error instanceof Error ? error.message : 'Unknown error');
          setIsLoading(false);
        }
      }
    };

    void loadTranslations();

    return () => {
      mounted = false;
      if (loadingRef.current) {
        clearTimeout(loadingRef.current);
      }
    };
  }, [getPageInfo, i18n.language, pathname]);

  if (isLoading) {
    return null;
  }

  const pageInfo = getPageInfo();

  // For legal pages, use the 'legal' namespace directly
  const title = pageInfo.isLegal
    ? t(`legal:${pageInfo.titleKey}`)
    : t(`${pageInfo.namespace}:${pageInfo.titleKey}`);

  const description = pageInfo.isLegal
    ? t(`legal:${pageInfo.descriptionKey}`)
    : t(`${pageInfo.namespace}:${pageInfo.descriptionKey}`);

  const appName = t('general.appName');
  const fullTitle = `${title} - ${appName}`;

  const baseUrl = import.meta.env.VITE_PUBLIC_URL || 'http://localhost:5173';
  const currentUrl = `${baseUrl}${pathname}`;

  const supportedLanguages = ['en', 'es'];

  const alternateLinks = supportedLanguages.map((lang) => ({
    hrefLang: lang,
    href: `${baseUrl}/${lang}${pathname.substring(3)}`,
  }));

  return (
    <Helmet>
      <html lang={i18n.language.split('-')[0]} />
      <title>{error ? appName : fullTitle}</title>
      <meta name="description" content={description} />

      {/* SEO directives */}
      {pageInfo.type === '404' && <meta name="robots" content="noindex" />}
      {error && <meta name="robots" content="noindex" />}

      {/* Open Graph tags */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={error ? appName : fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={appName} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={error ? appName : fullTitle} />
      <meta name="twitter:description" content={description} />

      {/* Language alternates */}
      {alternateLinks.map(({ hrefLang, href }) => (
        <link key={hrefLang} rel="alternate" hrefLang={hrefLang} href={href} />
      ))}

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
    </Helmet>
  );
};

export default TitleComponent;
