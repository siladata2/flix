import { describe, it, expect } from 'vitest';
import { movieInputSchema, contactFormSchema, registerSchema } from '@/lib/validations';

describe('movieInputSchema', () => {
  it('accepts a valid movie payload', () => {
    const result = movieInputSchema.safeParse({ title: 'Redline', slug: 'redline', release_year: 2025 });
    expect(result.success).toBe(true);
  });
  it('rejects an uppercase slug', () => {
    const result = movieInputSchema.safeParse({ title: 'Redline', slug: 'Redline' });
    expect(result.success).toBe(false);
  });
});

describe('contactFormSchema', () => {
  it('rejects a filled honeypot field implicitly via route logic, but schema itself accepts it', () => {
    const result = contactFormSchema.safeParse({ name: 'A', email: 'a@b.com', subject: 'Hi', message: '1234567890', website: 'bot-filled' });
    expect(result.success).toBe(true); // schema allows it; route.ts discards on this condition
  });
  it('rejects a too-short message', () => {
    const result = contactFormSchema.safeParse({ name: 'A', email: 'a@b.com', subject: 'Hi', message: 'short' });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({ email: 'a@b.com', password: 'password1', confirmPassword: 'password2', displayName: 'A' });
    expect(result.success).toBe(false);
  });
});
