# Logging System

## Overview

The VERT Stack implements a comprehensive logging system that provides:

- Structured logging with type safety
- Queue-based processing with retry mechanisms
- Performance metric tracking
- Offline resilience
- Security and business event logging
- Request/response logging

## Core Types

```typescript
type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
type LogCategory =
  | 'Security'
  | 'Performance'
  | 'API'
  | 'Database'
  | 'Cache'
  | 'UI'
  | 'Business'
  | string;

interface LogEntry {
  level: LogLevel;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
  category?: LogCategory;
  correlationId?: string;
  metadata?: Record<string, unknown>;
  tags?: string[];
}

interface LogOptions {
  maxQueueSize?: number; // Default: 1000
  batchSize?: number; // Default: 10
  retryAttempts?: number; // Default: 3
  retryDelay?: number; // Default: 1000ms
  minLevel?: LogLevel; // Default: 'info'
  rotationSize?: number; // Default: 1000
  persistent?: boolean; // Default: true
}
```

## Core Features

### Queue-Based Processing

```typescript
private async processQueue(retryCount = 0): Promise<void> {
  if (this.isProcessing || this.logQueue.length === 0) return;

  this.isProcessing = true;
  const batch = this.logQueue.splice(0, this.options.batchSize);

  try {
    batch.forEach((entry) => {
      if (this.shouldLog(entry.level)) {
        this.writeLog(entry);
      }
    });

    await this.sendToLoggingService(batch);

    if (this.logQueue.length > 0) {
      void this.processQueue();
    }
  } catch (error) {
    console.error('Failed to process log queue:', error);

    if (retryCount < this.options.retryAttempts) {
      this.logQueue.unshift(...batch);
      await new Promise((resolve) =>
        setTimeout(resolve, this.options.retryDelay * Math.pow(2, retryCount)),
      );
      void this.processQueue(retryCount + 1);
    } else {
      void this.handleFailedBatch(batch);
    }
  } finally {
    this.isProcessing = false;
  }
}
```

### Offline Storage

```typescript
private async handleFailedBatch(failedEntries: LogEntry[]): Promise<void> {
  if (!this.options.persistent) return;

  try {
    const existingLogs = await this.getPersistedLogs();
    const updatedLogs = [...existingLogs, ...failedEntries].slice(
      -this.options.maxQueueSize,
    );
    localStorage.setItem('vert_stack_failed_logs', JSON.stringify(updatedLogs));
  } catch (error) {
    console.error('Failed to store failed log entries:', error);
  }
}
```

### Performance Metric Tracking

```typescript
interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: Date;
}

public startMetric(name: string, metadata?: Record<string, unknown>): void {
  this.timings.set(name, {
    startTime: performance.now(),
    metadata,
  });
}

public endMetric(name: string, warningThreshold?: number): void {
  const timing = this.timings.get(name);
  if (!timing) return;

  const duration = performance.now() - timing.startTime;
  this.timings.delete(name);

  if (this.metrics.length >= this.MAX_RETAINED_METRICS) {
    this.metrics = this.metrics.slice(-this.MAX_RETAINED_METRICS + 1);
  }

  this.metrics.push({
    name,
    duration,
    timestamp: new Date(),
  });

  if (warningThreshold && duration > warningThreshold) {
    this.warn(`Performance threshold exceeded for ${name}`, {
      category: 'Performance',
      duration,
      threshold: warningThreshold,
      metadata: timing.metadata,
    });
  }
}
```

### Security Event Logging

```typescript
public logSecurityEvent(
  eventType: string,
  severity: 'low' | 'medium' | 'high' | 'critical',
  details?: Record<string, unknown>,
): void {
  const level: LogLevel =
    severity === 'critical'
      ? 'fatal'
      : severity === 'high'
        ? 'error'
        : severity === 'medium'
          ? 'warn'
          : 'info';

  this.addToQueue(level, `Security Event: ${eventType}`, {
    category: 'Security',
    severity,
    ...(details || {}),
  });
}
```

### Business Event Logging

```typescript
public logBusinessEvent(
  eventName: string,
  success: boolean,
  details?: Record<string, unknown>,
): void {
  this.addToQueue(success ? 'info' : 'error', `Business Event: ${eventName}`, {
    category: 'Business',
    success,
    ...(details || {}),
  });
}
```

### Request Logging

```typescript
public logRequest(
  method: string,
  url: string,
  status: number,
  duration: number,
  details?: Record<string, unknown>,
): void {
  const level: LogLevel =
    status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';

  this.addToQueue(level, `${method} ${url} ${status}`, {
    category: 'API',
    duration,
    status,
    ...(details || {}),
  });
}
```

## Usage Examples

### Basic Logging

```typescript
// Initialize logger
const logger = Logger.getInstance({
  maxQueueSize: 1000,
  batchSize: 10,
  retryAttempts: 3,
  retryDelay: 1000,
  minLevel: 'info',
  persistent: true,
});

// Basic logging
logger.info('Application started');

// Structured logging
logger.info('User action', {
  userId: 123,
  action: 'login',
  category: 'Authentication',
});

// Error logging
try {
  // ... operation
} catch (error) {
  logger.error('Operation failed', {
    error,
    category: 'Database',
    operation: 'insert',
  });
}
```

### Performance Tracking

```typescript
// Start tracking
logger.startMetric('database-query');

// ... perform operation

// End tracking with threshold warning
logger.endMetric('database-query', 1000); // Warns if over 1000ms

// Get performance summary
const metrics = logger.getMetricsSummary('database-query');
// Returns: { count, average, min, max, latest }
```

### Request Tracking

```typescript
// Track HTTP requests
logger.logRequest(
  'GET',
  '/api/users',
  200,
  150, // duration in ms
  { userId: 123, query: { page: 1 } },
);

// With correlation ID
logger.setCorrelationId('req-123');
logger.info('Processing request');
logger.debug('Validation passed');
logger.info('Request completed');
logger.clearCorrelationId();
```

### Security Events

```typescript
logger.logSecurityEvent('Failed login attempt', 'medium', {
  username: 'user@example.com',
  ipAddress: '192.168.1.1',
  attemptCount: 3,
});

logger.logSecurityEvent('Unauthorized access', 'high', {
  resource: '/admin',
  user: 'guest',
});
```

### Business Events

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

## Integration Examples

### Error Boundary Integration

```typescript
class ErrorBoundary extends Component<Props, State> {
  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('Uncaught error in component', {
      error,
      errorInfo,
      componentStack: errorInfo.componentStack,
      location: window.location.href,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### API Integration

```typescript
try {
  const response = await fetch(url);

  logger.logRequest(
    'GET',
    url,
    response.status,
    performance.now() - startTime,
    { responseSize: response.headers.get('content-length') },
  );
} catch (error) {
  logger.error('API Error:', {
    error,
    url,
    timestamp: new Date().toISOString(),
  });
}
```

## Testing

```typescript
describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maintains singleton instance', () => {
    const logger1 = Logger.getInstance();
    const logger2 = Logger.getInstance();
    expect(logger1).toBe(logger2);
  });

  it('logs messages with correct level', () => {
    const logger = Logger.getInstance({
      maxQueueSize: 10,
      minLevel: 'trace',
    });

    logger.info('Info message');
    logger.warn('Warning message');
    logger.error('Error message');

    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('Info message'),
      undefined,
    );
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('Warning message'),
      undefined,
    );
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Error message'),
      undefined,
    );
  });

  it('handles queue size limits', () => {
    const logger = Logger.getInstance({
      maxQueueSize: 2,
      minLevel: 'trace',
    });

    logger.info('Message 1');
    expect(logger.getQueueLength()).toBe(1);

    logger.info('Message 2');
    expect(logger.getQueueLength()).toBe(2);

    logger.info('Message 3');
    expect(logger.getQueueLength()).toBe(2);
  });
});
```

## Integration with External Services

The logger is designed to be easily integrated with external logging services. The `sendToLoggingService` method can be implemented to send logs to your preferred service:

```typescript
private async sendToLoggingService(entries: LogEntry[]): Promise<void> {
  // Implementation for your logging service
  // Example: Splunk, ELK, CloudWatch, etc.
}
```

## Production Best Practices

1. **Queue Management**

   - Monitor queue size using `getQueueLength()`
   - Clear queue when needed with `clear()`
   - Configure appropriate `maxQueueSize` for your environment
   - Monitor failed batch handling

2. **Error Handling**

   - Enable persistence for offline resilience
   - Configure retry attempts based on network reliability
   - Monitor failed batch handling
   - Set appropriate retry delays

3. **Performance Tracking**

   - Use startMetric/endMetric for critical operations
   - Set appropriate warning thresholds
   - Monitor metric summaries regularly
   - Clear metrics when no longer needed

4. **Memory Management**

   - Clear metrics periodically
   - Configure appropriate rotation sizes
   - Monitor metric retention limits
   - Handle queue overflow gracefully

5. **Security Considerations**
   - Sanitize sensitive data before logging
   - Use appropriate log levels
   - Implement proper log rotation
   - Monitor security events closely

## Related Documentation

- [Error Handling](./error-handling.md)
- [Performance Monitoring](./performance-monitoring.md)
- [Security](../architecture/security.md)
- [Testing Guidelines](../development/testing-guidelines.md)
