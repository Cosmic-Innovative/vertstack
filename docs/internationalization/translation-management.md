# Translation Management

## Overview

The VERT Stack uses a namespace-based translation system that enables:

- Lazy loading translations by page/feature
- Runtime language switching
- Type-safe translation keys
- Built-in error handling

## Key Concepts

### Namespaces

Translations are organized into namespaces:

- `translation`: Common strings used across the app
- `pages/<page>`: Page-specific translations
- `legal`: Legal text and documentation

### Loading Strategy

Translations are loaded:

1. On route change
2. When language changes
3. When specific features are accessed
4. As needed for dynamic content

## Implementation Guide

### 1. Loading Page Translations

```typescript
// Load translations for a specific page
await loadPageTranslations('home', 'en');

// Check loading success
if (!success) {
  logger.error('Failed to load translations');
}
```

### 2. Component Integration

Basic component with translations:

```typescript
const WelcomeMessage: React.FC = () => {
  const { t } = useTranslation('home');
  return <h1>{t('welcome.title')}</h1>;
};
```

Component with dynamic loading:

```typescript
const PageComponent: React.FC = () => {
  const { t } = useTranslation('home');
  const [isLoading, setIsLoading] = useState(true);
  const { lang } = useParams<{ lang: string }>();

  useEffect(() => {
    let mounted = true;

    const loadTranslations = async () => {
      setIsLoading(true);
      await loadPageTranslations('home', lang);
      if (mounted) setIsLoading(false);
    };

    loadTranslations();
    return () => {
      mounted = false;
    };
  }, [lang]);

  if (isLoading) return <LoadingSpinner />;

  return <div>{t('content')}</div>;
};
```

## Translation Organization

### File Structure

```plaintext
src/locales/
├── en.json              # Common English strings
├── es.json              # Common Spanish strings
├── pages/               # Page translations
│   ├── en/
│   │   ├── home.json
│   │   └── about.json
│   └── es/
│       ├── home.json
│       └── about.json
└── legal/              # Legal translations
    ├── en.json
    └── es.json
```

### Translation Files

Common translations (`en.json`):

```json
{
  "general": {
    "loading": "Loading...",
    "error": "An error occurred",
    "retry": "Try Again"
  },
  "navigation": {
    "home": "Home",
    "about": "About"
  }
}
```

Page translations (`pages/en/home.json`):

```json
{
  "home": {
    "welcome": {
      "title": "Welcome",
      "subtitle": "Start your journey"
    },
    "features": {
      "title": "Features",
      "list": {
        "dev": "Fast Development",
        "type": "Type Safety"
      }
    }
  }
}
```

## Best Practices

### 1. Translation Keys

DO:

- Use descriptive, hierarchical keys
- Group related translations
- Keep keys consistent across languages

```json
{
  "checkout": {
    "steps": {
      "shipping": "Shipping",
      "payment": "Payment"
    }
  }
}
```

DON'T:

- Use flat keys
- Mix naming conventions
- Duplicate translations

```json
{
  "checkoutShipping": "Shipping",
  "checkout_payment": "Payment",
  "shipping_step": "Shipping" // Duplicate
}
```

### 2. Loading Management

DO:

- Show loading states
- Handle errors gracefully
- Clean up on unmount
- Cache loaded translations

DON'T:

- Load all translations upfront
- Ignore loading errors
- Leave memory leaks
- Reload unnecessarily

### 3. Default Values

DO:

- Provide fallback text
- Use key hierarchy for defaults
- Document fallback behavior

```typescript
// Fallback chain example
t('feature.title', 'Feature'); // Key, default
t(['feature.title', 'common.title']); // Key array
```

## Testing

Test files should verify both content and loading behavior:

```typescript
describe('PageComponent', () => {
  it('shows loading state while translations load', async () => {
    render(<PageComponent />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays translated content', async () => {
    render(<PageComponent />);
    await waitFor(() => {
      expect(screen.getByText('Welcome')).toBeInTheDocument();
    });
  });
});
```

## Troubleshooting

Common issues and solutions:

1. **Missing Translations**

   - Verify namespace is loaded
   - Check translation key exists
   - Ensure language file is present

2. **Loading Errors**

   - Check network requests
   - Verify file structure
   - Check console for errors

3. **Performance Issues**
   - Review loading strategy
   - Check bundle size
   - Monitor loading times

## Related Documentation

- [Formatting](./formatting.md)
- [Language Switching](./language-switching.md)
- [Performance Monitoring](../core-features/performance-monitoring.md)
