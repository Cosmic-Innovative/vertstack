import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import UserList from './UserList';
import { loadPageTranslations } from '../utils/i18n/page-loader';

function ApiExample() {
  const { t } = useTranslation('apiExample');
  const { lang } = useParams<{ lang: string }>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeTranslations = async () => {
      if (lang) {
        setIsLoading(true);
        await loadPageTranslations('apiExample', lang);
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
    <article role="main" aria-labelledby="api-example-title">
      <section className="content-section">
        <div className="content-wrapper max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 id="api-example-title" className="text-3xl font-bold mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('description')}
            </p>
          </div>

          {/* UserList Component */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <UserList />
          </div>
        </div>
      </section>
    </article>
  );
}

export default ApiExample;
