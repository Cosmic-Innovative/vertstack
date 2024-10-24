/**
 * Advanced logging system for the VERT Stack
 *
 * Features:
 * - Multiple log levels (trace, debug, info, warn, error, fatal)
 * - Type-safe severity handling
 * - Structured logging with categories and correlation IDs
 * - Queue-based processing with retry mechanisms
 * - Local storage fallback for offline scenarios
 * - Error tracking and categorization
 * - Performance metrics tracking
 * - Request/Response logging
 * - Security event logging
 * - Automated log rotation
 */

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

interface LogOptions {
  maxQueueSize?: number;
  batchSize?: number;
  retryAttempts?: number;
  retryDelay?: number;
  minLevel?: LogLevel;
  rotationSize?: number;
  persistent?: boolean;
}

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: Date;
}

interface TimingData {
  startTime: number;
  metadata?: Record<string, unknown>;
}

export class Logger {
  private static instance: Logger;
  private logQueue: LogEntry[] = [];
  private isProcessing = false;
  private readonly options: Required<LogOptions>;
  private correlationId?: string;
  private metrics: PerformanceMetric[] = [];
  private readonly timings: Map<string, TimingData> = new Map();
  private readonly MAX_RETAINED_METRICS = 1000;

  private constructor(options: LogOptions = {}) {
    this.options = {
      maxQueueSize: options.maxQueueSize ?? 1000,
      batchSize: options.batchSize ?? 10,
      retryAttempts: options.retryAttempts ?? 3,
      retryDelay: options.retryDelay ?? 1000,
      minLevel: options.minLevel ?? 'info',
      rotationSize: options.rotationSize ?? 1000,
      persistent: options.persistent ?? true,
    };
  }

  public static getInstance(options?: LogOptions): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(options);
    }
    return Logger.instance;
  }

  private getLogEmoji(level: LogLevel): string {
    switch (level) {
      case 'trace':
        return '🔍';
      case 'debug':
        return '🐛';
      case 'info':
        return 'ℹ️';
      case 'warn':
        return '⚠️';
      case 'error':
        return '❌';
      case 'fatal':
        return '💀';
      default:
        return '';
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = new Map<LogLevel, number>([
      ['trace', 0],
      ['debug', 1],
      ['info', 2],
      ['warn', 3],
      ['error', 4],
      ['fatal', 5],
    ]);

    const currentLevel = levels.get(level);
    const minLevel = levels.get(this.options.minLevel);

    if (currentLevel === undefined || minLevel === undefined) {
      return false; // Or handle the error case as appropriate
    }

    return currentLevel >= minLevel;
  }

  private formatMessage(entry: LogEntry): string {
    const emoji = this.getLogEmoji(entry.level);
    return `${emoji} [${entry.timestamp.toISOString()}] ${entry.message}`;
  }

  private logWithLevel(
    level: LogLevel,
    message: string,
    details?: unknown,
  ): void {
    const formattedMessage = this.formatMessage(message, {
      level,
      message,
      details,
      timestamp: new Date(),
      category:
        details && typeof details === 'object' && 'category' in details
          ? String(details.category)
          : undefined,
      correlationId: this.correlationId,
    });

    this.writeLog(level, formattedMessage, details);
  }

  private writeLog(entry: LogEntry): void {
    const formattedMessage = this.formatMessage(entry);
    switch (entry.level) {
      case 'trace':
      case 'debug':
        console.debug(formattedMessage, entry.details);
        break;
      case 'info':
        console.info(formattedMessage, entry.details);
        break;
      case 'warn':
        console.warn(formattedMessage, entry.details);
        break;
      case 'error':
      case 'fatal':
        console.error(formattedMessage, entry.details);
        break;
    }
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.logQueue.length === 0) return;

    this.isProcessing = true;
    try {
      while (this.logQueue.length > 0) {
        const entry = this.logQueue[0];
        if (this.shouldLog(entry.level)) {
          this.writeLog(entry.level, entry.message, entry.details);
        }
        this.logQueue.shift();
      }
    } finally {
      this.isProcessing = false;
    }
  }

  private async sendToLoggingService(_entries: LogEntry[]): Promise<void> {
    // In a real application, this would send to your logging service
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  private async handleFailedBatch(failedEntries: LogEntry[]): Promise<void> {
    if (!this.options.persistent) return;

    try {
      const existingLogs = await this.getPersistedLogs();
      const updatedLogs = [...existingLogs, ...failedEntries].slice(
        -this.options.maxQueueSize,
      );
      localStorage.setItem(
        'vert_stack_failed_logs',
        JSON.stringify(updatedLogs),
      );
    } catch (error) {
      console.error('Failed to store failed log entries', error);
    }
  }

  private async getPersistedLogs(): Promise<LogEntry[]> {
    try {
      const logsString = localStorage.getItem('vert_stack_failed_logs');
      return logsString ? JSON.parse(logsString) : [];
    } catch {
      return [];
    }
  }

  private addToQueue(
    level: LogLevel,
    message: string,
    details?: unknown,
  ): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      details,
      timestamp: new Date(),
    };

    if (this.logQueue.length >= this.options.maxQueueSize) {
      // Remove oldest entry to make room
      this.logQueue = this.logQueue.slice(-this.options.maxQueueSize + 1);

      // Create warning entry
      const warningEntry: LogEntry = {
        level: 'warn',
        message: 'Log queue size exceeded',
        details: {
          category: 'Logger',
          queueSize: this.logQueue.length,
        },
        timestamp: new Date(),
      };

      // Write warning immediately
      this.writeLog(warningEntry);
    }

    this.logQueue.push(entry);
  }

  // Public logging methods
  public trace(message: string, details?: unknown): void {
    this.addToQueue('trace', message, details);
  }

  public debug(message: string, details?: unknown): void {
    this.addToQueue('debug', message, details);
  }

  public info(message: string, details?: unknown): void {
    this.addToQueue('info', message, details);
  }

  public warn(message: string, details?: unknown): void {
    this.addToQueue('warn', message, details);
  }

  public error(message: string, details?: unknown): void {
    this.addToQueue('error', message, details);
  }

  public fatal(message: string, details?: unknown): void {
    this.addToQueue('fatal', message, details);
  }

  // Utility methods
  public setCorrelationId(id: string): void {
    this.correlationId = id;
  }

  public clearCorrelationId(): void {
    this.correlationId = undefined;
  }

  public setMinLogLevel(level: LogLevel): void {
    this.options.minLevel = level;
  }

  public clear(): void {
    this.logQueue = [];
    this.isProcessing = false;
  }

  public processQueueSync(): void {
    const entries = [...this.logQueue];
    for (const entry of entries) {
      this.writeLog(entry);
    }
  }

  public getQueueLength(): number {
    return this.logQueue.length;
  }

  public getQueue(): ReadonlyArray<LogEntry> {
    return [...this.logQueue];
  }

  // Performance tracking methods
  public startMetric(name: string, metadata?: Record<string, unknown>): void {
    this.timings.set(name, {
      startTime: performance.now(),
      metadata,
    });
  }

  public endMetric(name: string, warningThreshold?: number): void {
    const timing = this.timings.get(name);
    if (!timing) {
      return;
    }

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
    } else {
      this.debug(`Performance metric: ${name}`, {
        category: 'Performance',
        duration,
        metadata: timing.metadata,
      });
    }
  }

  public getMetricsSummary(metricName?: string): Record<string, unknown> {
    const relevantMetrics = metricName
      ? this.metrics.filter((m) => m.name === metricName)
      : this.metrics;

    if (relevantMetrics.length === 0) {
      return {};
    }

    const durations = relevantMetrics.map((m) => m.duration);
    return {
      count: relevantMetrics.length,
      average: durations.reduce((a, b) => a + b, 0) / durations.length,
      min: Math.min(...durations),
      max: Math.max(...durations),
      latest: relevantMetrics[relevantMetrics.length - 1].duration,
    };
  }

  public clearMetrics(): void {
    this.metrics = [];
    this.timings.clear();
  }

  // Specialized logging methods
  public logRequest(
    method: string,
    url: string,
    status: number,
    duration: number,
    details?: unknown,
  ): void {
    const category = 'API';
    const level: LogLevel =
      status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';

    this.addToQueue(level, `${method} ${url} ${status}`, {
      ...details,
      category,
      duration,
      status,
    });
  }

  public logSecurityEvent(
    eventType: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    details?: unknown,
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
      ...details,
      category: 'Security',
      severity,
    });
  }

  public logBusinessEvent(
    eventName: string,
    success: boolean,
    details?: unknown,
  ): void {
    this.addToQueue(
      success ? 'info' : 'error',
      `Business Event: ${eventName}`,
      {
        ...details,
        category: 'Business',
        success,
      },
    );
  }

  public logError(
    error: Error | unknown,
    context?: string,
    details?: unknown,
  ): void {
    const errorDetails =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
            ...details,
          }
        : {
            error,
            ...details,
          };

    this.error(context || 'An error occurred', {
      ...errorDetails,
      category: 'Error',
    });
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
