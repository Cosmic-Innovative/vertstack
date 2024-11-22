# Environment Configuration Guide

## Overview

The VERT Stack uses environment-specific configuration files for local development and deployed environments, with support for different deployment environments through branch-based configuration.

## Branch-Environment Relationship

```plaintext
Branch Strategy:
- development -> Development domain (e.g., dev.yourapp.com)
- staging -> Staging domain (e.g., staging.yourapp.com)
- main or production -> Production domain (e.g., yourapp.com)
```

This branch-based strategy:

- Aligns with CI/CD pipeline configuration
- Maps environments to specific domains
- Loads appropriate environment variables based on branch
- Ensures consistent deployment processes

## Environment Structure

```plaintext
.
├── .env                  # Shared default settings
├── .env.development     # Development environment settings
├── .env.staging        # Staging environment settings
└── .env.production     # Production environment settings
```

## Environment Variables

Currently supported environment variables:

```bash
# Required Variables
VITE_PUBLIC_URL=http://localhost:5173  # Base URL for the application
VITE_USE_HTTPS=false                   # Whether to use HTTPS in development
```

## Usage in Code

### Accessing Environment Variables

```typescript
// From vite.config.ts
const env = loadEnv(mode, process.cwd(), '');
const isHttps = env.VITE_USE_HTTPS === 'true';
const isProd = mode === 'production';
```

## Local Development

### Development Commands

```bash
# Start with HTTP
pnpm dev:http

# Start with HTTPS (for PWA testing)
pnpm dev:https
```

## Production Build

### Building for Different Environments

```bash
# Production build
pnpm build

# Staging build
pnpm build --mode staging

# Development build
pnpm build --mode development
```

## Security Headers

```typescript
// From vite.config.ts - Production security headers
if (process.env.NODE_ENV === 'production') {
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
}
```

## HTTPS Setup for Development

For local development with HTTPS (required for PWA testing):

1. Generate certificates:

```bash
mkcert -install
mkdir .cert
mkcert -key-file ./.cert/localhost-key.pem -cert-file ./.cert/localhost.pem localhost
```

2. Use HTTPS environment setting:

```bash
VITE_USE_HTTPS=true pnpm dev
# or
pnpm dev:https
```

## Related Documentation

- [PWA Configuration](../core-features/pwa.md)
- [Build Configuration](../development/build-configuration.md)
- [Security Guidelines](../architecture/security.md)
