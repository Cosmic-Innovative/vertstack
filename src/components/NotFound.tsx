import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { loadPageTranslations } from '../utils/i18n/page-loader';

const NotFound = () => {
  const { t } = useTranslation('notFound');
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeTranslations = async () => {
      if (lang) {
        setIsLoading(true);
        await loadPageTranslations('notFound', lang);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeTranslations();

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
    <article
      role="main"
      className="content-section"
      data-testid="not-found-content"
    >
      <div className="content-wrapper max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4" id="not-found-title">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            {t('description')}
          </p>

          {/* 404 Illustration */}
          <div className="w-64 h-64 mx-auto mb-8">
            <img
              src="/404.svg"
              alt={t('illustration')}
              className="w-full h-full"
              width="256"
              height="256"
            />
          </div>

          <button
            onClick={() => navigate(`/${lang}`)}
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all"
            aria-label={t('returnHome')}
          >
            {t('returnButton')}
          </button>
        </div>
      </div>
    </article>
  );
};

export default NotFound;
