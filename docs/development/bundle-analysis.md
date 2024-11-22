# Bundle Analysis

## Overview

The VERT Stack uses rollup-plugin-visualizer to analyze bundle composition and size. This helps developers:

- Identify large dependencies
- Analyze chunk splitting effectiveness
- Find opportunities for code splitting
- Track bundle size changes
- Optimize production builds

## Current Configuration

Our Vite configuration includes the following chunking strategy:

```typescript
manualChunks: {
  'vendor-react': ['react', 'react-dom', 'react-router-dom'],
  'vendor-i18n': ['i18next', 'react-i18next'],
  'utils': [
    './src/utils/api.ts',
    './src/utils/logger.ts',
    './src/utils/languageDetection.ts',
    './src/utils/performance-utils.ts',
    './src/utils/sitemapGenerator.ts',
  ],
  'utils-i18n': [
    './src/utils/i18n/index.ts',
    './src/utils/i18n/datetime-utils.ts',
    './src/utils/i18n/number-utils.ts',
    './src/utils/i18n/list-utils.ts',
  ],
  'components-core': [
    './src/components/ErrorBoundary.tsx',
    './src/components/TitleComponent.tsx',
    './src/components/Navbar.tsx',
    './src/components/Footer.tsx',
  ],
  'components-i18n': [
    './src/components/LanguageSwitcher.tsx'
  ],
  'components-features': [
    './src/components/UserList.tsx',
    './src/components/ApiExample.tsx',
  ],
}
```

## Usage

### Generate Bundle Analysis

```bash
# Generate bundle analysis
ANALYZE=true pnpm build

# The visualization will be generated at dist/stats.html
```

### Visualization Types

The plugin supports different visualization templates:

- `treemap` (default): Shows hierarchical data using nested rectangles
- `sunburst`: Circular visualization of the hierarchy
- `network`: Force-directed graph showing dependencies
- `raw`: Raw data in JSON format

### Reading the Visualization

The visualization shows:

1. Total bundle size
2. Individual chunk sizes
3. Module composition within chunks
4. Dependencies between modules
5. Gzip and Brotli compressed sizes

### Example Analysis

```
vendor-react (250 KB)
├── react (40 KB)
├── react-dom (180 KB)
└── react-router-dom (30 KB)

utils-i18n (45 KB)
├── datetime-utils (15 KB)
├── number-utils (10 KB)
└── list-utils (20 KB)
```

## Bundle Optimization

### Current Optimizations

1. **Production Build Settings**

   ```typescript
   build: {
     target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
     minify: 'terser',
     terserOptions: {
       compress: {
         ecma: 2020,
         passes: 2,
         drop_console: isProd,
         drop_debugger: isProd,
         pure_funcs: isProd ? ['console.log', 'console.info', 'console.debug'] : [],
       },
     },
     reportCompressedSize: true,
     chunkSizeWarningLimit: 500,
   }
   ```

2. **Module Preload**

   ```typescript
   modulePreload: {
     polyfill: true,
     resolveDependencies: (filename: string, deps: string[]) => {
       if (filename.includes('vendor-react')) {
         return deps;
       }
       return deps.slice(0, 3);
     },
   }
   ```

3. **Asset Management**
   ```typescript
   assetFileNames: (assetInfo) => {
     if (/\.(png|jpe?g|svg|gif|webp)$/.test(assetInfo.name ?? '')) {
       return 'images/[name].[hash][extname]';
     }
     if (/\.css$/.test(assetInfo.name ?? '')) {
       return 'styles/[name].[hash][extname]';
     }
     return 'assets/[name].[hash][extname]';
   };
   ```

## Monitoring Bundle Size

### Lighthouse CI Integration

Our `lighthouserc.json` includes performance budgets:

```json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.9 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }]
      }
    }
  }
}
```

### GitHub Actions Integration

Pull requests automatically check bundle size changes through our CI pipeline:

```yaml
- name: Build and Analyze
  run: ANALYZE=true pnpm build
```

## Best Practices

1. **Dependency Management**

   - Regularly audit dependencies
   - Use bundle-size aware alternatives
   - Remove unused dependencies
   - Use dynamic imports for large dependencies

2. **Code Splitting**

   - Split routes using lazy loading
   - Group related functionality
   - Avoid over-splitting small modules
   - Balance number of chunks

3. **Asset Optimization**

   - Optimize images and SVGs
   - Use appropriate formats
   - Implement lazy loading
   - Set explicit dimensions

4. **Performance Budget**
   - Monitor bundle size trends
   - Set size limits for chunks
   - Track load time metrics
   - Review impact of changes

## Common Issues

### Large Chunks

If a chunk exceeds the warning limit:

1. Analyze its composition
2. Consider splitting into smaller chunks
3. Look for duplicate dependencies
4. Review import strategy

### Performance Impact

Monitor performance metrics:

1. First Contentful Paint (FCP)
2. Largest Contentful Paint (LCP)
3. Time to Interactive (TTI)
4. Total Blocking Time (TBT)

## Related Documentation

- [Performance Monitoring](../core-features/performance-monitoring.md)
- [Build Configuration](./build-configuration.md)
- [CI/CD Integration](../deployment/ci-cd.md)
