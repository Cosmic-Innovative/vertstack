# Internationalization (i18n)

## Overview

The VERT Stack provides comprehensive internationalization features that enable:

- Dynamic language switching
- Lazy-loaded translations
- Route-based language selection
- Locale-aware formatting
- Full SEO optimization
- Strong accessibility features

## Quick Start

```typescript
// Load translations for a page
await loadPageTranslations('home', 'en');

// Use translations in a component
const WelcomePage: React.FC = () => {
  const { t } = useTranslation('home');
  return <h1>{t('welcome.title')}</h1>;
};
```

## Key Features

### 1. Translation Management

- Namespace-based organization
- Dynamic loading by feature
- Type-safe translation keys
- Error handling and fallbacks

### 2. Language Switching

- Route-based language selection (`/en/`, `/es/`)
- Persistent language preferences
- SEO-optimized URLs
- Accessible language picker

### 3. Formatting

- Number and currency localization
- Date and time formatting
- List and plural handling
- Unit conversions

## Project Structure

```plaintext
src/locales/
├── en.json           # Common English translations
├── es.json           # Common Spanish translations
├── legal/            # Legal text translations
│   ├── en.json
│   └── es.json
└── pages/            # Page-specific translations
    ├── en/
    │   ├── home.json
    │   └── about.json
    └── es/
        ├── home.json
        └── about.json
```

## Setup Guide

### 1. Initialize Translations

```typescript
// Add a new page namespace
await loadPageTranslations('about', 'en');

// Add translation files
// pages/en/about.json
{
  "about": {
    "title": "About Us",
    "description": "Our story..."
  }
}
```

### 2. Implement Language Switching

```typescript
// Add language routes
<Routes>
  <Route path="/:lang/*" element={<AppContent />} />
  <Route path="/" element={<Navigate to="/en" replace />} />
</Routes>

// Add language switcher
<LanguageSwitcher
  direction="up"
  className="nav-item"
/>
```

### 3. Use Formatting

```typescript
const ProductPrice: React.FC<{ price: number }> = ({ price }) => {
  const { i18n } = useTranslation();
  return (
    <span className="price">{formatCurrency(price, i18n.language, 'USD')}</span>
  );
};
```

## Best Practices

### 1. Translation Management

- Organize by feature/page
- Use clear key hierarchies
- Provide fallback text
- Handle loading states

### 2. Language Selection

- Persist preferences
- Maintain URL cleanliness
- Support keyboard navigation
- Announce changes

### 3. Component Design

- Separate translation logic
- Handle loading states
- Support RTL languages
- Test all locales

## Common Patterns

### Loading Management

```typescript
const FeatureComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { lang } = useParams<{ lang: string }>();

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      setIsLoading(true);
      await loadPageTranslations('feature', lang);
      if (mounted) setIsLoading(false);
    };

    init();
    return () => {
      mounted = false;
    };
  }, [lang]);

  if (isLoading) return <LoadingState />;

  return <Content />;
};
```

### SEO Integration

```typescript
const LanguageMeta: React.FC = () => (
  <Helmet>
    <html lang={i18n.language} />
    {alternateLinks.map(({ lang, url }) => (
      <link key={lang} rel="alternate" hrefLang={lang} href={url} />
    ))}
  </Helmet>
);
```

## Testing Guide

### Translation Testing

```typescript
it('displays translated content', async () => {
  render(<Component />, { route: '/en' });

  expect(await screen.findByText('Welcome')).toBeInTheDocument();

  await changeLanguage('es');

  expect(await screen.findByText('Bienvenido')).toBeInTheDocument();
});
```

### Language Switch Testing

```typescript
it('handles language changes', async () => {
  const { changeLanguage } = render(<App />, { route: '/en' });

  await changeLanguage('es');

  expect(window.location.pathname).toMatch(/^\/es/);
  expect(document.documentElement.lang).toBe('es');
});
```

## Detailed Documentation

- [Translation Management](./translation-management.md)
- [Formatting Guide](./formatting.md)
- [Language Switching](./language-switching.md)

## Related Guides

- [SEO Guide](../core-features/seo.md)
- [Accessibility](../development/accessibility.md)
- [Testing Guide](../core-features/testing.md)
