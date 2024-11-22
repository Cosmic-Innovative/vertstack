# Project Structure

This guide explains the organization and key components of a VERT Stack application.

## Directory Structure

```
vertstack/
│
├── .github/                      # GitHub Actions and CI/CD configuration
│   └── workflows/
│       ├── pr_checks.yml        # Pull request validation
│       ├── deploy.yml           # Deployment pipeline
│       └── lighthouse.yml       # Performance and quality checks
│
├── .husky/                      # Git hooks
│   └── pre-commit              # Pre-commit checks
│
├── public/                      # Static assets
│   ├── vertstack.svg           # Logo/favicon
│   ├── pwa-192x192.png        # PWA icons
│   ├── pwa-512x512.png
│   └── 404.svg                # Error page illustration
│
├── src/
│   ├── components/             # React components
│   │   ├── ErrorBoundary.tsx  # Error handling component
│   │   ├── ErrorBoundary.test.tsx
│   │   ├── Footer.tsx         # Layout component
│   │   ├── Footer.test.tsx
│   │   ├── Navbar.tsx
│   │   ├── Navbar.test.tsx
│   │   ├── LazyImage.tsx      # Utility component
│   │   ├── LanguageSwitcher.tsx
│   │   ├── LanguageSwitcher.test.tsx
│   │   ├── UserList.tsx       # Feature component
│   │   └── UserList.test.tsx
│   │
│   ├── styles/                 # CSS and style files
│   │   ├── index.css          # Global styles and Tailwind configuration
│   │   ├── Footer.css
│   │   ├── LanguageSwitcher.css
│   │   └── Navbar.css
│   │
│   ├── utils/                  # Utility functions and helpers
│   │   ├── i18n/              # Internationalization utilities
│   │   │   ├── legal-loader.ts
│   │   │   ├── page-loader.ts
│   │   │   └── types.ts
│   │   ├── api.ts             # API interaction utilities
│   │   ├── logger.ts          # Logging system
│   │   ├── performance-utils.ts
│   │   └── sitemapGenerator.ts
│   │
│   ├── locales/               # Internationalization resources
│   │   ├── legal/            # Legal text translations
│   │   │   ├── en.json
│   │   │   └── es.json
│   │   ├── pages/            # Page-specific translations
│   │   │   ├── en/          # English page translations
│   │   │   │   ├── home.json
│   │   │   │   ├── about.json
│   │   │   │   └── ...
│   │   │   └── es/          # Spanish page translations
│   │   │       ├── home.json
│   │   │       ├── about.json
│   │   │       └── ...
│   │   ├── en.json          # Common English translations
│   │   └── es.json          # Common Spanish translations
│   │
│   ├── App.tsx                # Root application component
│   ├── App.test.tsx
│   ├── i18n.ts               # i18n configuration
│   ├── i18n.test.tsx
│   ├── i18n.mock.ts         # Testing utilities
│   ├── main.tsx             # Application entry point
│   └── pwa.ts               # PWA registration and setup
│
└── Configuration Files
    ├── eslint.config.js       # ESLint configuration
    ├── lighthouserc.json      # Lighthouse CI settings
    ├── postcss.config.js      # PostCSS configuration
    ├── tailwind.config.js     # Tailwind CSS configuration
    ├── tsconfig.json          # TypeScript configuration
    └── vite.config.ts         # Vite bundler configuration
```

## Component Organization

We follow a pragmatic approach to component organization:

### Current Structure

Components are organized as flat files in the components directory, with each component having its implementation and test file:

```typescript
// Example: ErrorBoundary component
/components/
├── ErrorBoundary.tsx              // Component implementation
└── ErrorBoundary.test.tsx         // Component tests
```

### When to Consider Component Folders

While our current components are well-served by a flat structure, more complex components may benefit from a folder-based organization when they have:

```typescript
// Example: Complex component structure
/components/ComplexFeature/
├── index.ts                       // Public exports
├── ComplexFeature.tsx             // Main component
├── ComplexFeature.test.tsx        // Tests
├── ComplexFeature.types.ts        // Type definitions
├── ComplexFeature.css             // Component styles
├── SubComponent.tsx               // Related components
└── utils.ts                       // Component-specific utilities
```

Consider creating a component folder when you have:

- Multiple related sub-components
- Component-specific utilities or hooks
- Component-specific types
- Component styles
- Multiple test files
- Storybook stories

## Key Directories Explained

### `/src/components`

Components follow these patterns:

- Colocated test files
- Clear naming conventions
- TypeScript interfaces and types
- Comprehensive test coverage
- CSS modules when needed

Example component:

```typescript
// ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { logger } from '../utils/logger';

interface Props extends WithTranslation {
  children: ReactNode;
  fallback?: ReactNode;
}

class ErrorBoundary extends Component<Props> {
  // Implementation
}

export default withTranslation()(ErrorBoundary);
```

### `/src/styles`

CSS organization:

- Global styles in index.css
- Component-specific styles in separate files
- Tailwind utility classes
- CSS modules for scoped styles

Example:

```css
/* Navbar.css */
.navbar {
  background-color: var(--secondary-color);
  padding: 0.75rem;
  touch-action: pan-y pinch-zoom;
}
```

### `/src/utils`

Utility functions follow these patterns:

- Type-safe implementations
- Comprehensive error handling
- Clear documentation
- Thorough testing

Example:

```typescript
// api.ts
export async function fetchData<T>(url: string): Promise<T> {
  // Implementation with error handling and type safety
}
```

## Best Practices

### Component Development

1. Keep components focused and single-purpose
2. Use TypeScript interfaces for props
3. Include comprehensive tests
4. Add proper accessibility attributes
5. Include error boundaries where needed

### Code Organization

1. Group related files logically
2. Use clear, consistent naming
3. Keep files focused and manageable
4. Consider colocating related code
5. Use TypeScript for type safety

### Testing Strategy

1. Colocate test files with components
2. Use meaningful test descriptions
3. Test user interactions
4. Include error cases
5. Maintain high coverage

## Related Documentation

- [Bundle Analysis](../development/bundle-analysis.md)
- [Logging System](../core-features/logging.md)
- [Testing Guide](../development/testing-guidelines.md)
- [Contributing Guidelines](../development/contributing.md)
