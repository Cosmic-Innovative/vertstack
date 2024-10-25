import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchData, sanitizeInput } from '../utils/api';
import { formatNumber, formatList } from '../utils/i18n';

interface UserAddress {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: {
    lat: string;
    lng: string;
  };
}

interface UserCompany {
  name: string;
  catchPhrase: string;
  bs: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address?: UserAddress;
  phone: string;
  website: string;
  company: UserCompany;
}

function UserList() {
  const { t, i18n } = useTranslation();
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

  const formatAddress = (address?: UserAddress): string => {
    if (!address) return '-';
    const parts = [
      address.street,
      address.suite,
      address.city,
      address.zipcode,
    ].filter(Boolean);
    return formatList(parts, i18n.language);
  };

  return (
    <div className="user-list-container">
      <h2>{t('userList.title')}</h2>
      <p>{t('userList.description')}</p>

      {users.length > 0 ? (
        <table className="user-table">
          <thead>
            <tr>
              <th>{t('userList.name')}</th>
              <th>{t('userList.email')}</th>
              <th>{t('userList.company')}</th>
              <th>{t('userList.location')}</th>
              <th>{t('userList.contact')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{sanitizeInput(user.name)}</td>
                <td>{sanitizeInput(user.email)}</td>
                <td>
                  <div>{sanitizeInput(user.company.name)}</div>
                  <small>{sanitizeInput(user.company.catchPhrase)}</small>
                </td>
                <td>{formatAddress(user.address)}</td>
                <td>
                  <div>{sanitizeInput(user.phone)}</div>
                  <a
                    href={`https://${user.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {sanitizeInput(user.website)}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>{t('userList.noUsers')}</p>
      )}

      <div className="stats-summary">
        <p>
          {t('userList.totalUsers', {
            count: users.length,
            formatted: formatNumber(users.length, i18n.language),
          })}
        </p>
        <p>
          {t('userList.companiesRepresented', {
            count: new Set(users.map((user) => user.company.name)).size,
            formatted: formatNumber(
              new Set(users.map((user) => user.company.name)).size,
              i18n.language,
            ),
          })}
        </p>
      </div>
    </div>
  );
}

export default UserList;
