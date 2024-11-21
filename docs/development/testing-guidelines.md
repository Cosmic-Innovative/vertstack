# Testing Guidelines

## Overview

The VERT Stack uses Vitest for unit and integration testing, with React Testing Library for component testing. Our testing philosophy emphasizes:

- Testing user behavior over implementation details
- Maintaining high coverage of business logic
- Ensuring accessibility in our test assertions
- Supporting internationalization in our tests

## Test Structure

### Component Tests

```typescript
// Example from LanguageSwitcher.test.tsx
describe('LanguageSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with proper document structure', async () => {
    await render(<LanguageSwitcher />, { route: '/en' });

    const switcher = screen.getByTestId('language-switcher');
    expect(switcher).toHaveAttribute('data-direction', 'up');
    expect(switcher).toHaveAttribute(
      'aria-label',
      await expectTranslated('footer.languageSelectorLabel', 'en'),
    );
  });

  it('changes language dynamically', async () => {
    const { changeLanguage } = await render(<LanguageSwitcher />, {
      route: '/en',
    });

    // Test English content
    await waitFor(async () => {
      expect(screen.getByRole('button')).toHaveTextContent(
        await expectTranslated('languageSelector.select', 'en'),
      );
    });

    // Switch to Spanish and verify
    await changeLanguage('es');
    await waitFor(async () => {
      expect(screen.getByRole('button')).toHaveTextContent(
        await expectTranslated('languageSelector.select', 'es'),
      );
    });
  });
});
```

### Utility Tests

```typescript
// Example from api.test.ts
describe('api utilities', () => {
  describe('fetchData', () => {
    it('fetches data successfully', async () => {
      const mockData = { id: 1, name: 'Test' };
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockData)),
      });

      const result = await fetchData('https://api.example.com/data');
      expect(result).toEqual(mockData);
    });

    it('throws an error for non-ok response', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(fetchData('https://api.example.com/data')).rejects.toThrow(
        'HTTP error! status: 404',
      );
    });
  });
});
```

## Testing Patterns

### Component Testing

1. **Render Tests**

```typescript
it('renders with proper document structure', async () => {
  await render(<Component />, { route: '/en' });

  // Test accessibility and structure
  const main = screen.getByRole('main');
  expect(main).toBeInTheDocument();
  expect(main).toHaveAttribute('aria-labelledby', 'component-title');
});
```

2. **User Interaction Tests**

```typescript
it('handles user interactions correctly', async () => {
  await render(<Component />, { route: '/en' });

  // Find and interact with elements
  const button = screen.getByRole('button', { name: /submit/i });
  await userEvent.click(button);

  // Verify results
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});
```

3. **Loading State Tests**

```typescript
it('displays loading state initially', async () => {
  // Mock loading state
  vi.mocked(pageLoader.loadPageTranslations).mockImplementation(
    () => new Promise(() => {}), // Never resolves
  );

  await render(<Component />, { route: '/en' });

  const loadingElement = screen.getByRole('status');
  expect(loadingElement).toHaveTextContent(
    await expectTranslated('general:loading', 'en'),
  );
});
```

### Testing Internationalization

1. **Translation Loading**

```typescript
it('loads page translations', async () => {
  await render(<Component />, { route: '/en' });

  expect(pageLoader.loadPageTranslations).toHaveBeenCalledWith(
    'namespace',
    'en',
  );
});
```

2. **Language Switching**

```typescript
it('changes language dynamically', async () => {
  const { changeLanguage } = await render(<Component />, {
    route: '/en',
  });

  // Test English content
  expect(screen.getByRole('heading')).toHaveTextContent(
    await expectTranslated('namespace:title', 'en'),
  );

  // Switch to Spanish
  await changeLanguage('es');

  // Verify Spanish content
  expect(screen.getByRole('heading')).toHaveTextContent(
    await expectTranslated('namespace:title', 'es'),
  );
});
```

### Testing Error Handling

1. **Error Boundary Tests**

```typescript
it('catches and handles errors', async () => {
  const onError = vi.fn();
  render(
    <ErrorBoundary onError={onError}>
      <ComponentThatThrows />
    </ErrorBoundary>,
  );

  expect(onError).toHaveBeenCalledWith(expect.any(Error), expect.any(Object));
  expect(screen.getByRole('alert')).toBeInTheDocument();
});
```

2. **API Error Tests**

```typescript
it('handles API errors gracefully', async () => {
  const error = new Error('API Error');
  vi.mocked(fetchData).mockRejectedValueOnce(error);

  await render(<Component />, { route: '/en' });

  expect(screen.getByRole('alert')).toHaveTextContent(
    await expectTranslated('errors.fetchError', 'en'),
  );
});
```

## Testing Utilities

### Test Renderer

```typescript
// From test-utils.tsx
export const render = async (
  ui: React.ReactElement,
  { route = '/en', ...renderOptions }: CustomRenderOptions = {},
) => {
  const lang = route.split('/')[1];

  await act(async () => {
    await i18n.changeLanguage(lang);
  });

  const renderResult = rtlRender(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/:lang/*" element={ui} />
        </Routes>
      </MemoryRouter>
    </I18nextProvider>,
    renderOptions,
  );

  return {
    ...renderResult,
    changeLanguage: async (newLang: string) => {
      await act(async () => {
        await i18n.changeLanguage(newLang);
      });
    },
  };
};
```

### Translation Helper

```typescript
export const expectTranslated = async (
  key: string,
  lang: string,
): Promise<string> => {
  await act(async () => {
    await i18n.changeLanguage(lang);
  });
  return i18n.t(key);
};
```

## Best Practices

1. **Query Priority**

   - Prefer queries that reflect how users interact with your app:
     1. `getByRole`
     2. `getByLabelText`
     3. `getByPlaceholderText`
     4. `getByText`
     5. `getByDisplayValue`
     6. `getByTestId` (last resort)

2. **Async Testing**

   ```typescript
   // DO: Use waitFor for async operations
   await waitFor(() => {
     expect(screen.getByRole('heading')).toHaveTextContent('Expected Text');
   });

   // DON'T: Use arbitrary timeouts
   setTimeout(() => {
     expect(element).toBeInTheDocument();
   }, 1000);
   ```

3. **Mocking**

   ```typescript
   // DO: Mock at the closest possible level
   vi.spyOn(pageLoader, 'loadPageTranslations').mockResolvedValue(true);

   // DON'T: Mock entire modules unless necessary
   vi.mock('./utils', () => ({
     // Mocking everything
   }));
   ```

4. **Cleanup**

   ```typescript
   beforeEach(() => {
     vi.clearAllMocks();
   });

   afterEach(() => {
     cleanup();
   });
   ```

## Coverage Requirements

- Maintain >80% coverage across:
  - Statements
  - Branches
  - Functions
  - Lines

Run coverage reports:

```bash
# Generate coverage report
pnpm test:coverage

# Run tests for changed files
pnpm test:related
```

## Continuous Integration

Tests are automatically run in our CI pipeline:

- On pull requests
- Before deployments
- With coverage reports

See our [CI/CD documentation](../deployment/ci-cd.md) for more details.

## Related Documentation

- [Error Handling](../core-features/error-handling.md)
- [Component Patterns](../architecture/component-patterns.md)
- [Performance Monitoring](../core-features/performance-monitoring.md)
