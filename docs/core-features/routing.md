# Routing Guide

## Overview

The VERT Stack implements type-safe routing with:

- Internationalized route handling
- Code-splitting through lazy loading
- SEO-friendly URLs
- Type-safe route parameters
- Accessibility-focused navigation

## Quick Start

```typescript
// App.tsx
const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/:lang/*" element={<AppContent />} />
      <Route path="/" element={<Navigate to="/en" replace />} />
    </Routes>
  </Router>
);

// Lazy-loaded routes
const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));
```

## Key Features

### 1. Language-Aware Routes

```typescript
interface LanguageRouteProps {
  component: React.ComponentType;
  useRouter: boolean;
}

const LanguageRoute: React.FC<LanguageRouteProps> = ({
  component: Component,
  useRouter,
}) => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (useRouter && lang && supportedLanguages.includes(lang)) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n, useRouter]);

  if (!useRouter || !lang || !supportedLanguages.includes(lang)) {
    return <Navigate to={`/${i18n.language}`} replace />;
  }

  return <Component />;
};
```

### 2. Type-Safe Route Parameters

```typescript
// Route types
interface RouteParams {
  lang: string;
  id?: string;
  category?: string;
}

// Type-safe parameter usage
const { lang, id } = useParams<keyof RouteParams>();

// Type-safe navigation
const navigate = useNavigate();
navigate(`/${lang}/products/${id}`);
```

### 3. Route Loading States

```typescript
const AppContent: React.FC = () => (
  <Suspense
    fallback={
      <div className="loading-container" role="status" aria-live="polite">
        {t('general.loading')}
      </div>
    }
  >
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  </Suspense>
);
```

## Implementation Guide

### 1. Route Configuration

```typescript
// Route definitions
const routes = {
  home: '/',
  about: '/about',
  contact: '/contact',
  product: '/products/:id',
  category: '/products/category/:category',
} as const;

// Type-safe route generation
const generateRoute = (
  route: keyof typeof routes,
  params: RouteParams = {},
): string => {
  const { lang, ...routeParams } = params;
  let path = routes[route];

  // Replace parameters
  Object.entries(routeParams).forEach(([key, value]) => {
    path = path.replace(`:${key}`, value);
  });

  return `/${lang}${path}`;
};
```

### 2. Navigation Components

```typescript
const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({
  to,
  children,
}) => {
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();

  const isActive = location.pathname === `/${lang}${to}`;

  return (
    <Link
      to={`/${lang}${to}`}
      className={isActive ? 'nav-link active' : 'nav-link'}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
};
```

### 3. Route Guards

```typescript
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({
  element,
}) => {
  const isAuthenticated = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};
```

## Best Practices

### 1. Route Organization

DO:

```typescript
// Clear route hierarchy
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />
    <Route path="products">
      <Route index element={<Products />} />
      <Route path=":id" element={<ProductDetails />} />
    </Route>
  </Route>
</Routes>
```

DON'T:

```typescript
// Flat, unorganized routes
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/products" element={<Products />} />
  <Route path="/products/:id" element={<ProductDetails />} />
</Routes>
```

### 2. Navigation

DO:

```typescript
// Type-safe navigation
const navigate = useNavigate();
navigate(generateRoute('product', { lang, id }));
```

DON'T:

```typescript
// String concatenation
navigate(`/${lang}/products/${id}`);
```

### 3. Loading States

DO:

```typescript
<Suspense fallback={<LoadingSpinner aria-label={t('loading.products')} />}>
  <Route path="/products" element={<Products />} />
</Suspense>
```

DON'T:

```typescript
<Suspense fallback={<div>Loading...</div>}>
  <Route path="/products" element={<Products />} />
</Suspense>
```

## Testing

```typescript
describe('Routing', () => {
  it('handles language routes correctly', async () => {
    render(
      <MemoryRouter initialEntries={['/en/about']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading')).toHaveTextContent(
      await expectTranslated('about:title', 'en'),
    );
  });

  it('redirects invalid languages to default', async () => {
    render(
      <MemoryRouter initialEntries={['/invalid/about']}>
        <App />
      </MemoryRouter>,
    );

    expect(window.location.pathname).toBe('/en/about');
  });

  it('preserves query parameters during language switch', async () => {
    const { changeLanguage } = render(
      <MemoryRouter initialEntries={['/en/products?category=new']}>
        <App />
      </MemoryRouter>,
    );

    await changeLanguage('es');

    expect(window.location.search).toBe('?category=new');
  });
});
```

## Troubleshooting

### Common Issues

1. **Route Not Matching**

```typescript
// Check exact paths
<Route path="/about" element={<About />} /> // Exact match
<Route path="about/*" element={<About />} /> // Nested routes
```

2. **Lost Parameters**

```typescript
// Preserve query params during navigation
const { search } = useLocation();
navigate(`/${newLang}${pathname}${search}`);
```

3. **Loading Flash**

```typescript
// Preload common routes
const preloadRoutes = () => {
  const routes = [About, Contact];
  routes.forEach((route) => {
    const preloadRoute = route as unknown as { preload: () => Promise<void> };
    preloadRoute.preload?.();
  });
};
```

## Related Documentation

- [Internationalization](../internationalization/README.md)
- [SEO Guide](./seo.md)
- [Performance Monitoring](./performance-monitoring.md)
