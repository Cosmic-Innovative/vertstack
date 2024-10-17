import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/LanguageSwitcher.css';

interface Language {
  code: string;
  name: string;
  flag: string;
}

// Define supported languages with their codes, names, and flag emojis
const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇲🇽' },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Function to change the language and update the URL
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    // Update the URL to reflect the new language
    const newPath = location.pathname.replace(`/${i18n.language}`, `/${lang}`);
    navigate(newPath);
    setIsOpen(false);
  };

  // Get the current language object
  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="language-switcher-dropdown" ref={dropdownRef}>
      {/* Language switcher button */}
      <button
        className="language-dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="language-flag" aria-hidden="true">
          {currentLanguage.flag}
        </span>
        <span className="language-name">{currentLanguage.name}</span>
      </button>
      {/* Dropdown menu for language selection */}
      {isOpen && (
        <div className="language-dropdown-menu">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="language-option"
              aria-label={`Switch to ${lang.name}`}
            >
              <span className="language-flag" aria-hidden="true">
                {lang.flag}
              </span>
              <span className="language-name">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
