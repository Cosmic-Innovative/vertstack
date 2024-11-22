# Installation Guide

This guide walks you through setting up a new VERT Stack project, from initial installation to verification of all features.

## Prerequisites

### Required Software

- **Node.js** (18.x or later)

  ```bash
  node --version
  # Should output v18.x or higher
  ```

- **pnpm** (8.x or later)
  ```bash
  pnpm --version
  # Should output 8.x or higher
  ```

### Optional Tools

- **mkcert** - For HTTPS development (required for PWA testing)
- **VS Code** - Recommended editor with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features

## Installation Steps

### 1. Create New Project

```bash
# Clone the template
git clone https://github.com/Cosmic-Innovative/vertstack.git my-project
cd my-project

# Remove existing git history
rm -rf .git
git init
```

### 2. Install Dependencies

```bash
# Install all dependencies
pnpm install

# Verify installation
pnpm exec tsc --version
pnpm exec eslint --version
```

### 3. Configure Environment

```bash
# Copy environment templates
cp .env.example .env
cp .env.development.example .env.development
cp .env.staging.example .env.staging
cp .env.production.example .env.production
```

Edit the environment files to match your needs:

- `.env` - Base configuration
- `.env.development` - Development settings
- `.env.staging` - Staging settings
- `.env.production` - Production settings

### 4. HTTPS Setup (Optional)

Required for PWA development:

```bash
# Install mkcert (macOS)
brew install mkcert

# Other platforms: https://github.com/FiloSottile/mkcert#installation

# Set up certificates
mkdir .cert
mkcert -install
mkcert -key-file ./.cert/localhost-key.pem -cert-file ./.cert/localhost.pem localhost
```

## Verification

### 1. Development Server

```bash
# Start development server
pnpm dev

# Or with HTTPS
pnpm dev:https
```

Visit:

- HTTP: `http://localhost:5173`
- HTTPS: `https://localhost:5173`

### 2. Run Tests

```bash
# Run all tests
pnpm test

# Generate coverage report
pnpm test:coverage
```

### 3. Check Build

```bash
# Create production build
pnpm build

# Analyze bundle (optional)
ANALYZE=true pnpm build
```

### 4. Verify Features

#### Internationalization

```bash
# Switch language in browser
# Visit /es/ route for Spanish
# Visit /en/ route for English
```

#### PWA Features (HTTPS required)

```bash
# Build and serve production
pnpm build
pnpm preview

# Check PWA installation prompt
# Test offline functionality
```

## Common Issues

### Build Failures

1. **TypeScript Errors**

   ```bash
   # Check types
   pnpm type-check
   ```

2. **Missing Dependencies**
   ```bash
   # Clean install
   rm -rf node_modules
   pnpm store prune
   pnpm install
   ```

### HTTPS Issues

1. **Certificate Problems**

   ```bash
   # Regenerate certificates
   mkcert -uninstall
   mkcert -install
   mkcert -key-file ./.cert/localhost-key.pem -cert-file ./.cert/localhost.pem localhost
   ```

2. **Port Conflicts**
   ```bash
   # Use different port
   pnpm dev --port 3000
   ```

### Performance Issues

1. **Slow Development Server**

   ```bash
   # Clear cache
   rm -rf node_modules/.vite
   ```

2. **Bundle Size Warnings**
   ```bash
   # Analyze bundle
   ANALYZE=true pnpm build
   ```

## IDE Setup

### VS Code

1. Install recommended extensions:

   ```json
   {
     "recommendations": [
       "dbaeumer.vscode-eslint",
       "esbenp.prettier-vscode",
       "ms-vscode.vscode-typescript-next"
     ]
   }
   ```

2. Enable settings:
   ```json
   {
     "editor.formatOnSave": true,
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     }
   }
   ```

## Next Steps

1. Review [Project Structure](project-structure.md)
2. Explore [Core Features](../core-features/README.md)
3. Set up [Development Environment](../development/README.md)
4. Learn [Internationalization](../internationalization/README.md)

## Additional Resources

- [Bundle Analysis](../development/bundle-analysis.md)
- [Performance Monitoring](../core-features/performance-monitoring.md)
- [Testing Guide](../development/testing-guidelines.md)
- [Contributing Guidelines](../development/contributing.md)
