# API Integration

## Overview

The VERT Stack provides a robust API integration system with:

- Type-safe API utilities
- Error handling
- Request/Response logging
- CSRF protection
- Security validations

## Core API Utilities

### Base API Client

```typescript
export async function fetchData<T>(url: string): Promise<T> {
  try {
    // Validate URL to prevent potential security issues
    const validatedUrl = new URL(url);
    if (!['http:', 'https:'].includes(validatedUrl.protocol)) {
      throw new Error('Invalid URL protocol');
    }

    const headers = new Headers({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    });

    // Add CSRF token to non-GET requests
    if (url.method !== 'GET') {
      addCsrfToken(headers);
    }

    const response = await fetch(validatedUrl.toString(), {
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse JSON safely
    const text = await response.text();
    return JSON.parse(text);
  } catch (error) {
    logger.error('Fetch error:', {
      error,
      url,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}
```

### Request/Response Logging

```typescript
logger.logRequest(
  'GET',
  '/api/users',
  200,
  150, // duration in ms
  { userId: 123, query: { page: 1 } },
);
```

## Error Handling Patterns

### API Error Handling in Components

```typescript
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
    return (
      <div role="alert">
        {t('errors.fetchError', { error: sanitizeInput(error) })}
      </div>
    );
  }

  // Rest of component implementation
};
```

### Error States

```typescript
// Loading state
if (isLoading) {
  return (
    <div className="loading-container" role="status" aria-live="polite">
      {t('general:loading')}
    </div>
  );
}

// Error state
if (error) {
  return (
    <div role="alert" className="error-container">
      {t('errors.apiError')}
      <button onClick={retry}>{t('errors.retry')}</button>
    </div>
  );
}
```

## Example Usage Patterns

### Basic Data Fetching

```typescript
// Fetch user data
const userData = await fetchData<User>('/api/users/123');

// Fetch and type paginated data
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
}

const response = await fetchData<PaginatedResponse<User>>('/api/users');
```

### Request Validation

```typescript
// Input validation
export function validateRequest<T>(data: unknown, schema: Schema<T>): T {
  try {
    return schema.parse(data);
  } catch (error) {
    logger.error('Request validation failed:', { error, data });
    throw new Error('Invalid request data');
  }
}

// Usage example
interface CreateUserRequest {
  name: string;
  email: string;
}

const createUser = async (data: CreateUserRequest) => {
  const validatedData = validateRequest(data, createUserSchema);
  return fetchData<User>('/api/users', {
    method: 'POST',
    body: JSON.stringify(validatedData),
  });
};
```

## Best Practices

### 1. Type Safety

```typescript
// Define proper types for all API data
interface User {
  id: number;
  name: string;
  email: string;
  company: {
    name: string;
    catchPhrase: string;
  };
}

// Use type parameters
const getUser = async (id: number): Promise<User> => {
  return fetchData<User>(`/api/users/${id}`);
};
```

### 2. Error Handling

```typescript
try {
  const data = await fetchData<ResponseType>(endpoint);
  handleSuccess(data);
} catch (error) {
  logger.error('API Error', {
    endpoint,
    error,
    timestamp: new Date().toISOString(),
  });
  handleError(error);
}
```

### 3. Request Logging

```typescript
// Log all API requests
logger.logRequest(method, url, status, duration, {
  requestId,
  userId,
  params,
});
```

### 4. Security

```typescript
// Always sanitize user input
const sanitizedQuery = sanitizeInput(userQuery);

// Validate URLs
const validatedUrl = new URL(url);
if (!['http:', 'https:'].includes(validatedUrl.protocol)) {
  throw new Error('Invalid URL protocol');
}

// Include CSRF tokens
if (method !== 'GET') {
  addCsrfToken(headers);
}
```

## Testing API Integration

```typescript
describe('api utilities', () => {
  it('fetches data successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(JSON.stringify(mockData)),
    });

    const result = await fetchData('https://api.example.com/data');
    expect(result).toEqual(mockData);
  });

  it('handles errors appropriately', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    await expect(fetchData('https://api.example.com/data')).rejects.toThrow(
      'Network error',
    );
  });
});
```

## Related Documentation

- [Error Handling](../core-features/error-handling.md)
- [Security](./security.md)
- [Testing](../development/testing-guidelines.md)
