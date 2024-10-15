import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const supportedLanguages = ['en', 'es']; // Make sure this matches your supported languages

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
        return t('general.appName');
    }
  };

  const title = getTitle();
  const appName = t('general.appName');
  const fullTitle = `${title} - ${appName}`;
  const description = t('home.description');
  const url = `https://example.com${pathname}`;

  // Generate alternate language links
  const alternateLinks = supportedLanguages.map((lang) => ({
    hrefLang: lang,
    href: `https://example.com/${lang}${pathname.substring(3)}`,
  }));

  return (
    <Helmet>
      <html lang={i18n.language} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

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
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: appName,
          url: 'https://example.com',
          description: description,
          inLanguage: i18n.language,
          alternateName: supportedLanguages.map((lang) =>
            lang === 'en' ? 'VERT Stack Template' : 'Plantilla VERT Stack',
          ),
        })}
      </script>
    </Helmet>
  );
};

export default TitleComponent;
