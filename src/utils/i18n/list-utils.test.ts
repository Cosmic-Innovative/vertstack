import { describe, it, expect } from 'vitest';
import { formatList } from './list-utils';

describe('list-utils', () => {
  it('formats lists correctly', () => {
    const items = ['apple', 'banana', 'orange'];
    expect(formatList(items, 'en-US')).toBe('apple, banana, and orange');
    expect(formatList(items, 'es')).toBe('apple, banana y orange');
  });
});
