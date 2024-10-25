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
        theme_color: '#ffffff',
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
      server.middlewares.use((req, res, next) => {
        // Set security headers
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

        const url = req.url ?? '/';
        console.log(`Request received: ${url}`);

        if (url === '/') {
          console.log('Redirecting root to /en/');
          res.writeHead(302, { Location: '/en/' });
          res.end();
          return;
        }

        if (url === '/sitemap.xml') {
          console.log('Sitemap request received');
          generateSitemap()
            .then((sitemap) => {
              res.setHeader('Content-Type', 'application/xml');
              res.end(sitemap);
              console.log('Sitemap sent to client');
            })
            .catch((error) => {
              console.error('Error generating or sending sitemap:', error);
              res.statusCode = 500;
              res.end('Error generating sitemap');
            });
          return;
        }

        next();
      });
    },
  };
});
