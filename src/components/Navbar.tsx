import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();

  const changeLanguage = (newLang: string) => {
    i18n.changeLanguage(newLang);
    const newPath = window.location.pathname.replace(`/${lang}`, `/${newLang}`);
    navigate(newPath);
  };

  return (
    <nav aria-label="Main navigation" role="navigation">
      <ul>
        <li>
          <Link to={`/${lang}`} aria-label={t('navbar.home')}>
            {t('navbar.home')}
          </Link>
        </li>
        <li>
          <Link to={`/${lang}/about`} aria-label={t('navbar.about')}>
            {t('navbar.about')}
          </Link>
        </li>
        <li>
          <Link to={`/${lang}/contact`} aria-label={t('navbar.contact')}>
            {t('navbar.contact')}
          </Link>
        </li>
        <li>
          <Link to={`/${lang}/api-example`} aria-label={t('navbar.apiExample')}>
            {t('navbar.apiExample')}
          </Link>
        </li>
      </ul>
      <div>
        <button onClick={() => changeLanguage('en')} disabled={lang === 'en'}>
          EN
        </button>
        <button onClick={() => changeLanguage('es')} disabled={lang === 'es'}>
          ES
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
