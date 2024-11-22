# Code Style Guide

## Overview

The VERT Stack enforces consistent code style through ESLint, TypeScript, and Prettier configurations. This guide documents our coding standards and best practices.

## TypeScript Guidelines

### Type Declarations

```typescript
// DO: Use explicit types for component props
interface ComponentProps {
  title: string;
  onAction: (id: string) => void;
  items?: ReadonlyArray<Item>;
}

// DON'T: Use implicit any or loose types
const Component = (props) => { ... }
```

### Type Safety

```typescript
// DO: Use strict type checking
const getValue = <T>(obj: Record<string, T>, key: string): T | undefined => {
  return obj[key];
};

// DON'T: Use type assertions without validation
const value = obj[key] as string;
```

### Null Handling

```typescript
// DO: Use optional chaining and nullish coalescing
const value = data?.items?.[0] ?? defaultValue;

// DON'T: Use unsafe null checks
const value = (data && data.items && data.items[0]) || defaultValue;
```

## React Patterns

### Component Structure

```typescript
// DO: Use functional components with explicit typing
const MyComponent: React.FC<MyComponentProps> = ({ prop1, prop2 }) => {
  // Implementation
};

// DON'T: Use untyped components or class components (unless needed)
function MyComponent(props) {
  // Implementation
}
```

### Hooks Usage

```typescript
// DO: Follow hooks rules and naming conventions
const useCustomHook = (id: string): Result => {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    // Effect implementation
  }, [id]);

  return data;
};

// DON'T: Break hooks rules or use inconsistent naming
const customHook = (id) => {
  if (condition) {
    useState(); // Breaking rules of hooks
  }
};
```

### Event Handlers

```typescript
// DO: Use proper event typing and naming
const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
  // Handler implementation
};

// DON'T: Use loose event typing or unclear naming
const click = (e) => {
  // Handler implementation
};
```

## File Organization

```typescript
// Example: SimpleComponent
/components/
├── SimpleComponent.tsx // Component implementation
└── SimpleComponent.test.tsx // Component tests

// Example: Complex Component
ComplexComponentName/
├── index.ts           // Public exports
├── ComplexComponentName.tsx  // Main component
├── ComplexComponentName.test.tsx
├── ComplexComponentName.css  // If not using CSS-in-JS
└── types.ts          // Component-specific types

```

### Import Order

```typescript
// 1. External dependencies
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// 2. Internal utilities and types
import { logger } from '../utils/logger';
import type { ComponentProps } from './types';

// 3. Component imports
import SubComponent from './SubComponent';

// 4. Style imports
import './ComponentName.css';
```

## Code Formatting

### Prettier Configuration

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 80,
  "tabWidth": 2,
  "semi": true
}
```

### ESLint Rules

We enforce several key ESLint rules:

- `@typescript-eslint/no-explicit-any`
- `@typescript-eslint/no-unused-vars`
- `react-hooks/rules-of-hooks`
- `react-hooks/exhaustive-deps`

## Testing Conventions

### Test Structure

```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup
  });

  it('renders with proper document structure', async () => {
    await render(<ComponentName />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('handles user interactions correctly', async () => {
    // User interaction test
  });
});
```

### Testing Best Practices

Use React Testing Library queries in this order:

1. `getByRole`
2. `getByLabelText`
3. `getByPlaceholderText`
4. `getByText`
5. `getByDisplayValue`
6. `getByTestId`

## Accessibility Standards

### ARIA Attributes

```typescript
// DO: Use proper ARIA attributes
<button
  aria-label={t('accessibility.menuToggle')}
  aria-expanded={isOpen}
  aria-controls="menu-content"
>
  {children}
</button>

// DON'T: Omit necessary ARIA attributes
<button onClick={toggle}>
  {children}
</button>
```

### Semantic HTML

```typescript
// DO: Use semantic HTML elements
<article role="main" aria-labelledby="title">
  <h1 id="title">{title}</h1>
  <section aria-label="content">
    {content}
  </section>
</article>

// DON'T: Use divs for everything
<div class="article">
  <div class="title">{title}</div>
  <div class="content">{content}</div>
</div>
```

## Internationalization

### Translation Keys

```typescript
// DO: Use structured translation keys
const title = t('componentName.section.title');

// DON'T: Use flat or unstructured keys
const title = t('component_title');
```

### Translation Loading

```typescript
// DO: Load translations properly
useEffect(() => {
  let mounted = true;

  const loadTranslations = async () => {
    if (lang) {
      setIsLoading(true);
      await loadPageTranslations('namespace', lang);
      if (mounted) {
        setIsLoading(false);
      }
    }
  };

  loadTranslations();

  return () => {
    mounted = false;
  };
}, [lang]);
```

## Performance Guidelines

### React Performance

```typescript
// DO: Memoize callbacks and values appropriately
const memoizedCallback = useCallback(() => {
  // Callback implementation
}, [dependency]);

// DON'T: Create new functions in every render
<button onClick={() => handleClick(id)}>{label}</button>;
```

### Code Splitting

```typescript
// DO: Use dynamic imports for route components
const About = lazy(() => import('./components/About'));

// DON'T: Import all components statically
import About from './components/About';
```

## Security Best Practices

### Input Sanitization

```typescript
// DO: Sanitize user input
const sanitizedInput = sanitizeInput(userInput);

// DON'T: Use unsanitized input
const html = userInput;
```

### API Calls

```typescript
// DO: Use type-safe API utilities
const data = await fetchData<ResponseType>(endpoint);

// DON'T: Use bare fetch calls
const data = await fetch(endpoint).then((r) => r.json());
```

## Documentation

### Component Documentation

```typescript
/**
 * A component that displays user information.
 *
 * @param props - The component props
 * @param props.userId - The ID of the user to display
 * @param props.showDetails - Whether to show detailed information
 * @returns A React component displaying user information
 */
const UserInfo: React.FC<UserInfoProps> = ({ userId, showDetails }) => {
  // Implementation
};
```

### Code Comments

```typescript
// DO: Write meaningful comments for complex logic
// Calculate the exponential moving average with a decay factor
const calculateEMA = (values: number[], alpha: number): number => {
  // Implementation
};

// DON'T: Write obvious comments
// Set the name variable
const name = 'John';
```

## Related Documentation

- [Performance Monitoring](../core-features/performance-monitoring.md)
- [Build Configuration](./build-configuration.md)
- [CI/CD Integration](../deployment/ci-cd.md)
