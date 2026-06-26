import { describe, it, expect } from 'vitest';
import { Temporal as Poly } from '@js-temporal/polyfill';
import {
  Temporal,
  isInstant,
  isZonedDateTime,
  isPlainDate,
} from './temporal';

describe('temporal accessor', () => {
  it('resolves a usable Temporal implementation', () => {
    expect(typeof Temporal.Instant.from).toBe('function');
    expect(Temporal.Instant.from('2025-01-01T00:00:00Z').epochMilliseconds).toBe(
      Date.parse('2025-01-01T00:00:00Z')
    );
  });
});

describe('brand guards (implementation-agnostic)', () => {
  const instant = Poly.Instant.from('2025-01-01T00:00:00Z');
  const zoned = instant.toZonedDateTimeISO('UTC');
  const plain = Poly.PlainDate.from('2025-01-01');

  it('isInstant', () => {
    expect(isInstant(instant)).toBe(true);
    expect(isInstant(zoned)).toBe(false);
    expect(isInstant(plain)).toBe(false);
    expect(isInstant(null)).toBe(false);
    expect(isInstant('2025-01-01T00:00:00Z')).toBe(false);
    expect(isInstant(123)).toBe(false);
  });

  it('isZonedDateTime', () => {
    expect(isZonedDateTime(zoned)).toBe(true);
    expect(isZonedDateTime(instant)).toBe(false);
    expect(isZonedDateTime(plain)).toBe(false);
  });

  it('isPlainDate', () => {
    expect(isPlainDate(plain)).toBe(true);
    expect(isPlainDate(instant)).toBe(false);
    expect(isPlainDate(zoned)).toBe(false);
  });
});
