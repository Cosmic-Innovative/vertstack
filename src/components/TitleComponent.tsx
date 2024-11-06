import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const supportedLanguages = ['en', 'es'];

const TitleComponent: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  const getPageInfo = () => {
    const path = pathname.split('/')[2] || '';

    // Check if we're at an unmatched route (404)
    if (
      !path.match(/^(|about|contact|api-example|i18n-examples|terms|privacy)$/)
    ) {
      return {
        title: 'notFound.title',
        description: 'notFound.description',
        type: '404',
      };
    }

    switch (path) {
      case '':
        return { title: 'home.title', description: 'home.metaDescription' };
      case 'about':
        return { title: 'about.title', description: 'about.metaDescription' };
      case 'contact':
        return {
          title: 'contact.title',
          description: 'contact.metaDescription',
        };
      case 'api-example':
        return {
          title: 'apiExample.title',
          description: 'apiExample.metaDescription',
        };
      case 'i18n-examples':
        return {
          title: 'i18nExamples.title',
          description: 'i18nExamples.description',
        };
      default:
        return {
          title: 'general.appName',
          description: 'home.metaDescription',
        };
    }
  };

  const pageInfo = getPageInfo();
  const title = t(pageInfo.title);
  const description = t(pageInfo.description);
  const appName = t('general.appName');
  const fullTitle = `${title} - ${appName}`;
  const url = `https://example.com${pathname}`;

  const alternateLinks = supportedLanguages.map((lang) => ({
    hrefLang: lang,
    href: `https://example.com/${lang}${pathname.substring(3)}`,
  }));

  // Generate JSON-LD based on page type
  const getJsonLd = () => {
    const basePath = pathname.split('/')[2] || '';
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description: description,
      url: url,
      inLanguage: i18n.language,
      isPartOf: {
        '@type': 'WebSite',
        name: appName,
        url: 'https://example.com',
      },
    };

    if (pageInfo.type === '404') {
      return {
        ...baseSchema,
        '@type': 'WebPage',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              item: {
                '@id': `/${i18n.language}`,
                name: t('home.title'),
              },
            },
            {
              '@type': 'ListItem',
              position: 2,
              item: {
                '@id': url,
                name: title,
              },
            },
          ],
        },
      };
    }

    switch (basePath) {
      case '':
        return {
          ...baseSchema,
          '@type': 'WebSite',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://example.com/search?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
          },
        };

      case 'contact':
        return {
          ...baseSchema,
          '@type': 'ContactPage',
          mainEntity: {
            '@type': 'Organization',
            name: appName,
            email: 'contact@example.com',
            telephone: '+1-234-567-890',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '123 Main Street, Suite 456',
              addressLocality: 'City',
              addressRegion: 'State',
              postalCode: '12345',
              addressCountry: 'Country',
            },
          },
        };

      case 'about':
        return {
          ...baseSchema,
          '@type': 'AboutPage',
          mainEntity: {
            '@type': 'Organization',
            name: appName,
            description: description,
            url: 'https://example.com',
            sameAs: [
              'https://github.com/yourusername',
              'https://twitter.com/yourusername',
            ],
          },
        };

      case 'api-example':
        return {
          ...baseSchema,
          '@type': 'TechArticle',
          articleBody: description,
          proficiencyLevel: 'Beginner',
          articleSection: 'API Integration',
        };

      case 'i18n-examples':
        return {
          ...baseSchema,
          '@type': 'TechArticle',
          articleBody: description,
          proficiencyLevel: 'Intermediate',
          articleSection: 'Internationalization',
          about: {
            '@type': 'Thing',
            name: 'Internationalization',
            description:
              'Web application internationalization examples and patterns',
          },
        };

      default:
        return baseSchema;
    }
  };

  return (
    <Helmet>
      <html lang={i18n.language} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {pageInfo.type === '404' && <meta name="robots" content="noindex" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="https://example.com/og-image.jpg" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta
        property="twitter:image"
        content="https://example.com/twitter-image.jpg"
      />

      {/* Alternate language links */}
      {alternateLinks.map((link) => (
        <link
          key={link.hrefLang}
          rel="alternate"
          hrefLang={link.hrefLang}
          href={link.href}
        />
      ))}

      {/* Canonical link */}
      <link rel="canonical" href={url} />

      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify(getJsonLd())}</script>
    </Helmet>
  );
};

export default TitleComponent;
