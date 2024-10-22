import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/LanguageSwitcher.css';

interface Language {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

interface LanguageSwitcherProps {
  className?: string;
  popupDirection?: 'up' | 'down';
}

const languages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇲🇽' },
];

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  popupDirection = 'down',
}) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleLanguageChange = useCallback(
    (languageCode: string) => {
      const pathParts = location.pathname.split('/');
      pathParts[1] = languageCode;
      const newPath = pathParts.join('/');

      i18n.changeLanguage(languageCode).then(() => {
        navigate(newPath);
        setIsOpen(false);
        buttonRef.current?.focus();
      });
    },
    [i18n, navigate, location.pathname],
  );

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      case 'ArrowDown': {
        if (isOpen) {
          event.preventDefault();
          const firstButton = menuRef.current?.querySelector('button');
          if (firstButton instanceof HTMLElement) {
            firstButton.focus();
          }
        }
        break;
      }
      case ' ':
      case 'Enter':
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
      default:
        break;
    }
  };

  const handleOptionKeyDown = (
    event: React.KeyboardEvent,
    languageCode: string,
  ) => {
    const buttons = Array.from(
      menuRef.current?.querySelectorAll('button') || [],
    );
    const currentIndex = buttons.indexOf(event.target as HTMLButtonElement);

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleLanguageChange(languageCode);
        break;
      case 'Escape':
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      case 'ArrowUp': {
        event.preventDefault();
        if (currentIndex > 0) {
          (buttons[currentIndex - 1] as HTMLElement).focus();
        } else {
          buttonRef.current?.focus();
        }
        break;
      }
      case 'ArrowDown': {
        event.preventDefault();
        if (currentIndex < buttons.length - 1) {
          (buttons[currentIndex + 1] as HTMLElement).focus();
        }
        break;
      }
      default:
        break;
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentLanguage =
    languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <div
      className={`language-switcher ${className} popup-${popupDirection} ${
        isOpen ? 'is-open' : ''
      }`}
      data-testid="language-switcher"
      ref={menuRef}
    >
      <button
        ref={buttonRef}
        className="language-display"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <span className="language-flag" aria-hidden="true">
          {currentLanguage.flag}
        </span>
        <span className="language-name">{currentLanguage.nativeName}</span>
        <span className="language-dropdown-arrow" aria-hidden="true">
          ▾
        </span>
      </button>
      {isOpen && (
        <div
          className="language-options"
          role="listbox"
          aria-label="Select language"
          tabIndex={-1}
        >
          {languages.map((language) => (
            <button
              key={language.code}
              className={`language-option ${
                language.code === i18n.language ? 'active' : ''
              }`}
              onClick={() => handleLanguageChange(language.code)}
              onKeyDown={(e) => handleOptionKeyDown(e, language.code)}
              role="option"
              aria-selected={language.code === i18n.language}
              tabIndex={0}
            >
              <span className="language-flag" aria-hidden="true">
                {language.flag}
              </span>
              <span className="language-name">{language.nativeName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
