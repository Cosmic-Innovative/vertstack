import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OptimizedHeroImage from './OptimizedHeroImage';
import LazyImage from './LazyImage';

function Home() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <article aria-labelledby="home-title" className="home-article">
      <div className="hero-section" aria-hidden={isLoading} role="banner">
        {!isLoading && (
          <OptimizedHeroImage
            desktopSrc="/desktop-hero.svg"
            alt={t('home.heroAlt')}
            priority={true}
            className="w-full h-full"
            aria-labelledby="home-title"
          />
        )}
      </div>

      <div className="content-wrapper">
        {/* Title section with proper heading structure */}
        <div className="title-container h-24 mb-8 flex items-center justify-center">
          {isLoading ? (
            <div className="loading-skeleton" aria-hidden="true">
              <div className="inline-logo w-[50px] h-[50px] bg-gray-200 rounded animate-pulse" />
              <div className="ml-4 h-8 w-64 bg-gray-200 rounded animate-pulse" />
            </div>
          ) : (
            <>
              <LazyImage
                src="/vertstack.svg"
                alt={t('home.logoAlt')}
                className="inline-logo"
                width="50"
                height="50"
              />
              <h1 id="home-title">{t('home.title')}</h1>
            </>
          )}
        </div>

        {/* Description section */}
        <section
          className="description-section min-h-[100px] text-left"
          aria-label={t('home.sections.description')}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <div className="loading-skeleton" aria-hidden="true">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
            </div>
          ) : (
            <p>{t('home.description')}</p>
          )}
        </section>

        {/* Features section */}
        <section
          aria-labelledby="features-title"
          aria-label={t('home.sections.features')}
        >
          <h2 id="features-title" className="sr-only">
            {t('home.features.title')}
          </h2>
          {isLoading ? (
            <div className="loading-skeleton" aria-hidden="true">
              <ul className="text-center features-list min-h-[200px] my-8">
                {Array(4)
                  .fill(null)
                  .map((_, index) => (
                    <li
                      key={index}
                      className="flex items-center h-12 mb-4 justify-center"
                    >
                      <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                      <div className="ml-4 h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <ul
              className="text-center features-list min-h-[200px] my-8"
              aria-label={t('home.features.listLabel')}
            >
              <li className="feature-item justify-center">
                <strong>V</strong>
                <span className="ml-2">{t('home.features.vite')}</span>
              </li>
              <li className="feature-item justify-center">
                <strong>E</strong>
                <span className="ml-2">{t('home.features.eslint')}</span>
              </li>
              <li className="feature-item justify-center">
                <strong>R</strong>
                <span className="ml-2">{t('home.features.react')}</span>
              </li>
              <li className="feature-item justify-center">
                <strong>T</strong>
                <span className="ml-2">{t('home.features.typescript')}</span>
              </li>
            </ul>
          )}
        </section>

        {/* Message section */}
        <section
          className="message-section h-20 text-left"
          aria-label={t('home.sections.message')}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <div className="loading-skeleton" aria-hidden="true">
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
          ) : (
            <p>{t('home.exploreMessage')}</p>
          )}
        </section>

        {/* CTA section */}
        <section
          className="cta-container h-16 flex items-center justify-center"
          aria-label={t('home.sections.cta')}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <div className="loading-skeleton" aria-hidden="true">
              <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
            </div>
          ) : (
            <Link
              to={`/${lang}/api-example`}
              className="button-link"
              aria-label={t('home.ctaAriaLabel')}
            >
              {t('home.cta')}
            </Link>
          )}
        </section>
      </div>
    </article>
  );
}

export default Home;
