import { describe, it, expect } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { isSameNanosecond } from './isSameNanosecond';

describe('isSameNanosecond', () => {
  it('returns true for exact same nanosecond in same timezone', () => {
    const time1 = Temporal.ZonedDateTime.from(
      '2025-01-20T14:30:45.123456789Z[UTC]'
    );
    const time2 = Temporal.ZonedDateTime.from(
      '2025-01-20T14:30:45.123456789Z[UTC]'
    );

    expect(isSameNanosecond(time1, time2)).toBe(true);
  });

  it('returns false for different nanoseconds in same timezone', () => {
    const ns789 = Temporal.ZonedDateTime.from(
      '2025-01-20T14:30:45.123456789Z[UTC]'
    );
    const ns790 = Temporal.ZonedDateTime.from(
      '2025-01-20T14:30:45.123456790Z[UTC]'
    );

    expect(isSameNanosecond(ns789, ns790)).toBe(false);
  });

  it('returns false for different nanoseconds across timezones', () => {
    const ny = Temporal.ZonedDateTime.from(
      '2025-01-20T14:30:45.123456789-05:00[America/New_York]'
    );
    const tokyo = Temporal.ZonedDateTime.from(
      '2025-01-21T04:30:45.987654321+09:00[Asia/Tokyo]'
    );

    // Same instant, different local nanoseconds
    expect(isSameNanosecond(ny, tokyo)).toBe(false);
  });

  it('returns true when comparing same instant in different timezones after conversion', () => {
    const ny = Temporal.ZonedDateTime.from(
      '2025-01-20T14:30:45.123456789-05:00[America/New_York]'
    );
    const tokyo = Temporal.ZonedDateTime.from(
      '2025-01-21T04:30:45.123456789+09:00[Asia/Tokyo]'
    );

    // Convert to UTC to compare
    expect(
      isSameNanosecond(ny.withTimeZone('UTC'), tokyo.withTimeZone('UTC'))
    ).toBe(true);

    // Convert to NY timezone
    expect(isSameNanosecond(ny, tokyo.withTimeZone('America/New_York'))).toBe(
      true
    );
  });

  it('handles Instant inputs by converting to UTC', () => {
    const instant1 = Temporal.Instant.from('2025-01-20T14:30:45.123456789Z');
    const instant2 = Temporal.Instant.from('2025-01-20T14:30:45.123456789Z');

    expect(isSameNanosecond(instant1, instant2)).toBe(true);
  });

  it('returns false for different microseconds even with same nanosecond value', () => {
    const time1 = Temporal.ZonedDateTime.from(
      '2025-01-20T14:30:45.123456789Z[UTC]'
    );
    const time2 = Temporal.ZonedDateTime.from(
      '2025-01-20T14:30:45.123457789Z[UTC]'
    );

    expect(isSameNanosecond(time1, time2)).toBe(false);
  });

  it('handles mixed Instant and ZonedDateTime inputs', () => {
    const instant = Temporal.Instant.from('2025-01-20T14:30:45.123456789Z');
    const zoned = Temporal.ZonedDateTime.from(
      '2025-01-20T14:30:45.123456789Z[UTC]'
    );

    expect(isSameNanosecond(instant, zoned)).toBe(true);
  });

  it('represents exact instant equality for precise comparisons', () => {
    const base = Temporal.ZonedDateTime.from(
      '2025-01-20T14:30:45.123456789Z[UTC]'
    );
    const oneNanoLater = Temporal.ZonedDateTime.from(
      '2025-01-20T14:30:45.123456790Z[UTC]'
    );

    // Even 1 nanosecond difference is detectable
    expect(isSameNanosecond(base, oneNanoLater)).toBe(false);
  });
});
