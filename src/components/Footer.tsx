import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="footer"
      role="contentinfo"
      aria-label={t('footer.ariaLabel')}
    >
      <div className="footer-container">
        <div className="footer-content">
          {/* Language Switcher */}
          <div className="footer-language-selector">
            <LanguageSwitcher
              popupDirection="up"
              aria-label={t('footer.languageSelectorLabel')}
            />
          </div>

          {/* Navigation Links */}
          <nav
            className="footer-links"
            aria-label={t('footer.navigationLabel')}
          >
            <Link to={`/${lang}/privacy`} className="footer-link">
              {t('footer.privacy')}
            </Link>
            <Link to={`/${lang}/terms`} className="footer-link">
              {t('footer.terms')}
            </Link>
            <Link to={`/${lang}/sitemap`} className="footer-link">
              {t('footer.sitemap')}
            </Link>
          </nav>

          {/* Attribution */}
          <div className="footer-attribution">
            {t('footer.createdWith')}{' '}
            <span role="img" aria-label={t('footer.heartEmoji')}>
              ❤️
            </span>{' '}
            {t('footer.by')}{' '}
            <a
              href="https://cosmicinnovative.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('footer.companyLinkLabel')}
            >
              Cosmic Innovative
            </a>
            <span className="footer-copyright">© {currentYear}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
