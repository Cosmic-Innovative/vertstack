# Security Implementation

## Overview

The VERT Stack implements comprehensive security measures including:

- Content Security Policy (CSP)
- CSRF Protection
- Security Headers
- Input Validation
- Type-Safe API Integration

## Content Security Policy

The application uses environment-specific CSP configurations:

### Development CSP

```typescript
// From vite.config.ts
if (process.env.NODE_ENV === 'development') {
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      // Allow inline scripts and eval for development tools
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com",
      // Allow inline styles for development
      "style-src 'self' 'unsafe-inline'",
      // Allow data URLs for images and placeholder API
      "img-src 'self' data: /api/placeholder/ blob:",
      // Allow fonts
      "font-src 'self' data:",
      // Allow API connections
      "connect-src 'self' ws: wss: https://jsonplaceholder.typicode.com",
      // Allow workers for development
      "worker-src 'self' blob:",
      // Basic security restrictions
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  );
}
```

### Production CSP

```typescript
// Production CSP headers
res.setHeader(
  'Content-Security-Policy',
  [
    "default-src 'self'",
    "script-src 'self' https://cdnjs.cloudflare.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: /api/placeholder/",
    "connect-src 'self' https://jsonplaceholder.typicode.com",
    "worker-src 'self' blob:",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    'upgrade-insecure-requests',
  ].join('; '),
);
```

## CSRF Protection

### Token Generation and Validation

```typescript
interface CsrfOptions {
  cookieName: string;
  headerName: string;
  cookieOptions: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
  };
}

// CSRF Middleware
export const csrfMiddleware = (options: CsrfOptions = defaultOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET') {
      return next();
    }

    const token = req.cookies[options.cookieName];
    const headerToken = req.headers[options.headerName];

    if (!token || !headerToken || token !== headerToken) {
      logger.logSecurityEvent('CSRF token validation failed', 'high', {
        method: req.method,
        path: req.path,
        headers: req.headers,
      });
      return res.status(403).json({ error: 'Invalid CSRF token' });
    }

    next();
  };
};
```

### Client-Side Token Handling

```typescript
export const addCsrfToken = (headers: Headers): Headers => {
  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  if (token) {
    headers.append('X-XSRF-TOKEN', token);
  }

  return headers;
};
```

## Security Headers

The application sets comprehensive security headers:

```typescript
res.setHeader(
  'Strict-Transport-Security',
  'max-age=31536000; includeSubDomains',
);
res.setHeader('X-Frame-Options', 'DENY');
res.setHeader('X-Content-Type-Options', 'nosniff');
res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
```

## Input Validation and Sanitization

### Input Sanitization

```typescript
export function sanitizeInput(input: string): string {
  const entities: ReadonlyMap<string, string> = new Map([
    ['&', '&amp;'],
    ['<', '&lt;'],
    ['>', '&gt;'],
    ['"', '&quot;'],
    ["'", '&#39;'],
  ]);

  return input.replace(/[&<>"']/g, (char) => entities.get(char) || char);
}
```

### URL Validation

```typescript
export async function fetchData<T>(url: string): Promise<T> {
  try {
    const validatedUrl = new URL(url);
    if (!['http:', 'https:'].includes(validatedUrl.protocol)) {
      throw new Error('Invalid URL protocol');
    }

    // Additional security headers for requests
    const headers = new Headers({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    });

    // Add CSRF token for non-GET requests
    if (url.method !== 'GET') {
      addCsrfToken(headers);
    }

    const response = await fetch(validatedUrl.toString(), { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse JSON safely
    const text = await response.text();
    return JSON.parse(text);
  } catch (error) {
    logger.error('Fetch error:', error);
    throw error;
  }
}
```

## Security Event Monitoring

The system includes comprehensive security event logging:

```typescript
logger.logSecurityEvent('Failed login attempt', 'medium', {
  username: 'user@example.com',
  ipAddress: '192.168.1.1',
  attemptCount: 3,
  timestamp: new Date().toISOString(),
});
```

### Security Event Severity Levels

- **Critical**

  - Unauthorized admin access attempts
  - Data breach detection
  - Authentication bypass attempts
  - Multiple failed API authentications

- **High**

  - CSRF token failures
  - Invalid JWT tokens
  - Multiple failed logins
  - XSS attempt detection

- **Medium**

  - Rate limit violations
  - Invalid input patterns
  - Unexpected API usage
  - Unauthorized route access

- **Low**
  - Development mode warnings
  - Deprecation notices
  - Minor configuration issues

## Security Testing

```typescript
describe('Security Features', () => {
  it('validates CSRF tokens correctly', async () => {
    const headers = new Headers();
    const token = 'test-csrf-token';
    document.cookie = `XSRF-TOKEN=${token}`;

    const updatedHeaders = addCsrfToken(headers);
    expect(updatedHeaders.get('X-XSRF-TOKEN')).toBe(token);
  });

  it('sanitizes input properly', () => {
    const input = '<script>alert("xss")</script>';
    const sanitized = sanitizeInput(input);
    expect(sanitized).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
    );
  });

  it('validates URLs correctly', async () => {
    await expect(fetchData('ftp://invalid.com')).rejects.toThrow(
      'Invalid URL protocol',
    );
  });
});
```

## Production Security Checklist

- [x] HTTPS enforced in production
- [x] CSP headers configured
- [x] CSRF protection enabled
- [x] Security headers set
- [x] Input sanitization implemented
- [x] URL validation active
- [x] Security logging configured
- [x] Rate limiting enabled
- [x] Error messages sanitized
- [x] Dependencies audited

## CI/CD Security Integration

```yaml
# From GitHub Actions workflow
- name: Security Audit
  run: |
    pnpm audit
    pnpm dlx lockfile-lint -p package-lock.json

- name: Run Security Tests
  run: pnpm test:security

- name: Check Headers
  run: |
    curl -I https://your-staging-url.com | grep -i 'strict-transport-security'
    curl -I https://your-staging-url.com | grep -i 'content-security-policy'
```

## Regular Security Tasks

1. **Weekly**

   - Review security logs
   - Check rate limit violations
   - Monitor failed authentications

2. **Monthly**

   - Audit npm dependencies
   - Review CSP reports
   - Update security headers

3. **Quarterly**
   - Penetration testing
   - Security configuration review
   - Update security documentation

## Related Documentation

- [Error Handling](./error-handling.md)
- [Logging System](./logging.md)
- [Environment Configuration](../deployment/environment-configuration.md)
