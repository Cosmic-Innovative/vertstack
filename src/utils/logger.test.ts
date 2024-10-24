import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Logger } from './logger';

describe('Logger', () => {
  beforeEach(() => {
    // Reset the singleton instance before each test
    // @ts-expect-error Accessing private static member for testing purposes
    Logger.instance = undefined;

    // Mock console methods
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
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

    // Process queue synchronously
    logger.processQueueSync();

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

    // Fill the queue
    logger.info('Message 1');
    expect(logger.getQueueLength()).toBe(1);

    logger.info('Message 2');
    expect(logger.getQueueLength()).toBe(2);

    // This should trigger the warning
    logger.info('Message 3');

    // Warning should be logged immediately when queue size is exceeded
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('Log queue size exceeded'),
      expect.objectContaining({
        category: 'Logger',
        queueSize: expect.any(Number),
      }),
    );

    // Queue should maintain max size
    expect(logger.getQueueLength()).toBe(2);
  });

  it('clears queue', () => {
    const logger = Logger.getInstance();

    // Add a message
    logger.info('Test message');

    // Queue length should be 1 before clearing
    expect(logger.getQueueLength()).toBe(1);

    // Clear the queue
    logger.clear();

    // Queue should be empty after clearing
    expect(logger.getQueueLength()).toBe(0);
  });
});
