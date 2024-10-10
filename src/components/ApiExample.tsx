import UserList from './UserList';
import { useTranslation } from 'react-i18next';

function ApiExample() {
  const { t } = useTranslation();

  return (
    <div className="api-example-container">
      <h1>{t('apiExample.title')}</h1>
      <p>{t('apiExample.description')}</p>
      <div aria-live="polite" aria-atomic="true">
        <UserList />
      </div>
    </div>
  );
}

export default ApiExample;
