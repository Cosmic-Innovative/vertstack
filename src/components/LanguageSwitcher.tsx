import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { changeLanguage } from '../i18n';
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
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(
    null,
  );

  const minSwipeDistance = 50;

  const handleLanguageChange = useCallback(
    async (languageCode: string) => {
      const pathParts = location.pathname.split('/');
      pathParts[1] = languageCode;
      const newPath = pathParts.join('/');

      const success = await changeLanguage(languageCode);
      if (success) {
        navigate(newPath);
        setIsOpen(false);
        document.documentElement.lang = languageCode;
      }
    },
    [navigate, location.pathname],
  );

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, {
      passive: true,
    });

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
    setTouchEnd(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const xDistance = touchStart.x - touchEnd.x;
    const yDistance = touchStart.y - touchEnd.y;
    const isHorizontalSwipe = Math.abs(xDistance) > Math.abs(yDistance);

    if (isHorizontalSwipe && Math.abs(xDistance) > minSwipeDistance) {
      if (xDistance > 0) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    } else if (!isHorizontalSwipe && Math.abs(yDistance) > minSwipeDistance) {
      if (
        (popupDirection === 'up' && yDistance > 0) ||
        (popupDirection === 'down' && yDistance < 0)
      ) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
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
        void handleLanguageChange(languageCode);
        break;
      case 'Escape':
        event.preventDefault();
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

  const currentLanguage =
    languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <div
      className={`language-switcher ${className} popup-${popupDirection} ${
        isOpen ? 'is-active' : ''
      }`}
      data-testid="language-switcher"
      ref={menuRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
