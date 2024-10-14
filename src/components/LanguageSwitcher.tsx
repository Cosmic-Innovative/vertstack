import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    const newPath = location.pathname.replace(`/${i18n.language}`, `/${lang}`);
    navigate(newPath);
  };

  return (
    <div className="language-switcher">
      <button
        onClick={() => changeLanguage('en')}
        disabled={i18n.language === 'en'}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('es')}
        disabled={i18n.language === 'es'}
        aria-label="Switch to Spanish"
      >
        ES
      </button>
    </div>
  );
};

export default LanguageSwitcher;
