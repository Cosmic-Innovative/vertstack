import { describe, it, expect, vi, beforeEach } from 'vitest';
import { trackNotFound } from './not-found-utils';
import { logger } from './logger';

vi.mock('./logger', () => ({
  logger: {
    warn: vi.fn(),
  },
}));

describe('not-found-utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { pathname: '/test-path' },
      writable: true,
    });
    // Mock document.referrer
    Object.defineProperty(document, 'referrer', {
      value: 'https://example.com',
      writable: true,
    });
  });

  it('logs 404 events correctly', () => {
    trackNotFound('en');

    expect(logger.warn).toHaveBeenCalledWith(
      '404 Page Not Found',
      expect.objectContaining({
        category: 'Navigation',
        event: expect.objectContaining({
          path: '/test-path',
          referrer: 'https://example.com',
          language: 'en',
        }),
      }),
    );
  });

  it('handles missing referrer', () => {
    Object.defineProperty(document, 'referrer', {
      value: '',
      writable: true,
    });

    trackNotFound('en');

    expect(logger.warn).toHaveBeenCalledWith(
      '404 Page Not Found',
      expect.objectContaining({
        event: expect.objectContaining({
          referrer: null,
        }),
      }),
    );
  });
});
