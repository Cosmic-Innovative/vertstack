# VERT Stack Advanced Logging System

## Overview

The VERT Stack includes a comprehensive, type-safe logging system designed for production applications. It features structured logging, performance tracking, and robust error handling with offline capabilities.

## Key Features

- **Type-Safe Logging Levels**

  - trace: Detailed debugging information
  - debug: Development debugging
  - info: General information
  - warn: Warning messages
  - error: Error conditions
  - fatal: Critical failures

- **Structured Data**

  - Categories for organized logging
  - Correlation IDs for request tracking
  - Metadata support
  - Custom tags

- **Performance Monitoring**

  - Metric tracking
  - Duration measurements
  - Threshold warnings
  - Performance summaries

- **Security & Error Handling**
  - Security event logging
  - Error categorization
  - Offline storage
  - Retry mechanisms

## Usage Examples

### Basic Logging

```typescript
import { logger } from '../utils/logger';

// Simple logging
logger.info('Application started');

// Structured logging with details
logger.info('User action', {
  userId: 123,
  action: 'login',
  category: 'Authentication',
});

// Error logging
try {
  // ... some operation
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
// Basic metric tracking
logger.startMetric('database-query');
// ... perform operation
logger.endMetric('database-query');

// With metadata and threshold warning
logger.startMetric('api-call', { endpoint: '/users' });
// ... make API call
logger.endMetric('api-call', 1000); // Warns if over 1000ms

// Get performance summary
const metrics = logger.getMetricsSummary('api-call');
console.log(metrics); // { count, average, min, max, latest }
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

## Configuration

```typescript
const logger = Logger.getInstance({
  maxQueueSize: 1000, // Maximum queue size
  batchSize: 10, // Batch processing size
  retryAttempts: 3, // Number of retry attempts
  retryDelay: 1000, // Delay between retries (ms)
  minLevel: 'info', // Minimum log level
  persistent: true, // Enable offline storage
});
```

## Best Practices

1. **Log Levels**

   - Use `trace` for detailed debugging
   - Use `debug` for development information
   - Use `info` for general operational events
   - Use `warn` for concerning but non-error conditions
   - Use `error` for error conditions
   - Use `fatal` for system-critical failures

2. **Categories**

   - Use consistent categories across your application
   - Keep category names concise but descriptive
   - Use hierarchical categories (e.g., 'Database.Query')

3. **Performance Tracking**

   - Set appropriate thresholds for your operations
   - Track related operations with the same metric name
   - Clear metrics periodically to manage memory

4. **Error Handling**
   - Include relevant context with errors
   - Use correlation IDs for related events
   - Handle offline scenarios appropriately

## Type Definitions

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
  details?: unknown;
  timestamp: Date;
  category?: LogCategory;
  correlationId?: string;
  metadata?: Record<string, unknown>;
  tags?: string[];
}
```

## Production Considerations

1. **Performance**

   - Set appropriate batch sizes for your environment
   - Monitor queue size to prevent memory issues
   - Use appropriate log levels in production

2. **Security**

   - Avoid logging sensitive information
   - Use appropriate security event levels
   - Implement proper log rotation

3. **Monitoring**

   - Monitor failed log entries
   - Track performance metrics regularly
   - Set up alerts for critical events

4. **Storage**
   - Implement proper log rotation
   - Monitor local storage usage
   - Handle storage failures gracefully

## Integration with External Services

The logger is designed to be easily integrated with external logging services. The `sendToLoggingService` method can be implemented to send logs to your preferred service:

```typescript
private async sendToLoggingService(entries: LogEntry[]): Promise<void> {
  // Implementation for your logging service
  // Example: Splunk, ELK, CloudWatch, etc.
}
```

Would you like me to add more examples or expand on any particular section?
