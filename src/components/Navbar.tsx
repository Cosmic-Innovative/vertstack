import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Navbar.css';

interface NavbarProps {
  alignment?: 'left' | 'center' | 'right';
}

const Navbar: React.FC<NavbarProps> = ({ alignment = 'right' }) => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Function to check if a path is current
  const isCurrentPage = (path: string): boolean => {
    const currentPath = location.pathname.replace(`/${lang}`, '');
    return currentPath === path;
  };

  // Focus trap implementation
  useEffect(() => {
    if (!isMenuOpen) return;

    const menuElement = menuRef.current;
    if (!menuElement) return;

    const focusableElements = menuElement.querySelectorAll(
      'a[href], button, [tabindex]:not([tabindex="-1"])',
    );
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        hamburgerRef.current?.focus();
        return;
      }

      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    menuElement.addEventListener('keydown', handleKeyDown);
    return () => menuElement.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

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
    // Announce menu state to screen readers
    const announcement = document.createElement('div');
    announcement.className = 'sr-only';
    announcement.setAttribute('aria-live', 'polite');
    announcement.textContent = !isMenuOpen
      ? t('accessibility.menuOpen')
      : t('accessibility.menuClose');
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  return (
    <nav
      className="navbar"
      role="navigation"
      aria-label={t('accessibility.mainNavigation')}
      ref={navRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="navbar-container">
        <Link
          to={`/${lang}`}
          className="navbar-brand"
          aria-label={t('navbar.brand')}
        >
          {t('navbar.brand')}
        </Link>
        <button
          ref={hamburgerRef}
          className="navbar-toggle"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls="navbar-menu"
          aria-label={t(
            isMenuOpen ? 'accessibility.menuClose' : 'accessibility.menuOpen',
          )}
        >
          <span className="navbar-toggle-icon" aria-hidden="true"></span>
        </button>
        <div
          id="navbar-menu"
          ref={menuRef}
          className={`navbar-menu align-${alignment} ${
            isMenuOpen ? 'is-active' : ''
          }`}
          data-testid="navbar-menu"
        >
          <ul className="navbar-links">
            <li>
              <Link
                to={`/${lang}`}
                onClick={() => setIsMenuOpen(false)}
                aria-current={isCurrentPage('/') ? 'page' : undefined}
              >
                {t('navbar.home')}
              </Link>
            </li>
            <li>
              <Link
                to={`/${lang}/about`}
                onClick={() => setIsMenuOpen(false)}
                aria-current={isCurrentPage('/about') ? 'page' : undefined}
              >
                {t('navbar.about')}
              </Link>
            </li>
            <li>
              <Link
                to={`/${lang}/contact`}
                onClick={() => setIsMenuOpen(false)}
                aria-current={isCurrentPage('/contact') ? 'page' : undefined}
              >
                {t('navbar.contact')}
              </Link>
            </li>
            <li>
              <Link
                to={`/${lang}/api-example`}
                onClick={() => setIsMenuOpen(false)}
                aria-current={
                  isCurrentPage('/api-example') ? 'page' : undefined
                }
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
