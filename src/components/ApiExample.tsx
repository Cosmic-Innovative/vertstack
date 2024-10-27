import { useTranslation } from 'react-i18next';
import UserList from './UserList';

function ApiExample() {
  const { t } = useTranslation();

  return (
    <article className="content-section">
      <div className="content-wrapper">
        <h1 className="text-center mb-8">{t('apiExample.title')}</h1>
        <p className="text-left">{t('apiExample.description')}</p>

        {/* Wrap UserList in a section with proper ARIA attributes */}
        <section
          aria-labelledby="api-example-user-list"
          aria-live="polite"
          aria-atomic="true"
        >
          {/* Hidden heading for screen reader users */}
          <h2 id="api-example-user-list" className="sr-only">
            {t('userList.title')}
          </h2>
          <UserList />
        </section>
      </div>
    </article>
  );
}

export default ApiExample;
