# Troubleshooting Guide

## Build Issues

### TypeScript Errors

```bash
error TS2307: Cannot find module './Component' or its corresponding type declarations
```

**Solution**:

1. Check file exists and extensions (.ts, .tsx)
2. Verify imports match file paths
3. Run `pnpm type-check`
4. Verify `tsconfig.json` paths

### ESLint Errors

Common fixes for ESLint issues:

```bash
# Run autofix
pnpm lint:fix

# Check specific files
pnpm lint src/components/YourComponent.tsx
```

### Missing Dependencies

If you encounter module not found errors:

```bash
# Clean install
rm -rf node_modules
pnpm store prune
pnpm install
```

## Development Server Issues

### HTTPS Certificate Issues

When testing PWA features locally:

```bash
# Generate new certificates
mkcert -install
mkdir .cert
mkcert -key-file ./.cert/localhost-key.pem -cert-file ./.cert/localhost.pem localhost

# Start with HTTPS
pnpm dev:https
```

### Port Conflicts

If port 5173 is in use:

1. Kill the process using the port
2. Change the port in `vite.config.ts`
3. Use a different port: `pnpm dev --port 3000`

## Testing Issues

### Test Environment

If tests are failing unexpectedly:

```bash
# Clear test cache
pnpm test --clearCache

# Run specific tests
pnpm test src/components/YourComponent.test.tsx
```

### Coverage Issues

```bash
# Generate detailed coverage report
pnpm test:coverage

# Run tests for changed files
pnpm test:related
```

## Production Issues

### Lighthouse Score

If Lighthouse scores are low:

1. Check Core Web Vitals with Performance Monitoring
2. Analyze bundle size with `ANALYZE=true pnpm build`
3. Verify image optimization and lazy loading
4. Check for layout shifts

### PWA Issues

- Verify HTTPS is enabled
- Check service worker registration
- Validate manifest.json
- Test offline functionality

## Internationalization Issues

### Missing Translations

If translations aren't loading:

1. Check language file exists
2. Verify language code format
3. Check loading errors in console
4. Verify path in language loader

### Language Detection

If language detection fails:

1. Check URL language prefix
2. Verify supported languages list
3. Check browser language detection
4. Review language fallback chain

## Common Solutions

### Environment Reset

```bash
# Full reset
rm -rf node_modules
pnpm store prune
pnpm install
rm -rf dist
```

### Cache Issues

```bash
# Clear build cache
rm -rf dist

# Clear test cache
pnpm test --clearCache
```

### Type Issues

```bash
# Check types
pnpm type-check

# Regenerate type definitions
rm -rf dist
pnpm build
```

## Getting Help

1. Check existing documentation:

   - [Error Handling Guide](core-features/error-handling.md)
   - [Logging System](core-features/logging.md)
   - [Performance Monitoring](core-features/performance-monitoring.md)

2. Use logging system for debugging:

   ```typescript
   logger.debug('Debugging info', {
     category: 'Component',
     details: yourDetails,
   });
   ```

3. Review error boundaries implementation for component errors

4. Check GitHub Issues for known problems

## Related Documentation

- [Error Handling](core-features/error-handling.md)
- [Logging System](core-features/logging.md)
- [Performance Monitoring](core-features/performance-monitoring.md)
- [Development Guide](development/README.md)
