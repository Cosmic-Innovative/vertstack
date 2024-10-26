import UserList from './UserList';
import { useTranslation } from 'react-i18next';

function ApiExample() {
  const { t } = useTranslation();
  return (
    <article className="content-section">
      <div className="content-wrapper">
        <h1 className="text-center mb-8">{t('apiExample.title')}</h1>
        <p className="text-left">{t('apiExample.description')}</p>
        <div aria-live="polite" aria-atomic="true">
          <UserList />
        </div>
      </div>
    </article>
  );
}

export default ApiExample;
