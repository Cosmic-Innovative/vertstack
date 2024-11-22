import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

const SEOExample: React.FC = () => {
  const { t, i18n } = useTranslation();

  const pageTitle = t('seoExample.title');
  const pageDescription = t('seoExample.description');
  const currentUrl = window.location.href;

  return (
    <div className="seo-example">
      <Helmet>
        <title>{pageTitle} - VERT Stack Template</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={currentUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: pageTitle,
            description: pageDescription,
            url: currentUrl,
          })}
        </script>
      </Helmet>

      <h1>{pageTitle}</h1>
      <p>{pageDescription}</p>
      <p>{t('seoExample.currentLanguage', { language: i18n.language })}</p>
      <p>{t('seoExample.explanation')}</p>
    </div>
  );
};

export default SEOExample;
