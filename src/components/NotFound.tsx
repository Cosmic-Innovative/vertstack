import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();

  return (
    <article
      role="main"
      className="content-section"
      data-testid="not-found-content"
    >
      <div className="content-wrapper max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4" id="not-found-title">
            {t('notFound.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            {t('notFound.description')}
          </p>

          {/* 404 Illustration */}
          <div className="w-64 h-64 mx-auto mb-8">
            <img
              src="/404.svg"
              alt={t('notFound.illustration')}
              className="w-full h-full"
              width="256"
              height="256"
            />
          </div>

          <button
            onClick={() => navigate(`/${lang}`)}
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all"
            aria-label={t('notFound.returnHome')}
          >
            {t('notFound.returnButton')}
          </button>
        </div>
      </div>
    </article>
  );
};

export default NotFound;
