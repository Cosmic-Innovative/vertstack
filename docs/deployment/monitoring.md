# Production Monitoring Guide

## Overview

The VERT Stack provides built-in monitoring capabilities through:

- Web Vitals tracking
- Performance metrics collection
- Structured logging
- Error tracking

## Performance Monitoring

### Web Vitals Tracking

From `performance-utils.ts`:

```typescript
export function initMobilePerformanceTracking(): void {
  // First Contentful Paint (FCP)
  const fcpObserver = new PerformanceObserver((entryList) => {
    const fcpEntry = entryList.getEntries()[0];
    logger.info('First Contentful Paint (FCP)', {
      category: 'Performance',
      value: fcpEntry.startTime,
      metric: 'FCP',
    });
  });
  fcpObserver.observe({ entryTypes: ['paint'] });

  // Largest Contentful Paint (LCP)
  const lcpObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    logger.info('Largest Contentful Paint (LCP)', {
      category: 'Performance',
      value: lastEntry.startTime,
      metric: 'LCP',
    });
  });
  lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

  // First Input Delay (FID)
  const fidObserver = new PerformanceObserver((entryList) => {
    const firstInput = entryList.getEntries()[0] as PerformanceEventTiming;
    logger.info('First Input Delay (FID)', {
      category: 'Performance',
      value: firstInput.processingStart - firstInput.startTime,
      metric: 'FID',
    });
  });
  fidObserver.observe({ entryTypes: ['first-input'] });

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries() as LayoutShift[]) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    }
    logger.info('Cumulative Layout Shift (CLS)', {
      category: 'Performance',
      value: clsValue,
      metric: 'CLS',
    });
  });
  clsObserver.observe({ entryTypes: ['layout-shift'] });
}
```

### Performance Reporting

```typescript
export function reportMobileVitals(): void {
  const navigator = window.navigator as NavigatorWithMemory;

  if (navigator.connection) {
    const connection = navigator.connection;
    logger.info('Network Information', {
      category: 'Performance',
      effectiveType: connection.effectiveType,
      saveData: connection.saveData,
      rtt: connection.rtt,
      downlink: connection.downlink,
    });
  }

  if (navigator.deviceMemory) {
    logger.info('Device Memory', {
      category: 'Performance',
      deviceMemory: navigator.deviceMemory,
    });
  }
}
```

## Error Monitoring

### Structured Error Logging

From `logger.ts`:

```typescript
logger.error('Operation failed', {
  error,
  category: 'Database',
  operation: 'insert',
  timestamp: new Date().toISOString(),
  correlationId: '123',
});
```

### Error Boundary Integration

From `ErrorBoundary.tsx`:

```typescript
public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
  logger.error('Uncaught error in component', {
    error,
    errorInfo,
    componentStack: errorInfo.componentStack,
    location: window.location.href,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  });
}
```

## Request Monitoring

```typescript
logger.logRequest(method, url, status, duration, {
  userId: 123,
  query: { page: 1 },
});
```

## Security Event Monitoring

```typescript
logger.logSecurityEvent('Failed login attempt', 'medium', {
  username: 'user@example.com',
  ipAddress: '192.168.1.1',
  attemptCount: 3,
});
```

## Business Event Monitoring

```typescript
logger.logBusinessEvent(
  'Order processed',
  true, // success
  {
    orderId: '12345',
    amount: 99.99,
    customer: 'john.doe',
  },
);
```

## Performance Metrics

```typescript
// Start timing an operation
logger.startMetric('database-query');

// End timing and log if over threshold
logger.endMetric('database-query', 1000); // Warns if over 1000ms

// Get performance summary
const metrics = logger.getMetricsSummary('database-query');
// Returns: { count, average, min, max, latest }
```

## Integration with External Services

The logger is designed to be integrated with external logging services through the `sendToLoggingService` method:

```typescript
private async sendToLoggingService(entries: LogEntry[]): Promise<void> {
  // Implementation for external logging service
  // Example: Splunk, ELK, CloudWatch, etc.
}
```

## Production Best Practices

1. **Log Levels**

   - Use appropriate log levels for production
   - Filter sensitive information
   - Set proper batch sizes and queue limits

2. **Performance Monitoring**

   - Track all core web vitals
   - Monitor network conditions
   - Track device capabilities

3. **Error Tracking**
   - Include full error context
   - Use correlation IDs
   - Track error frequencies

## Related Documentation

- [Logging System](../core-features/logging.md)
- [Error Handling](../core-features/error-handling.md)
- [Performance Utils](../core-features/performance-utils.md)
