import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loadPageTranslations } from './page-loader';
import i18n from '../../i18n';
import { logger } from '../../utils/logger';

// Mock the i18n instance
vi.mock('../../i18n', () => ({
  default: {
    hasResourceBundle: vi.fn(),
    addResourceBundle: vi.fn(),
  },
}));

// Mock the logger
vi.mock('../../utils/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

describe('loadPageTranslations with cache', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.mocked(i18n.hasResourceBundle).mockReturnValue(false);
    vi.mocked(i18n.addResourceBundle).mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('uses cached translations when available and valid', async () => {
    const cacheKey = 'vert_i18n_en_home';
    const mockCacheData = { some: 'data' };

    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        data: mockCacheData,
        timestamp: Date.now(),
      }),
    );

    const result = await loadPageTranslations('home', 'en');

    expect(result).toBe(true);
    expect(i18n.addResourceBundle).toHaveBeenCalled();
  });

  it('fetches from network when cache is missing', async () => {
    const result = await loadPageTranslations('home', 'en');

    expect(result).toBe(true);
    expect(i18n.addResourceBundle).toHaveBeenCalled();
  });

  it('returns false for invalid page namespace', async () => {
    // @ts-expect-error Testing invalid input
    const result = await loadPageTranslations('invalid', 'en');

    expect(result).toBe(false);
    expect(logger.error).toHaveBeenCalled();
  });

  it('skips loading if resource bundle already exists', async () => {
    vi.mocked(i18n.hasResourceBundle).mockReturnValue(true);

    const result = await loadPageTranslations('home', 'en');

    expect(result).toBe(true);
    expect(i18n.addResourceBundle).not.toHaveBeenCalled();
  });

  it('handles cache read errors gracefully', async () => {
    // Mock localStorage.getItem to throw
    const mockError = new Error('Storage error');
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw mockError;
    });

    // Mock successful network fetch as fallback
    vi.mock('../../locales/en.json', () => ({ default: { some: 'data' } }), {
      virtual: true,
    });
    vi.mock(
      '../../locales/pages/en/home.json',
      () => ({ default: { home: { some: 'data' } } }),
      { virtual: true },
    );

    const result = await loadPageTranslations('home', 'en');

    expect(result).toBe(true);
    expect(i18n.addResourceBundle).toHaveBeenCalled();
  });
});
