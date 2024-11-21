import { addCsrfToken } from './csrf';

export async function fetchData<T>(url: string): Promise<T> {
  try {
    // Validate URL to prevent potential security issues
    const validatedUrl = new URL(url);
    if (!['http:', 'https:'].includes(validatedUrl.protocol)) {
      throw new Error('Invalid URL protocol');
    }

    const headers = new Headers({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    });

    // Add CSRF token to non-GET requests
    if (url.method !== 'GET') {
      addCsrfToken(headers);
    }

    const response = await fetch(validatedUrl.toString(), {
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse JSON safely
    const text = await response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// Function to sanitize user input
export function sanitizeInput(input: string): string {
  const entities: ReadonlyMap<string, string> = new Map([
    ['&', '&amp;'],
    ['<', '&lt;'],
    ['>', '&gt;'],
    ['"', '&quot;'],
    ["'", '&#39;'],
  ]);

  return input.replace(/[&<>"']/g, (char) => entities.get(char) || char);
}
