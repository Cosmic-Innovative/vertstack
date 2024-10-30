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
    <article role="main" aria-labelledby="home-title">
      <div className="hero-section" aria-label={t('home.heroAlt')}>
        {!isLoading && (
          <OptimizedHeroImage
            desktopSrc="/desktop-hero.svg"
            alt={t('home.heroAlt')}
            priority={true}
            className="w-full h-full"
          />
        )}
      </div>

      <section className="content-section">
        <div className="content-wrapper">
          {/* Title section */}
          <div className="title-container h-24 mb-8 flex items-center justify-center">
            {isLoading ? (
              <>
                <div className="inline-logo w-[50px] h-[50px] bg-gray-200 rounded animate-pulse" />
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
                <h1 id="home-title">{t('home.title')}</h1>
              </>
            )}
          </div>

          {/* Description section */}
          <div className="description-section min-h-[100px] text-left">
            {isLoading ? (
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
              </div>
            ) : (
              <p>{t('home.description')}</p>
            )}
          </div>

          {/* Features list */}
          <ul
            className="text-center features-list min-h-[200px] my-8"
            aria-label={t('home.features.title')}
          >
            {isLoading ? (
              Array(4)
                .fill(null)
                .map((_, index) => (
                  <li
                    key={index}
                    className="flex items-center h-12 mb-4 justify-center"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                    <div className="ml-4 h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                  </li>
                ))
            ) : (
              <>
                <li className="feature-item justify-center">
                  <strong aria-hidden="true">V</strong>
                  <span>{t('home.features.vite')}</span>
                </li>
                <li className="feature-item justify-center">
                  <strong aria-hidden="true">E</strong>
                  <span>{t('home.features.eslint')}</span>
                </li>
                <li className="feature-item justify-center">
                  <strong aria-hidden="true">R</strong>
                  <span>{t('home.features.react')}</span>
                </li>
                <li className="feature-item justify-center">
                  <strong aria-hidden="true">T</strong>
                  <span>{t('home.features.typescript')}</span>
                </li>
              </>
            )}
          </ul>

          {/* Message section */}
          <div className="message-section h-20 text-left">
            {isLoading ? (
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            ) : (
              <p>{t('home.exploreMessage')}</p>
            )}
          </div>

          {/* CTA section */}
          <div className="cta-container h-16 flex items-center justify-center">
            {isLoading ? (
              <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
            ) : (
              <Link
                to={`/${lang}/api-example`}
                className="button-link"
                aria-label={t('home.cta')}
              >
                {t('home.cta')}
              </Link>
            )}
          </div>
        </div>
      </section>
    </article>
  );
}

export default Home;
