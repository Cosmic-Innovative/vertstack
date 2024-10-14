import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/LanguageSwitcher.css';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    const newPath = location.pathname.replace(`/${i18n.language}`, `/${lang}`);
    navigate(newPath);
  };

  const flagIcons = {
    en: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 60 30"
        width="22"
        height="11"
      >
        <clipPath id="a">
          <path d="M0 0v30h60V0z" />
        </clipPath>
        <clipPath id="b">
          <path d="M30 15h30v15zv15H0zH0V0zV0h30z" />
        </clipPath>
        <g clipPath="url(#a)">
          <path d="M0 0v30h60V0z" fill="#012169" />
          <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
          <path
            d="M0 0l60 30m0-30L0 30"
            clipPath="url(#b)"
            stroke="#C8102E"
            strokeWidth="4"
          />
          <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
          <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
        </g>
      </svg>
    ),
    es: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 750 500"
        width="22"
        height="15"
      >
        <rect width="750" height="500" fill="#c60b1e" />
        <rect width="750" height="250" y="125" fill="#ffc400" />
      </svg>
    ),
  };

  return (
    <div className="language-switcher">
      {Object.entries(flagIcons).map(([lang, icon]) => (
        <button
          key={lang}
          onClick={() => changeLanguage(lang)}
          disabled={i18n.language === lang}
          aria-label={`Switch to ${lang === 'en' ? 'English' : 'Spanish'}`}
          className="language-button"
        >
          {icon}
          <span className="language-code">{lang.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
