# SEO Guide

## Overview

The VERT Stack provides comprehensive SEO features including:

- Dynamic meta tag management
- Structured data support
- Multilingual SEO optimization
- Dynamic sitemap generation
- Search engine submission tools
- Performance optimization for SEO

## Quick Start

```typescript
// Basic meta tags setup
const PageComponent: React.FC = () => (
  <>
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />
    </Helmet>
    <Content />
  </>
);
```

## Key Features

### 1. Meta Tag Management

```typescript
const TitleComponent: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  return (
    <Helmet>
      <html lang={i18n.language.split('-')[0]} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* Language alternates */}
      {alternateLinks.map(({ hrefLang, href }) => (
        <link key={hrefLang} rel="alternate" hrefLang={hrefLang} href={href} />
      ))}
    </Helmet>
  );
};
```

### 2. Sitemap Generation

```typescript
export async function generateSitemap(): Promise<string> {
  const links = pages.flatMap((page) =>
    languages.map((lang) => ({
      loc: `${baseUrl}/${lang}${page.url}`,
      changefreq: page.changefreq,
      priority: page.priority,
      'xhtml:link': languages.map((l) => ({
        rel: 'alternate',
        hreflang: l,
        href: `${baseUrl}/${l}${page.url}`,
      })),
    })),
  );

  return generateSitemapXML(links);
}
```

### 3. Structured Data

```typescript
// Product schema example
const ProductSchema: React.FC<ProductProps> = ({ product }) => (
  <script type="application/ld+json">
    {JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      price: product.price,
      currency: 'USD',
    })}
  </script>
);
```

## Implementation Guide

### 1. Basic SEO Setup

```typescript
// Page component with SEO
const Page: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const pageMetadata = {
    title: t('page.title'),
    description: t('page.description'),
    url: `${baseUrl}${location.pathname}`,
    image: `${baseUrl}/images/page-image.jpg`,
  };

  return (
    <>
      <SEOHead {...pageMetadata} />
      <main>{/* Page content */}</main>
    </>
  );
};
```

### 2. Multilingual SEO

```typescript
// Language metadata component
const LanguageMeta: React.FC = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const currentPath = location.pathname.replace(/^\/[a-z]{2}/, '');

  return (
    <Helmet>
      <html lang={i18n.language} />
      {supportedLanguages.map((lang) => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={`${baseUrl}/${lang}${currentPath}`}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrl}/en${currentPath}`}
      />
    </Helmet>
  );
};
```

### 3. Dynamic Routes

```typescript
// Route-based meta tags
const RouteMetaTags: React.FC = () => {
  const { pathname } = useLocation();
  const route = getRouteInfo(pathname);

  return (
    <Helmet>
      <title>{route.title}</title>
      <meta name="description" content={route.description} />
      <link rel="canonical" href={route.canonicalUrl} />
      {route.noindex && <meta name="robots" content="noindex" />}
    </Helmet>
  );
};
```

## Best Practices

### 1. Meta Tags

DO:

```typescript
<Helmet>
  <title>{`${pageTitle} | ${siteName}`}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalUrl} />
</Helmet>
```

DON'T:

```typescript
<Helmet>
  <title>Site Title</title> {/* Static title */}
  <meta name="description" content="Site description" /> {/* Generic description */}
</Helmet>
```

### 2. URL Structure

DO:

```typescript
// Clean URLs with language prefix
/en/cdoprstu / category / item / es / productos / categoria / item;
```

DON'T:

```typescript
// Messy URLs
/page.php?lang=en&category=1&item=2
```

### 3. Image Optimization

DO:

```typescript
<img src={src} alt={alt} width={width} height={height} loading="lazy" />
```

DON'T:

```typescript
<img src={src} /> {/* Missing attributes */}
```

## Testing

```typescript
describe('SEO Components', () => {
  it('renders correct meta tags', () => {
    render(<Page />);

    const title = document.title;
    const description = document.querySelector('meta[name="description"]');
    const canonical = document.querySelector('link[rel="canonical"]');

    expect(title).toBe('Expected Title | Site Name');
    expect(description?.content).toBe('Expected description');
    expect(canonical?.href).toBe('https://example.com/page');
  });

  it('handles language alternates', () => {
    render(<Page />);

    const alternates = document.querySelectorAll('link[rel="alternate"]');
    expect(alternates).toHaveLength(supportedLanguages.length);
  });
});
```

## Monitoring and Validation

### 1. Lighthouse Integration

```json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:seo": ["error", { "minScore": 0.9 }],
        "meta-description": "error",
        "document-title": "error",
        "html-has-lang": "error"
      }
    }
  }
}
```

### 2. SEO Health Checks

```typescript
const checkSEOHealth = (document: Document): SEOReport => {
  return {
    title: Boolean(document.title),
    description: Boolean(document.querySelector('meta[name="description"]')),
    canonical: Boolean(document.querySelector('link[rel="canonical"]')),
    lang: Boolean(document.documentElement.lang),
    structuredData: validateStructuredData(document),
  };
};
```

## Related Documentation

- [Performance Monitoring](./performance-monitoring.md)
- [Internationalization](../internationalization/README.md)
- [Build Configuration](../development/build-configuration.md)
