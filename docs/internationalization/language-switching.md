# Language Switching Guide

## Overview

The VERT Stack implements language switching with:

- Route-based language selection
- Accessible language picker component
- SEO-optimized language handling
- Persistent language preferences

## Key Concepts

### Route-Based Languages

- Language codes in URL paths (`/en/`, `/es/`)
- Automatic language detection
- Default language fallback
- Clean URL structure

### Language State

- URL-synchronized language
- HTML lang attribute updates
- Translation loading
- SEO metadata management

## Implementation Guide

### 1. Basic Language Switch

```typescript
// Simple language change
const changeLang = async (newLang: string) => {
  const success = await changeLanguage(newLang);
  if (success) {
    navigate(`/${newLang}${currentPath}`);
  }
};
```

### 2. Component Integration

Basic language menu:

```typescript
const LanguageMenu: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.language}
      onChange={(e) => changeLang(e.target.value)}
      aria-label="Select language"
    >
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  );
};
```

## Best Practices

### 1. URL Management

DO:

- Use consistent language prefixes
- Handle URL parameters correctly
- Maintain clean URLs
- Preserve navigation state

```typescript
// Good URL handling
const newPath = `/${lang}${pathname.substring(3)}`;
navigate(newPath, {
  replace: true,
  state: currentState,
});
```

DON'T:

- Mix language prefix styles
- Lose URL parameters
- Create duplicate history entries
- Ignore current route state

### 2. Language Selection

DO:

- Persist language preferences
- Show language in native script
- Provide clear language options
- Update HTML lang attribute

```typescript
// Good language selection
const switchLanguage = async (lang: string) => {
  // Update URL
  const newPath = updatePathLanguage(location.pathname, lang);

  // Change language
  const success = await changeLanguage(lang);
  if (success) {
    // Update document lang
    document.documentElement.lang = lang;
    // Navigate
    navigate(newPath);
    // Persist preference
    localStorage.setItem('preferredLanguage', lang);
  }
};
```

### 3. Accessibility

DO:

- Use proper ARIA attributes
- Manage focus correctly
- Support keyboard navigation
- Announce language changes

```typescript
// Accessible language switcher
<button
  ref={buttonRef}
  onClick={() => setIsOpen(true)}
  aria-expanded={isOpen}
  aria-haspopup="listbox"
  aria-label={t('accessibility.selectLanguage')}
>
  {currentLanguage.nativeName}
</button>
```

## Language Detection

### Auto-Detection

```typescript
const detectUserLanguage = (): string => {
  // Check URL first
  const urlLang = parseUrlLanguage();
  if (isValidLanguage(urlLang)) return urlLang;

  // Check stored preference
  const storedLang = localStorage.getItem('preferredLanguage');
  if (isValidLanguage(storedLang)) return storedLang;

  // Check browser language
  const browserLang = navigator.language.split('-')[0];
  if (isValidLanguage(browserLang)) return browserLang;

  // Fall back to default
  return 'en';
};
```

### Route Integration

```typescript
const App: React.FC = () => {
  return (
    <Routes>
      {/* Language routes */}
      <Route path="/:lang/*" element={<LanguageRouter />} />
      {/* Default redirect */}
      <Route
        path="/"
        element={<Navigate to={`/${detectUserLanguage()}`} replace />}
      />
    </Routes>
  );
};
```

## SEO Optimization

### Language Meta Tags

```typescript
const LanguageMeta: React.FC = () => {
  const { i18n } = useTranslation();
  const location = useLocation();

  return (
    <Helmet>
      <html lang={i18n.language} />
      {SUPPORTED_LANGUAGES.map((lang) => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={`${BASE_URL}/${lang}${location.pathname}`}
        />
      ))}
    </Helmet>
  );
};
```

## Testing

### Language Switching Tests

```typescript
describe('LanguageSwitcher', () => {
  it('changes language correctly', async () => {
    const { changeLanguage } = render(<LanguageSwitcher />, { route: '/en' });

    // Initial state
    expect(screen.getByText('English')).toBeInTheDocument();

    // Change language
    await changeLanguage('es');

    // Verify changes
    expect(screen.getByText('Español')).toBeInTheDocument();
    expect(window.location.pathname).toMatch(/^\/es/);
  });

  it('maintains accessibility during language switch', async () => {
    render(<LanguageSwitcher />, { route: '/en' });

    const button = screen.getByRole('button');

    // Open menu
    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');

    // Verify focus management
    const options = screen.getAllByRole('option');
    expect(document.activeElement).toBe(options[0]);
  });
});
```

## Troubleshooting

### Common Issues

1. **Lost URL Parameters**

   - Problem: Query parameters disappear after language switch
   - Solution: Preserve URL parameters during navigation
   - Prevention: Use URL utility functions

2. **Translation Loading Delays**

   - Problem: Content flashes during language switch
   - Solution: Implement loading states
   - Prevention: Preload common translations

3. **Focus Management**
   - Problem: Focus lost after language switch
   - Solution: Implement proper focus management
   - Prevention: Test with keyboard navigation

## Related Documentation

- [Translation Management](./translation-management.md)
- [Formatting](./formatting.md)
- [SEO Guide](../core-features/seo.md)
- [Accessibility Guide](../development/accessibility.md)
