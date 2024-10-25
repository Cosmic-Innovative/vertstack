import React, { useState, useRef, useEffect } from 'react';
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
  const navRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance for gesture detection (in px)
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setIsMenuOpen(false);
    } else if (isRightSwipe) {
      setIsMenuOpen(true);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, {
      passive: true,
    });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  return (
    <nav
      className="navbar"
      role="navigation"
      aria-label="Main navigation"
      ref={navRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
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
