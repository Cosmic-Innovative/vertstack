import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <nav aria-label="Main navigation">
      <ul>
        <li>
          <Link to="/" aria-label={t('navbar.home')}>
            {t('navbar.home')}
          </Link>
        </li>
        <li>
          <Link to="/about" aria-label={t('navbar.about')}>
            {t('navbar.about')}
          </Link>
        </li>
        <li>
          <Link to="/contact" aria-label={t('navbar.contact')}>
            {t('navbar.contact')}
          </Link>
        </li>
        <li>
          <Link to="/api-example" aria-label={t('navbar.apiExample')}>
            {t('navbar.apiExample')}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
