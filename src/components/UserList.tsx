import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchData, sanitizeInput } from '../utils/api';

interface User {
  id: number;
  name: string;
  email: string;
  company: {
    name: string;
  };
}

function UserList() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData<User[]>('https://jsonplaceholder.typicode.com/users')
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">{t('general.loading')}</div>;
  if (error)
    return (
      <div className="error">
        {t('errors.fetchError', { error: sanitizeInput(error) })}
      </div>
    );

  return (
    <div className="user-list-container">
      <h2>{t('userList.title')}</h2>
      <p>{t('userList.description')}</p>
      <p>{t('userList.keyPoints')}</p>
      <ul>
        <li>{t('userList.keyPoint1')}</li>
        <li>{t('userList.keyPoint2')}</li>
        <li>{t('userList.keyPoint3')}</li>
      </ul>
      <div className="api-info">
        <h3>{t('userList.apiDetails')}</h3>
        <p>{t('userList.apiEndpoint')}</p>
        <p>{t('userList.apiDescription')}</p>
      </div>
      <h3>{t('userList.userData')}</h3>
      {users.length > 0 ? (
        <table className="user-table">
          <thead>
            <tr>
              <th>{t('userList.name')}</th>
              <th>{t('userList.email')}</th>
              <th>{t('userList.company')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{sanitizeInput(user.name)}</td>
                <td>{sanitizeInput(user.email)}</td>
                <td>{sanitizeInput(user.company.name)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>{t('userList.noUsers')}</p>
      )}
    </div>
  );
}

export default UserList;
