# State Management

## Overview

The VERT Stack uses React's built-in state management capabilities through hooks, with a focus on type safety and clean data flow.

## Component State Patterns

```typescript
const Component: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      // Your data fetching logic here
      if (mounted) {
        setIsLoading(false);
      }
    };

    void loadData();
    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) return <div>{/* Loading state */}</div>;
  return <div>{/* Render data */}</div>;
};
```

## State with Effects

```typescript
// From LanguageSwitcher.tsx
const LanguageSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <div>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {/* Button content */}
      </button>
    </div>
  );
};
```

## Loading and Error States

```typescript
// From UserList.tsx
const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData<User[]>('https://jsonplaceholder.typicode.com/users')
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (error) {
    return <div role="alert">{error}</div>;
  }

  if (loading) {
    return <div role="status">{t('general.loading')}</div>;
  }

  return <div>{/* Render users */}</div>;
};
```

## Testing State Changes

```typescript
describe('UserList', () => {
  it('handles loading states', async () => {
    render(<UserList />);
    expect(screen.getByRole('status')).toHaveTextContent(/loading/i);
  });

  it('handles error states', async () => {
    const error = new Error('Failed to fetch');
    vi.mocked(fetchData).mockRejectedValue(error);

    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
```

## Related Documentation

[Error Handling](../core-features/error-handling.md)
[Component Patterns](./component-patterns.md)
[Testing Guidelines](../development/testing-guidelines.md)
