import { Temporal as Polyfill } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vitest';
import { isBefore, isAfter, isPast, isFuture, isWithinInterval, eachHourOfInterval, eachMinuteOfInterval, eachWeekOfInterval } from './index';

const Native = (globalThis as unknown as { Temporal?: typeof Polyfill }).Temporal;

describe.skipIf(!Native)('native/polyfill timeline interoperability', () => {
  for (const [name, left, right] of [
    ['polyfill/native', Polyfill, Native],
    ['native/polyfill', Native, Polyfill],
    ['native/native', Native, Native],
  ] as const) {
    it(`${name} compares exact instants in the production and native test configurations`, () => {
      const start = left!.ZonedDateTime.from('2025-01-20T12:00[America/New_York]');
      const end = right!.ZonedDateTime.from('2025-01-20T14:00[America/New_York]');
      expect(isBefore(start, end)).toBe(true);
      expect(isAfter(end, start)).toBe(true);
      expect(isBefore(start, end.subtract({ hours: 2 }))).toBe(false);
      expect(isWithinInterval(start, { start, end })).toBe(true);
      expect(isPast(left!.Instant.from('1970-01-01T00:00Z'))).toBe(true);
      expect(isFuture(right!.Instant.from('2100-01-01T00:00Z'))).toBe(true);
    });

    it(`${name} enumerates clock and week boundaries without static-object brand assumptions`, () => {
      const start = left!.ZonedDateTime.from('2025-01-20T12:00[America/New_York]');
      const end = right!.ZonedDateTime.from('2025-01-20T14:00[America/New_York]');
      expect(eachHourOfInterval({ start, end })).toHaveLength(3);
      expect(eachMinuteOfInterval({ start, end })).toHaveLength(121);
      expect(eachWeekOfInterval({ start, end })[0]!.toString()).toBe('2025-01-20T00:00:00-05:00[America/New_York]');
    });
  }
});
