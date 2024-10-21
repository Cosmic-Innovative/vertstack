import { describe, it, expect, vi } from 'vitest';
import { fetchData, sanitizeInput } from './api';

global.fetch = vi.fn();

describe('api utilities', () => {
  describe('fetchData', () => {
    it('fetches data successfully', async () => {
      const mockData = { id: 1, name: 'Test' };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockData)),
      });

      const result = await fetchData('https://api.example.com/data');
      expect(result).toEqual(mockData);
    });

    it('throws an error for non-ok response', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      // Suppress console.error for this test
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await expect(fetchData('https://api.example.com/data')).rejects.toThrow(
        'HTTP error! status: 404',
      );

      // Restore console.error
      consoleSpy.mockRestore();
    });

    it('throws an error for invalid URL protocol', async () => {
      // Suppress console.error for this test
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await expect(fetchData('ftp://api.example.com/data')).rejects.toThrow(
        'Invalid URL protocol',
      );

      // Restore console.error
      consoleSpy.mockRestore();
    });
  });

  describe('sanitizeInput', () => {
    it('sanitizes HTML special characters', () => {
      const input = '<script>alert("xss")</script>';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
      );
    });

    it('handles strings with no special characters', () => {
      const input = 'Hello, World!';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toBe('Hello, World!');
    });

    it('sanitizes multiple special characters', () => {
      const input = 'a < b && c > d';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toBe('a &lt; b &amp;&amp; c &gt; d');
    });

    it('sanitizes all HTML special characters', () => {
      const input = '&<>"\'';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toBe('&amp;&lt;&gt;&quot;&#39;');
    });
  });
});
