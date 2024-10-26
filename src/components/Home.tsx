import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LazyImage from './LazyImage';

function Home() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state for demo
  // In real app, this would be based on actual data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="home-container min-h-[600px] mx-auto max-w-4xl px-4">
      {/* Title section with fixed height to prevent layout shift */}
      <div className="title-container h-24 mb-8 flex items-center">
        {isLoading ? (
          <>
            {/* Logo skeleton */}
            <div className="inline-logo w-[50px] h-[50px] bg-gray-200 rounded animate-pulse" />
            {/* Title skeleton */}
            <div className="ml-4 h-8 w-64 bg-gray-200 rounded animate-pulse" />
          </>
        ) : (
          <>
            <LazyImage
              src="/vertstack.svg"
              alt={t('home.logoAlt')}
              className="inline-logo"
              width="50"
              height="50"
            />
            <h1 className="ml-4">{t('home.title')}</h1>
          </>
        )}
      </div>

      {/* Description section with min-height */}
      <div className="description-section min-h-[100px]">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
          </div>
        ) : (
          <p>{t('home.description')}</p>
        )}
      </div>

      {/* Features list with fixed height per item */}
      <ul className="features-list min-h-[200px] my-8">
        {isLoading ? (
          // Skeleton loading for features
          Array(4)
            .fill(null)
            .map((_, index) => (
              <li key={index} className="flex items-center h-12 mb-4">
                <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                <div className="ml-4 h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
              </li>
            ))
        ) : (
          <>
            <li className="feature-item h-12">
              <strong>V</strong>
              {t('home.features.vite')}
            </li>
            <li className="feature-item h-12">
              <strong>E</strong>
              {t('home.features.eslint')}
            </li>
            <li className="feature-item h-12">
              <strong>R</strong>
              {t('home.features.react')}
            </li>
            <li className="feature-item h-12">
              <strong>T</strong>
              {t('home.features.typescript')}
            </li>
          </>
        )}
      </ul>

      {/* Message section with fixed height */}
      <div className="message-section h-20">
        {isLoading ? (
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
        ) : (
          <p>{t('home.exploreMessage')}</p>
        )}
      </div>

      {/* CTA section with fixed height */}
      <div className="cta-container h-16 flex items-center justify-center">
        {isLoading ? (
          <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
        ) : (
          <Link to={`/${lang}/api-example`} className="button-link">
            {t('home.cta')}
          </Link>
        )}
      </div>
    </main>
  );
}

export default Home;
