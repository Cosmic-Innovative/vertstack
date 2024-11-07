import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { fetchData, sanitizeInput } from '../utils/api';
import { formatNumber, formatList } from '../utils/i18n';
import { loadPageTranslations } from '../utils/i18n/page-loader';

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
  const { t, i18n } = useTranslation('userList');
  const { lang } = useParams<{ lang: string }>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [translationsLoaded, setTranslationsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeTranslations = async () => {
      if (lang) {
        try {
          await loadPageTranslations('userList', lang);
        } finally {
          if (mounted) {
            setTranslationsLoaded(true);
          }
        }
      }
    };

    initializeTranslations();

    return () => {
      mounted = false;
    };
  }, [lang]);

  useEffect(() => {
    let mounted = true;

    const loadUsers = async () => {
      try {
        if (!translationsLoaded) return;

        const data = await fetchData<User[]>(
          'https://jsonplaceholder.typicode.com/users',
        );
        if (mounted) {
          setUsers(data);
          setError(null);
        }
      } catch (error) {
        if (mounted) {
          setError(error instanceof Error ? error.message : String(error));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      mounted = false;
    };
  }, [translationsLoaded]);

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

  if (!translationsLoaded || loading) {
    return (
      <div className="content-section">
        <div className="content-wrapper max-w-2xl mx-auto">
          <div
            role="status"
            aria-live="polite"
            className="loading-container loading"
          >
            {t('general:loading')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="user-list-container"
      role="region"
      aria-labelledby="user-list-title"
    >
      <h2 id="user-list-title">{t('title')}</h2>
      <p id="user-list-description">{t('description')}</p>

      <div role="status" aria-live="polite" aria-atomic="true">
        {error ? (
          <div role="alert">
            {t('loadingError', { error: sanitizeInput(error) })}
          </div>
        ) : users.length === 0 ? (
          t('noUsers')
        ) : null}
      </div>

      {!error && users.length > 0 && (
        <div>
          <table
            aria-labelledby="user-list-title"
            aria-describedby="user-list-description"
            className="user-table"
          >
            <thead>
              <tr>
                <th scope="col" id="header-name">
                  {t('name')}
                </th>
                <th scope="col" id="header-email">
                  {t('email')}
                </th>
                <th scope="col" id="header-company">
                  {t('company')}
                </th>
                <th scope="col" id="header-location">
                  {t('location')}
                </th>
                <th scope="col" id="header-contact">
                  {t('contact')}
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
                      aria-label={t('accessibility.visitWebsite', {
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
            aria-label={t('accessibility.userStatistics')}
          >
            <div>
              {t('totalUsers', {
                count: users.length,
                formatted: formatNumber(users.length, i18n.language),
              })}
            </div>
            <div>
              {t('companiesRepresented', {
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
