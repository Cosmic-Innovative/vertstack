/// <reference types="node" />

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateSitemap } from './src/utils/sitemapGenerator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const certPath = path.resolve(__dirname, '.cert');
const keyPath = path.join(certPath, 'localhost-key.pem');
const certFilePath = path.join(certPath, 'localhost.pem');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isHttps = env.VITE_USE_HTTPS === 'true';
  const isProd = mode === 'production';
  const analyzeBundle = process.env.ANALYZE === 'true';

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

  const plugins = [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'VERT Stack App',
        short_name: 'VERT App',
        description: 'VERT Stack Template Application',
        start_url: '/?source=pwa',
        display: 'standalone',
        theme_color: {
          light: '#ffffff',
          dark: '#000000',
        },
        background_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        orientation: 'portrait',
        categories: ['productivity', 'development'],
        shortcuts: [
          {
            name: 'Home',
            url: '/',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }],
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/jsonplaceholder\.typicode\.com/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\.(png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/],
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
  ];

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

  return {
    plugins,
    server: {
      https: httpsConfig,
      host: true,
      port: 5173,
    },
    preview: {
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
            'components-core': [
              './src/components/ErrorBoundary.tsx',
              './src/components/TitleComponent.tsx',
              './src/components/Navbar.tsx',
              './src/components/Footer.tsx',
            ],
            'components-i18n': ['./src/components/LanguageSwitcher.tsx'],
            'components-features': [
              './src/components/UserList.tsx',
              './src/components/ApiExample.tsx',
            ],
          },
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId || '';
            if (facadeModuleId.includes('node_modules')) {
              return 'vendor/[name].[hash].js';
            }
            return 'assets/[name].[hash].js';
          },
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
          format: 'es',
          // Improve tree-shaking
          preserveEntrySignatures: 'strict',
        },
      },
      modulePreload: {
        polyfill: true,
        resolveDependencies: (filename: string, deps: string[]) => {
          if (filename.includes('vendor-react')) {
            return deps;
          }
          return deps.slice(0, 3);
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
      reportCompressedSize: true,
      chunkSizeWarningLimit: 500,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './vitest.setup.ts',
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/**/*.test.{ts,tsx}',
          'src/**/*.spec.{ts,tsx}',
          'src/test-utils.tsx',
          'src/vite-env.d.ts',
          'src/i18n.mock.ts',
        ],
      },
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'i18next',
        'react-i18next',
      ],
      exclude: ['@vite/client', '@vite/env'],
    },
    experimental: {
      renderBuiltUrl(filename: string) {
        if (filename.endsWith('.css')) {
          return { relative: true, preload: true };
        }
        if (filename.includes('vendor')) {
          return { relative: true, preload: true };
        }
        return { relative: true };
      },
    },
    configureServer(server) {
      // Sitemap handler as the very first middleware
      server.middlewares.use((req, _, next) => {
        // Force early route capture for sitemap
        if (req.url === '/sitemap.xml') {
          req.url = '/__sitemap.xml';
        }
        next();
      });
      // Add custom route handler before the SPA handler
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/__sitemap.xml') {
          const sitemap = await generateSitemap(env.VITE_PUBLIC_URL);
          res.setHeader('Content-Type', 'application/xml');
          res.end(sitemap);
          return;
        }
        next();
      });

      server.middlewares.use(async (req, res, next) => {
        // Set security headers with development-friendly CSP
        res.setHeader(
          'Strict-Transport-Security',
          'max-age=31536000; includeSubDomains',
        );
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader(
          'Permissions-Policy',
          'geolocation=(), microphone=(), camera=()',
        );

        // Enhanced CSP that allows for development needs
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
        } else {
          // Stricter CSP for production
          res.setHeader(
            'Content-Security-Policy',
            [
              "default-src 'self'",
              // More restrictive script handling for production
              "script-src 'self' https://cdnjs.cloudflare.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: /api/placeholder/",
              "font-src 'self' data:",
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

        const url = req.url ?? '/';
        console.log(`Request received: ${url}`);

        if (url === '/') {
          console.log('Redirecting root to /en/');
          res.writeHead(302, { Location: '/en/' });
          res.end();
          return;
        }

        next();
      });
    },
  };
});
