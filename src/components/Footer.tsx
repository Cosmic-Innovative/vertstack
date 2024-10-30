import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  const { t } = useTranslation();
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
            <a href="/privacy" className="footer-link">
              {t('footer.privacy')}
            </a>
            <a href="/terms" className="footer-link">
              {t('footer.terms')}
            </a>
            <a href="/sitemap" className="footer-link">
              {t('footer.sitemap')}
            </a>
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
