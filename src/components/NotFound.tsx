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

          {/* SVG Illustration */}
          <div
            className="w-64 h-64 mx-auto mb-8"
            role="img"
            aria-label={t('notFound.illustration')}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <rect width="200" height="200" fill="#f8f9fa" />
              {/* Stack of "pages" */}
              <rect
                x="40"
                y="40"
                width="120"
                height="120"
                fill="#e9ecef"
                rx="4"
              />
              <rect
                x="45"
                y="35"
                width="120"
                height="120"
                fill="#dee2e6"
                rx="4"
              />
              <rect
                x="50"
                y="30"
                width="120"
                height="120"
                fill="#ffffff"
                rx="4"
              />
              {/* 404 text */}
              <text
                x="100"
                y="100"
                fontSize="32"
                fontWeight="bold"
                fill="#0052cc"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                404
              </text>
              {/* VERT logo simplified */}
              <path
                d="M85 75 L100 60 L115 75 L100 90 Z"
                fill="#0052cc"
                opacity="0.2"
              />
            </svg>
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
