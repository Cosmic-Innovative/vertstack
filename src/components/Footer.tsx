import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-language-selector">
            <LanguageSwitcher popupDirection="up" />
          </div>
          <div className="footer-attribution">
            <p>
              {t('footer.createdWith')} ❤️ {t('footer.by')}{' '}
              <a
                href="https://cosmicinnovative.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cosmic Innovative
              </a>
              <span className="footer-copyright">© {currentYear}</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
