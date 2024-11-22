# Error Handling Guide

## Overview

The VERT Stack implements a comprehensive error handling system that provides:

- Type-safe error boundaries
- Focus management for accessibility
- Structured error logging
- Recovery mechanisms
- Internationalized error messages

## Key Concepts

### Error Types

```typescript
// Runtime Errors
type RuntimeError = {
  code: 'RENDER_ERROR' | 'STATE_ERROR';
  component?: string;
  message: string;
};

// API Errors
type ApiError = {
  code: 'API_ERROR' | 'VALIDATION_ERROR';
  status?: number;
  endpoint: string;
  message: string;
};

// Security Errors
type SecurityError = {
  code: 'AUTH_ERROR' | 'CSRF_ERROR';
  context: string;
  message: string;
};
```

### Error Boundaries

Error boundaries catch JavaScript errors anywhere in their child component tree:

```typescript
interface Props extends WithTranslation {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

class ErrorBoundary extends Component<Props, State> {
  private lastFocusedElement: HTMLElement | null = null;

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Store focus for restoration
    this.lastFocusedElement = document.activeElement as HTMLElement;

    // Log error
    logger.error('Component error', {
      error,
      errorInfo,
      location: window.location.href,
    });

    // Update state and move focus
    this.setState({ hasError: true }, () => {
      this.errorRef.current?.focus();
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div ref={this.errorRef} tabIndex={-1} role="alert">
          {t('errors.boundary.message')}
          <button onClick={this.handleRetry}>
            {t('errors.boundary.retry')}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Implementation Guide

### 1. Basic Error Handling

```typescript
// Component level
try {
  await riskyOperation();
} catch (error) {
  logger.error('Operation failed', { error });
  setError(error);
}

// With recovery UI
if (error) {
  return (
    <div role="alert">
      {t('errors.operationFailed')}
      <button onClick={retry}>{t('errors.retry')}</button>
    </div>
  );
}
```

### 2. API Error Handling

```typescript
async function fetchData<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new ApiError({
        code: 'API_ERROR',
        status: response.status,
        endpoint: url,
      });
    }

    return await response.json();
  } catch (error) {
    logger.error('API request failed', {
      error,
      url,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}
```

### 3. Form Error Handling

```typescript
const handleSubmit = async (data: FormData) => {
  try {
    await validateInput(data);
    await submitForm(data);
  } catch (error) {
    if (error instanceof ValidationError) {
      setFieldErrors(error.fields);
    } else {
      setGlobalError(error.message);
    }
    // Move focus to first error
    firstErrorRef.current?.focus();
  }
};
```

## Best Practices

### 1. Error Boundary Usage

DO:

```typescript
// Place error boundaries strategically
<ErrorBoundary>
  <Route path="/feature">
    <FeatureComponent />
  </Route>
</ErrorBoundary>
```

DON'T:

```typescript
// Don't wrap every component
<ErrorBoundary>
  <Button /> {/* Too granular */}
</ErrorBoundary>
```

### 2. Focus Management

DO:

```typescript
// Manage focus during errors
componentDidCatch(error: Error) {
  this.lastFocusedElement = document.activeElement;
  this.setState({ hasError: true }, () => {
    this.errorRef.current?.focus();
  });
}
```

DON'T:

```typescript
// Don't ignore focus management
componentDidCatch(error: Error) {
  this.setState({ hasError: true });
}
```

### 3. Error Recovery

DO:

```typescript
// Provide recovery mechanisms
<ErrorBoundary
  fallback={(error) => (
    <ErrorDisplay
      error={error}
      onRetry={this.handleRetry}
      onReset={this.handleReset}
    />
  )}
>
  <FeatureComponent />
</ErrorBoundary>
```

DON'T:

```typescript
// Don't leave users stranded
<ErrorBoundary fallback={<div>Something went wrong</div>}>
  <FeatureComponent />
</ErrorBoundary>
```

## Common Patterns

### 1. Async Error Handling

```typescript
const AsyncComponent: React.FC = () => {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchData();
        setData(data);
      } catch (error) {
        setError(error);
        logger.error('Data loading failed', { error });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => setError(null)} />;
  }

  // Component render
};
```

### 2. Form Validation

```typescript
const FormComponent: React.FC = () => {
  const handleSubmit = async (data: FormData) => {
    try {
      // Reset errors
      setFieldErrors({});
      setGlobalError(null);

      // Validate
      await validateForm(data);

      // Submit
      await submitForm(data);

      // Success handling
      onSuccess();
    } catch (error) {
      if (error instanceof ValidationError) {
        setFieldErrors(error.fields);
        // Focus first error
        firstErrorRef.current?.focus();
      } else {
        setGlobalError(error.message);
        // Focus error message
        errorMessageRef.current?.focus();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {globalError && (
        <div role="alert" ref={errorMessageRef} tabIndex={-1}>
          {globalError}
        </div>
      )}
      {/* Form fields */}
    </form>
  );
};
```

## Testing

### 1. Error Boundary Testing

```typescript
describe('ErrorBoundary', () => {
  it('catches rendering errors', () => {
    const ConsoleError = console.error;
    console.error = vi.fn();

    const error = new Error('Test error');
    const ThrowError = () => {
      throw error;
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    console.error = ConsoleError;
  });

  it('manages focus correctly', () => {
    const button = document.createElement('button');
    document.body.appendChild(button);
    button.focus();

    const error = new Error('Test error');
    const ThrowError = () => {
      throw error;
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(document.activeElement).toBe(screen.getByRole('alert'));
  });
});
```

### 2. Async Error Testing

```typescript
it('handles async errors', async () => {
  const error = new Error('API Error');
  vi.spyOn(api, 'fetchData').mockRejectedValue(error);

  render(<AsyncComponent />);

  await waitFor(() => {
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  // Test recovery
  await userEvent.click(screen.getByText('Retry'));

  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
```

## Troubleshooting

### Common Issues

1. **Error Boundary Not Catching Errors**

   - Ensure error is thrown during render
   - Verify error boundary placement
   - Check for async errors

2. **Focus Management Issues**

   - Verify focus element exists
   - Check focus timing
   - Test keyboard navigation

3. **Recovery Not Working**
   - Verify state reset
   - Check cleanup logic
   - Test component remounting

## Related Documentation

- [Logging System](./logging.md)
- [Accessibility Guidelines](../development/accessibility.md)
- [Testing Guidelines](../development/testing-guidelines.md)
- [Component Patterns](../architecture/component-patterns.md)
