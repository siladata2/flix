// Run with: npm run test
// NOTE: these have NOT been executed in this environment (no network/npm
// install available here) — run them yourself after `npm install`.
import { describe, it, expect } from 'vitest';
import { slugify, formatRuntime, formatFileSize } from '@/lib/utils';

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('The Long Ember!')).toBe('the-long-ember');
  });
  it('trims leading/trailing hyphens', () => {
    expect(slugify('  --Redline--  ')).toBe('redline');
  });
});

describe('formatRuntime', () => {
  it('formats hours and minutes', () => {
    expect(formatRuntime(131)).toBe('2h 11m');
  });
  it('formats minutes-only under an hour', () => {
    expect(formatRuntime(45)).toBe('45m');
  });
  it('returns empty string for null', () => {
    expect(formatRuntime(null)).toBe('');
  });
});

describe('formatFileSize', () => {
  it('formats GB for large files', () => {
    expect(formatFileSize(1.5 * 1024 ** 3)).toBe('1.5 GB');
  });
  it('formats MB for small files', () => {
    expect(formatFileSize(200 * 1024 ** 2)).toBe('200 MB');
  });
});
