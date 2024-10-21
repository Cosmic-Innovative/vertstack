/// <reference types="node" />

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
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

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
        manifest: {
          name: 'VERT Stack App',
          short_name: 'VERT App',
          description: 'VERT Stack Template Application',
          start_url: '/?source=pwa',
          display: 'standalone',
          theme_color: '#ffffff',
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
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        },
      }),
    ],
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
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            i18n: ['i18next', 'react-i18next'],
            utils: ['./src/utils/api.ts', './src/utils/sitemapGenerator.ts'],
            components: [
              './src/components/ErrorBoundary.tsx',
              './src/components/TitleComponent.tsx',
            ],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
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
