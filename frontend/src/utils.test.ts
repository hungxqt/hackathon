import { describe, it, expect } from 'vitest';
import { formatMessage } from './utils';

describe('formatMessage', () => {
  it('should format a string to uppercase', () => {
    expect(formatMessage('hello world', 'uppercase')).toBe('HELLO WORLD');
  });

  it('should format a string to lowercase', () => {
    expect(formatMessage('HELLO WORLD', 'lowercase')).toBe('hello world');
  });

  it('should format a string to titlecase', () => {
    expect(formatMessage('hello world from typescript', 'titlecase')).toBe('Hello World From Typescript');
    expect(formatMessage('hello', 'titlecase')).toBe('Hello');
  });

  it('should fallback to returning original string for unknown cases', () => {
    // Cast to any to test runtime fallback behavior
    expect(formatMessage('Hello World', 'unknown' as any)).toBe('Hello World');
  });
});
