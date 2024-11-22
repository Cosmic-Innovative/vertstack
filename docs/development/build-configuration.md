# Build Configuration Guide

## Overview

The VERT Stack uses Vite for development and building, with configuration optimized for performance, security, and maintainability.

## Core Configuration

From `vite.config.ts`:

### Base Configuration

```typescript
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isHttps = env.VITE_USE_HTTPS === 'true';
  const isProd = mode === 'production';
  const analyzeBundle = process.env.ANALYZE === 'true';

  return {
    plugins: [
      /* plugins configuration */
    ],
    server: {
      https: httpsConfig,
      host: true,
      port: 5173,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-i18n': ['i18next', 'react-i18next'],
            utils: [
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
          },
        },
      },
      target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
      minify: 'terser',
      terserOptions: {
        compress: {
          ecma: 2020,
          passes: 2,
          drop_console: isProd,
          drop_debugger: isProd,
          pure_funcs: isProd
            ? ['console.log', 'console.info', 'console.debug']
            : [],
        },
      },
    },
  };
});
```

### Bundle Analysis

```typescript
// Bundle analysis plugin
if (analyzeBundle) {
  plugins.push(
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap',
    }),
  );
}
```

### Security Headers

```typescript
// Production security headers
configureServer(server) {
  server.middlewares.use((req, res, next) => {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains',
    );
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader(
      'Referrer-Policy',
      'strict-origin-when-cross-origin',
    );
    res.setHeader(
      'Permissions-Policy',
      'geolocation=(), microphone=(), camera=()',
    );

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

    next();
  });
}
```

## Development Server

### HTTPS Configuration

```typescript
let httpsConfig = false;
if (isHttps && fs.existsSync(keyPath) && fs.existsSync(certFilePath)) {
  try {
    httpsConfig = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certFilePath),
    };
  } catch (error) {
    console.error('Error reading SSL certificates:', error);
  }
}
```

## Build Commands

```bash
# Standard build
pnpm build

# Build with bundle analysis
ANALYZE=true pnpm build

# Build for specific environment
pnpm build --mode staging
pnpm build --mode development
```

## Asset Handling

```typescript
assetFileNames: (assetInfo) => {
  const { name } = assetInfo;
  if (/\.(png|jpe?g|svg|gif|webp)$/.test(name ?? '')) {
    return 'images/[name].[hash][extname]';
  }
  if (/\.css$/.test(name ?? '')) {
    return 'styles/[name].[hash][extname]';
  }
  return 'assets/[name].[hash][extname]';
},
```

## Module Preloading

```typescript
modulePreload: {
  polyfill: true,
  resolveDependencies: (filename: string, deps: string[]) => {
    if (filename.includes('vendor-react')) {
      return deps;
    }
    return deps.slice(0, 3);
  },
},
```

## Related Documentation

- [Environment Configuration](../deployment/environment-configuration.md)
- [PWA Support](../core-features/pwa.md)
- [Internationalization](../internationalization/README.md)
