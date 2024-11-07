import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { loadPageTranslations } from '../utils/i18n/page-loader';

function About() {
  const { t } = useTranslation('about');
  const { lang } = useParams<{ lang: string }>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeTranslations = async () => {
      if (lang) {
        setIsLoading(true);
        await loadPageTranslations('about', lang);
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

  if (isLoading) {
    return (
      <div className="content-section">
        <div className="content-wrapper max-w-2xl mx-auto">
          <div className="loading-container" role="status" aria-live="polite">
            {t('general:loading')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <article role="main" aria-labelledby="about-title">
      <section className="content-section">
        <div className="content-wrapper max-w-2xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 id="about-title" className="text-3xl font-bold mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('description')}
            </p>
          </div>

          {/* Core Principles */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-6">
              {t('principles.title')}
            </h2>
            <ul className="space-y-6">
              <li className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-medium text-lg mb-2">
                  {t('principles.speed.title')}
                </h3>
                <p className="text-gray-600">
                  {t('principles.speed.description')}
                </p>
              </li>
              <li className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-medium text-lg mb-2">
                  {t('principles.quality.title')}
                </h3>
                <p className="text-gray-600">
                  {t('principles.quality.description')}
                </p>
              </li>
              <li className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-medium text-lg mb-2">
                  {t('principles.types.title')}
                </h3>
                <p className="text-gray-600">
                  {t('principles.types.description')}
                </p>
              </li>
              <li className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-medium text-lg mb-2">
                  {t('principles.modern.title')}
                </h3>
                <p className="text-gray-600">
                  {t('principles.modern.description')}
                </p>
              </li>
            </ul>
          </div>

          {/* Built For */}
          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold mb-6">
              {t('builtFor.title')}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-medium text-lg mb-2">
                  {t('builtFor.teams.title')}
                </h3>
                <p className="text-gray-600">
                  {t('builtFor.teams.description')}
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-medium text-lg mb-2">
                  {t('builtFor.projects.title')}
                </h3>
                <p className="text-gray-600">
                  {t('builtFor.projects.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

export default About;
