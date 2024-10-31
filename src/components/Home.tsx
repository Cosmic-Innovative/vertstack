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
      {/* Hero Section */}
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
        <div className="content-wrapper max-w-2xl mx-auto">
          {/* Title and Logo */}
          <div className="title-container text-center mb-12">
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
                  className="inline-logo mx-auto mb-6"
                  width="50"
                  height="50"
                />
                <h1 id="home-title" className="text-3xl font-bold">
                  {t('home.title')}
                </h1>
                <p className="text-lg text-gray-600 mt-4">
                  {t('home.description')}
                </p>
              </>
            )}
          </div>

          {/* Key Features */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-6 text-center">
              {t('home.features.title')}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="feature-item">
                <h3 className="font-medium mb-2">{t('home.features.vite')}</h3>
                <p className="text-gray-600">{t('home.features.viteDesc')}</p>
              </div>
              <div className="feature-item">
                <h3 className="font-medium mb-2">
                  {t('home.features.eslint')}
                </h3>
                <p className="text-gray-600">{t('home.features.eslintDesc')}</p>
              </div>
              <div className="feature-item">
                <h3 className="font-medium mb-2">{t('home.features.react')}</h3>
                <p className="text-gray-600">{t('home.features.reactDesc')}</p>
              </div>
              <div className="feature-item">
                <h3 className="font-medium mb-2">
                  {t('home.features.typescript')}
                </h3>
                <p className="text-gray-600">
                  {t('home.features.typescriptDesc')}
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <p className="mb-8 text-gray-600">{t('home.exploreMessage')}</p>
            <div className="flex justify-center gap-4">
              <Link
                to={`/${lang}/api-example`}
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all"
                aria-label={t('home.cta.exploreAriaLabel')}
              >
                {t('home.cta.explore')}
              </Link>
              <a
                href="https://github.com/vertstack"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border-2 border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary hover:text-white transition-all"
                aria-label={t('home.cta.githubAriaLabel')}
              >
                {t('home.cta.github')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

export default Home;
