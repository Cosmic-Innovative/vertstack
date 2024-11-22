import { describe, it, expect, vi } from 'vitest';
import { formatDate, formatTime, formatRelativeTime } from './datetime-utils';

describe('datetime-utils', () => {
  const testDate = new Date('2024-01-01T12:00:00Z');

  // Skip a group of related tests with expect assertions
  describe.skip('calendar system conversions', () => {
    it('converts to Buddhist calendar', () => {
      const result = formatDate(testDate, 'th-TH-u-ca-buddhist');
      expect(result).toBeDefined();
    });

    it('converts to Islamic calendar', () => {
      const result = formatDate(testDate, 'ar-SA-u-ca-islamic');
      expect(result).toBeDefined();
    });
  });

  // Mark future test cases (these don't need assertions)
  it.todo('should handle timezone conversions');
  it.todo('should format dates according to religious calendars');

  // Skip temporarily broken tests with expect assertions
  it.skip('formats complex time ranges - fixing DST issues', () => {
    const result = formatTime(testDate, 'en-US');
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });

  it('formats dates correctly', () => {
    expect(formatDate(testDate, 'en-US')).toMatch(/January 1, 2024/);
    expect(formatDate(testDate, 'es')).toMatch(/1 de enero de 2024/);
  });

  it('formats times correctly', () => {
    const result = formatTime(testDate, 'en-US');
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });

  it('formats relative time correctly', () => {
    // Set a fixed system time
    vi.setSystemTime(new Date('2024-01-01T12:00:00Z'));

    // Test tomorrow
    const tomorrow = new Date('2024-01-02T12:00:00Z');
    expect(formatRelativeTime(tomorrow, 'en-US')).toBe('tomorrow');

    // Test yesterday
    const yesterday = new Date('2023-12-31T12:00:00Z');
    expect(formatRelativeTime(yesterday, 'en-US')).toBe('yesterday');

    // Test hours
    const inThreeHours = new Date('2024-01-01T15:00:00Z');
    expect(formatRelativeTime(inThreeHours, 'en-US')).toBe('in 3 hours');

    // Test minutes
    const inTenMinutes = new Date('2024-01-01T12:10:00Z');
    expect(formatRelativeTime(inTenMinutes, 'en-US')).toBe('in 10 minutes');

    // Cleanup
    vi.useRealTimers();
  });
});
