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
    <div
      className="user-list-container"
      role="region"
      aria-label={t('userList.title')}
    >
      <h2 id="user-list-title">{t('userList.title')}</h2>
      <p id="user-list-description">{t('userList.description')}</p>

      {/* Single status region for loading/error/empty states */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={loading ? 'loading' : undefined}
      >
        {loading ? (
          t('general.loading')
        ) : error ? (
          <div role="alert">
            {t('errors.fetchError', { error: sanitizeInput(error) })}
          </div>
        ) : users.length === 0 ? (
          t('userList.noUsers')
        ) : null}
      </div>

      {!loading && !error && users.length > 0 && (
        <div aria-busy={loading}>
          <table
            aria-labelledby="user-list-title"
            aria-describedby="user-list-description"
            className="user-table"
          >
            <thead>
              <tr>
                <th scope="col" id="header-name">
                  {t('userList.name')}
                </th>
                <th scope="col" id="header-email">
                  {t('userList.email')}
                </th>
                <th scope="col" id="header-company">
                  {t('userList.company')}
                </th>
                <th scope="col" id="header-location">
                  {t('userList.location')}
                </th>
                <th scope="col" id="header-contact">
                  {t('userList.contact')}
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <th scope="row" headers="header-name">
                    {sanitizeInput(user.name)}
                  </th>
                  <td headers="header-email">{sanitizeInput(user.email)}</td>
                  <td headers="header-company">
                    <div>{sanitizeInput(user.company.name)}</div>
                    <small>{sanitizeInput(user.company.catchPhrase)}</small>
                  </td>
                  <td headers="header-location">
                    {formatAddress(user.address)}
                  </td>
                  <td headers="header-contact">
                    <div>{sanitizeInput(user.phone)}</div>
                    <a
                      href={`https://${user.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t('userList.visitWebsite', {
                        website: user.website,
                      })}
                    >
                      {sanitizeInput(user.website)}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            className="stats-summary"
            role="complementary"
            aria-label={t('userList.statisticsSummary')}
          >
            <div>
              {t('userList.totalUsers', {
                count: users.length,
                formatted: formatNumber(users.length, i18n.language),
              })}
            </div>
            <div>
              {t('userList.companiesRepresented', {
                count: new Set(users.map((user) => user.company.name)).size,
                formatted: formatNumber(
                  new Set(users.map((user) => user.company.name)).size,
                  i18n.language,
                ),
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;
