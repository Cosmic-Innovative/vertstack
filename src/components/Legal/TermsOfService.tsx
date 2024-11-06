import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { loadLegalTranslations } from '../../utils/i18n/legal-loader';

const TermsOfService: React.FC = () => {
  const { t } = useTranslation('legal');
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (lang) {
      setIsLoading(true);
      loadLegalTranslations(lang).finally(() => {
        setIsLoading(false);
      });
    }
  }, [lang]);

  if (isLoading) {
    return (
      <div className="content-section">
        <div className="content-wrapper max-w-2xl mx-auto">
          <div className="loading-container" aria-live="polite">
            {t('general:loading')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <article role="main" className="content-section">
      <div className="content-wrapper max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {t('termsOfService.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('termsOfService.description')}
          </p>
        </div>

        <div className="prose prose-lg mx-auto">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {t('termsOfService.overview.title')}
            </h2>
            <p>{t('termsOfService.overview.content')}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {t('termsOfService.usage.title')}
            </h2>
            <div className="mb-4">
              <h3 className="font-medium mb-2">
                {t('termsOfService.usage.permitted.title')}
              </h3>
              <ul className="list-disc pl-6">
                <li>{t('termsOfService.usage.permitted.personal')}</li>
                <li>{t('termsOfService.usage.permitted.modify')}</li>
                <li>{t('termsOfService.usage.permitted.share')}</li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-medium mb-2">
                {t('termsOfService.usage.prohibited.title')}
              </h3>
              <ul className="list-disc pl-6">
                <li>{t('termsOfService.usage.prohibited.claim')}</li>
                <li>{t('termsOfService.usage.prohibited.sell')}</li>
                <li>{t('termsOfService.usage.prohibited.liability')}</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {t('termsOfService.limitations.title')}
            </h2>
            <p>{t('termsOfService.limitations.content')}</p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(`/${lang}`)}
            className="text-primary hover:underline"
            aria-label={t('common.backToHome')}
          >
            {t('common.backToHome')}
          </button>
        </div>
      </div>
    </article>
  );
};

export default TermsOfService;
