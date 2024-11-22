# Progressive Web App Guide

## Overview

The VERT Stack provides comprehensive Progressive Web App (PWA) support through:

- Offline functionality
- Install prompts
- Service worker management
- Update notifications
- Performance optimization

## Quick Start

```typescript
// Register PWA in main.tsx
import { registerPWA } from './pwa';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

registerPWA();
```

## Key Features

### 1. Service Worker Registration

```typescript
export function registerPWA() {
  if ('serviceWorker' in navigator) {
    let updateSWCallback: ((reloadPage?: boolean) => Promise<void>) | undefined;

    updateSWCallback = registerSW({
      immediate: true,
      onNeedRefresh() {
        const userWantsUpdate = window.confirm(
          'New content available. Reload?',
        );
        if (userWantsUpdate) {
          updateSWCallback?.(true);
        }
      },
      onOfflineReady() {
        console.log('Application ready to work offline');
      },
      onRegisterError(error) {
        console.error('Service Worker registration failed:', error);
      },
    });
  }
}
```

### 2. PWA Configuration

```typescript
// vite.config.ts
VitePWA({
  registerType: 'autoUpdate',
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
        purpose: 'any maskable',
      },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/api\.example\.com/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24,
          },
        },
      },
    ],
  },
});
```

## Implementation Guide

### 1. Cache Configuration

```typescript
// Cache strategies
const cacheStrategies = {
  // API requests
  apiCache: {
    urlPattern: /^https:\/\/api\./,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'api-cache',
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24, // 24 hours
      },
    },
  },

  // Static assets
  assetsCache: {
    urlPattern: /\.(png|jpg|jpeg|svg|gif)$/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'assets-cache',
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
      },
    },
  },
};
```

### 2. Update Management

```typescript
const UpdatePrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const registration = await navigator.serviceWorker.ready;

    registration.addEventListener('updatefound', () => {
      setShowPrompt(true);
    });
  }, []);

  if (!showPrompt) return null;

  return (
    <div role="alert" className="update-prompt">
      <p>New version available!</p>
      <button onClick={() => window.location.reload()}>Update Now</button>
    </div>
  );
};
```

### 3. Offline Support

```typescript
const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div role="alert" className="offline-indicator">
      You are currently offline
    </div>
  );
};
```

## Best Practices

### 1. Service Worker Scope

DO:

```typescript
// Register at root scope
navigator.serviceWorker.register('/sw.js', {
  scope: '/',
});
```

DON'T:

```typescript
// Limited scope
navigator.serviceWorker.register('/sw.js', {
  scope: '/app/', // Limited to /app/ path
});
```

### 2. Cache Strategy

DO:

```typescript
// Use appropriate strategies
{
  // Network-first for API
  '/api/': 'NetworkFirst',
  // Cache-first for assets
  '/assets/': 'CacheFirst',
  // Stale-while-revalidate for content
  '/content/': 'StaleWhileRevalidate'
}
```

DON'T:

```typescript
// Same strategy for everything
{
  '.*': 'NetworkFirst' // Not optimal
}
```

### 3. Update Handling

DO:

```typescript
// Prompt user for updates
onNeedRefresh() {
  // Show user-friendly prompt
  const update = confirm('Update available. Install now?');
  if (update) {
    window.location.reload();
  }
}
```

DON'T:

```typescript
// Force updates
onNeedRefresh() {
  window.location.reload(); // Bad UX
}
```

## Testing

```typescript
describe('PWA Features', () => {
  it('registers service worker', async () => {
    await registerPWA();

    expect(navigator.serviceWorker.ready).resolves.toBeDefined();
  });

  it('handles offline mode', async () => {
    // Simulate offline
    await network.offline();

    const response = await fetch('/api/data');
    expect(response.ok).toBe(true); // Should serve from cache

    await network.online();
  });

  it('prompts for updates', async () => {
    const registration = await navigator.serviceWorker.ready;

    // Simulate update
    registration.update();

    await waitFor(() => {
      expect(screen.getByText(/update available/i)).toBeInTheDocument();
    });
  });
});
```

## Troubleshooting

### Common Issues

1. **Service Worker Not Registering**

```typescript
// Check HTTPS
if (location.protocol !== 'https:') {
  console.error('Service Worker requires HTTPS');
  return;
}
```

2. **Cache Not Working**

```typescript
// Verify cache configuration
workbox.precacheAndRoute([
  // List specific files
  { url: '/index.html', revision: '1' },
  { url: '/styles.css', revision: '1' },
]);
```

3. **Update Prompts Not Showing**

```typescript
// Ensure update detection
navigator.serviceWorker.addEventListener('controllerchange', () => {
  if (refreshing) return;
  refreshing = true;
  window.location.reload();
});
```

## Development Setup

### Local HTTPS

```bash
# Generate certificates
mkcert -install
mkdir .cert
mkcert -key-file ./.cert/localhost-key.pem -cert-file ./.cert/localhost.pem localhost

# Start with HTTPS
pnpm dev:https
```

### Development Configuration

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('./.cert/localhost-key.pem'),
      cert: fs.readFileSync('./.cert/localhost.pem'),
    },
  },
});
```

## Production Deployment

### Build Configuration

```typescript
// Production optimizations
const buildConfig = {
  manifest: {
    name: 'VERT Stack App',
    short_name: 'VERT App',
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
        purpose: 'any maskable',
      },
    ],
    background_color: '#ffffff',
    display: 'standalone',
    start_url: '/?source=pwa',
  },
};
```

### Lighthouse Validation

```json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:pwa": ["warn", { "minScore": 0.9 }],
        "service-worker": "error",
        "installable-manifest": "error",
        "splash-screen": "warn",
        "themed-omnibox": "warn"
      }
    }
  }
}
```

## Performance Optimization

### Asset Caching

```typescript
// Optimize cache strategies
const cacheConfig = {
  // Static assets
  staticAssets: {
    urlPattern: /\.(js|css|png|jpg|jpeg|svg|gif)$/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'static-assets',
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
      },
    },
  },

  // API responses
  apiResponses: {
    urlPattern: /^https:\/\/api\./,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'api-responses',
      networkTimeoutSeconds: 3,
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 60 * 60, // 1 hour
      },
    },
  },

  // Page navigation
  navigation: {
    urlPattern: /\/[^.]*$/,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'navigation',
      networkTimeoutSeconds: 5,
    },
  },
};
```

### Update Flow

```typescript
// Efficient update handling
const handleUpdate = async () => {
  const registration = await navigator.serviceWorker.ready;

  if (registration && registration.waiting) {
    // Notify waiting service worker to activate
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    // Reload once the new service worker takes over
    registration.addEventListener('activate', () => {
      window.location.reload();
    });
  }
};
```

## Related Documentation

- [Performance Monitoring](./performance-monitoring.md)
- [Build Configuration](../development/build-configuration.md)
- [Environment Configuration](../deployment/environment-configuration.md)
