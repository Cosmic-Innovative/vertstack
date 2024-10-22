import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Navbar.css';

interface NavbarProps {
  alignment?: 'left' | 'center' | 'right';
}

const Navbar: React.FC<NavbarProps> = ({ alignment = 'right' }) => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-container">
        <Link to={`/${lang}`} className="navbar-brand">
          {t('navbar.brand')}
        </Link>
        <button
          className="navbar-toggle"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className="navbar-toggle-icon"></span>
        </button>
        <div
          className={`navbar-menu align-${alignment} ${
            isMenuOpen ? 'is-active' : ''
          }`}
          data-testid="navbar-menu"
        >
          <ul className="navbar-links">
            <li>
              <Link to={`/${lang}`} onClick={() => setIsMenuOpen(false)}>
                {t('navbar.home')}
              </Link>
            </li>
            <li>
              <Link to={`/${lang}/about`} onClick={() => setIsMenuOpen(false)}>
                {t('navbar.about')}
              </Link>
            </li>
            <li>
              <Link
                to={`/${lang}/contact`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navbar.contact')}
              </Link>
            </li>
            <li>
              <Link
                to={`/${lang}/api-example`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navbar.apiExample')}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
