import { useTranslation } from 'react-i18next';
import UserList from './UserList';

function ApiExample() {
  const { t } = useTranslation();

  return (
    <article className="content-section">
      <div className="content-wrapper">
        <h1>{t('apiExample.title')}</h1>
        <UserList />
      </div>
    </article>
  );
}

export default ApiExample;
