import { useTranslation } from 'react-i18next';
import UserList from './UserList';

function ApiExample() {
  const { t } = useTranslation();

  return (
    <article role="main" aria-labelledby="api-example-title">
      <section className="content-section">
        <div className="content-wrapper max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 id="api-example-title" className="text-3xl font-bold mb-4">
              {t('apiExample.title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('apiExample.description')}
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
