import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { loadLegalTranslations } from '../../utils/i18n/legal-loader';

const PrivacyPolicy: React.FC = () => {
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
            {t('privacyPolicy.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('privacyPolicy.description')}
          </p>
        </div>

        <div className="prose prose-lg mx-auto">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {t('privacyPolicy.dataCollection.title')}
            </h2>
            <p>{t('privacyPolicy.dataCollection.content')}</p>
            <ul className="list-disc pl-6">
              <li>{t('privacyPolicy.dataCollection.noPersonal')}</li>
              <li>{t('privacyPolicy.dataCollection.noCookies')}</li>
              <li>{t('privacyPolicy.dataCollection.noTracking')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {t('privacyPolicy.storage.title')}
            </h2>
            <ul className="list-disc pl-6">
              <li>{t('privacyPolicy.storage.preferences')}</li>
              <li>{t('privacyPolicy.storage.temporary')}</li>
              <li>{t('privacyPolicy.storage.noSensitive')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {t('privacyPolicy.security.title')}
            </h2>
            <p>{t('privacyPolicy.security.content')}</p>
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

export default PrivacyPolicy;
