import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import OptimizedHeroImage from './OptimizedHeroImage';
import { loadPageTranslations } from '../utils/i18n/page-loader';

function Home() {
  const { t } = useTranslation('home');
  const { lang } = useParams<{ lang: string }>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeTranslations = async () => {
      if (lang) {
        setIsLoading(true);
        await loadPageTranslations('home', lang);
        // Only update state if component is still mounted
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeTranslations();

    // Cleanup function to prevent memory leaks
    return () => {
      mounted = false;
    };
  }, [lang]);

  return (
    <article role="main" aria-labelledby="home-title">
      {/* Hero Section */}
      <div
        className="hero-section relative overflow-hidden bg-background w-full max-w-[1200px] mx-auto mb-4 aspect-[1200/252]"
        aria-label={t('heroAlt')}
      >
        {!isLoading && (
          <OptimizedHeroImage
            desktopSrc="/desktop-hero.svg"
            mobileSrc="/mobile-hero.svg"
            alt={t('heroAlt')}
            priority={true}
            width="1200"
            height="252"
            className="w-full h-full object-contain"
          />
        )}
      </div>

      <section className="content-section">
        <div className="content-wrapper max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 id="home-title" className="text-2xl font-bold mb-6 text-center">
              {t('foundation')}
            </h1>
            <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl mx-auto">
              {t('tagline')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="feature-card p-6 rounded-lg bg-white shadow-sm">
              <h2 className="text-xl font-semibold mb-2">
                {t('features.vite')}
              </h2>
              <p className="text-gray-600">{t('features.viteDesc')}</p>
            </div>

            <div className="feature-card p-6 rounded-lg bg-white shadow-sm">
              <h2 className="text-xl font-semibold mb-2">
                {t('features.eslint')}
              </h2>
              <p className="text-gray-600">{t('features.eslintDesc')}</p>
            </div>

            <div className="feature-card p-6 rounded-lg bg-white shadow-sm">
              <h2 className="text-xl font-semibold mb-2">
                {t('features.react')}
              </h2>
              <p className="text-gray-600">{t('features.reactDesc')}</p>
            </div>

            <div className="feature-card p-6 rounded-lg bg-white shadow-sm">
              <h2 className="text-xl font-semibold mb-2">
                {t('features.typescript')}
              </h2>
              <p className="text-gray-600">{t('features.typescriptDesc')}</p>
            </div>
          </div>

          <div className="text-center">
            <a
              href="https://github.com/vertstack"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all"
              aria-label={t('cta.githubAriaLabel')}
            >
              {t('cta.github')}
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}

export default Home;
