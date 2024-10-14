import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const TitleComponent: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  const getTitle = () => {
    const path = pathname.split('/')[2] || ''; // Adjust for language prefix
    switch (path) {
      case '':
        return t('home.title');
      case 'about':
        return t('about.title');
      case 'contact':
        return t('contact.title');
      case 'api-example':
        return t('apiExample.title');
      default:
        return 'VERT Stack Template';
    }
  };

  const title = getTitle();
  const description = t('home.description');
  const url = `https://example.com${pathname}`;

  return (
    <Helmet>
      <html lang={i18n.language} />
      <title>{title} - VERT Stack Template</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="https://example.com/og-image.jpg" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta
        property="twitter:image"
        content="https://example.com/twitter-image.jpg"
      />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'VERT Stack Template',
          url: 'https://example.com',
          description: description,
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://example.com/search?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        })}
      </script>
    </Helmet>
  );
};

export default TitleComponent;
