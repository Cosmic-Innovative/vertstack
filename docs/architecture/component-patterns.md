# Component Patterns

## Overview

The VERT Stack uses consistent patterns for React components that emphasize:

- Type safety
- Accessibility
- Internationalization
- Error handling
- Performance

## Base Component Pattern

```typescript
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { loadPageTranslations } from '../utils/i18n/page-loader';

interface ComponentProps {
  // Type-safe props definition
}

const Component: React.FC<ComponentProps> = ({ prop }) => {
  const { t } = useTranslation('namespace');
  const { lang } = useParams<{ lang: string }>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeTranslations = async () => {
      if (lang) {
        setIsLoading(true);
        await loadPageTranslations('namespace', lang);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeTranslations();

    return () => {
      mounted = false;
    };
  }, [lang]);

  if (isLoading) {
    return (
      <div className="loading-container" role="status" aria-live="polite">
        {t('general:loading')}
      </div>
    );
  }

  return (
    <article role="main" aria-labelledby="component-title">
      {/* Component content */}
    </article>
  );
};

export default Component;
```

## Common Component Types

### Page Components

Page components handle routing and translation loading:

```typescript
// Example from Home.tsx
const Home: React.FC = () => {
  const { t } = useTranslation('home');
  const { lang } = useParams<{ lang: string }>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeTranslations = async () => {
      if (lang) {
        setIsLoading(true);
        await loadPageTranslations('home', lang);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeTranslations();

    return () => {
      mounted = false;
    };
  }, [lang]);

  return (
    <article role="main" aria-labelledby="home-title">
      <div className="hero-section">
        <OptimizedHeroImage
          desktopSrc="/desktop-hero.svg"
          mobileSrc="/mobile-hero.svg"
          alt={t('heroAlt')}
          priority={true}
        />
      </div>
      {/* Rest of component */}
    </article>
  );
};
```

### UI Components

Reusable UI components focus on presentation and user interaction:

```typescript
// Example from LanguageSwitcher.tsx
interface LanguageSwitcherProps {
  className?: string;
  popupDirection?: 'up' | 'down';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  popupDirection = 'down',
}) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Implementation...
};
```

### Error Boundaries

Error boundaries provide fallback UI and error reporting:

```typescript
// Example from ErrorBoundary.tsx
interface Props extends WithTranslation {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

class ErrorBoundary extends Component<Props, State> {
  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('Uncaught error in component', {
      error,
      errorInfo,
      componentStack: errorInfo.componentStack,
      location: window.location.href,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  // Implementation...
}
```

## Testing Patterns

Components are tested using React Testing Library:

```typescript
// Example from LanguageSwitcher.test.tsx
describe('LanguageSwitcher', () => {
  it('renders with proper document structure', async () => {
    await render(<LanguageSwitcher />, { route: '/en' });

    const switcher = screen.getByTestId('language-switcher');
    expect(switcher).toHaveAttribute('data-direction', 'up');
    expect(switcher).toHaveAttribute(
      'aria-label',
      await expectTranslated('footer.languageSelectorLabel', 'en'),
    );
  });

  // More tests...
});
```

## Performance Patterns

### Optimized Images

```typescript
// Example from OptimizedHeroImage.tsx
const OptimizedHeroImage: React.FC<OptimizedHeroImageProps> = ({
  desktopSrc,
  mobileSrc,
  alt,
  priority = false,
}) => {
  useEffect(() => {
    if (priority) {
      initMobilePerformanceTracking();
      reportMobileVitals();
    }
  }, [priority]);

  // Implementation...
};
```

### Lazy Loading

```typescript
// Example from App.tsx
const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));
```

## Accessibility Patterns

### ARIA Attributes

```typescript
// Example from Navbar.tsx
<nav
  className="navbar"
  role="navigation"
  aria-label={t('accessibility.mainNavigation')}
>
  <button
    className="navbar-toggle"
    onClick={toggleMenu}
    aria-expanded={isMenuOpen}
    aria-controls="navbar-menu"
    aria-label={t(
      isMenuOpen ? 'accessibility.menuClose' : 'accessibility.menuOpen',
    )}
  >
    {/* Button content */}
  </button>
</nav>
```

### Skip Links

```typescript
// Example from App.tsx
<a href="#main-content" className="skip-to-main">
  {t('general.skipToContent')}
</a>
```

## SEO Patterns

```typescript
// Example from TitleComponent.tsx
return (
  <Helmet>
    <html lang={i18n.language.split('-')[0]} />
    <title>{error ? appName : fullTitle}</title>
    <meta name="description" content={description} />
    {alternateLinks.map(({ hrefLang, href }) => (
      <link key={hrefLang} rel="alternate" hrefLang={hrefLang} href={href} />
    ))}
  </Helmet>
);
```

## Best Practices

1. **Type Safety**

   - Use TypeScript interfaces for props
   - Define explicit return types
   - Avoid type assertions
   - Use strict type checking

2. **State Management**

   - Use hooks for local state
   - Clean up side effects
   - Handle loading states
   - Prevent memory leaks

3. **Error Handling**

   - Use error boundaries
   - Log errors appropriately
   - Provide fallback UI
   - Handle async errors

4. **Accessibility**

   - Include ARIA attributes
   - Support keyboard navigation
   - Provide alternative text
   - Test with screen readers

5. **Internationalization**
   - Load translations properly
   - Handle loading states
   - Support language switching
   - Include language metadata

## Related Documentation

- [Error Handling](../core-features/error-handling.md)
- [Internationalization](../core-features/internationalization.md)
- [Accessibility Guidelines](../development/accessibility.md)
- [Testing Guidelines](../development/testing-guidelines.md)
