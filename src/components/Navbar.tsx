import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();

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
      <LanguageSwitcher />
    </nav>
  );
};

export default Navbar;
