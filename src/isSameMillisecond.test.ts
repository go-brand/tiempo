import { describe, it, expect } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { isSameMillisecond } from './isSameMillisecond';

describe('isSameMillisecond', () => {
  it('returns true for same millisecond in same timezone', () => {
    const time1 = Temporal.ZonedDateTime.from('2025-01-20T14:30:45.123Z[UTC]');
    const time2 = Temporal.ZonedDateTime.from(
      '2025-01-20T14:30:45.123999Z[UTC]'
    );

    expect(isSameMillisecond(time1, time2)).toBe(true);
  });

  it('returns false for different milliseconds in same timezone', () => {
    const ms123 = Temporal.ZonedDateTime.from('2025-01-20T14:30:45.123Z[UTC]');
    const ms124 = Temporal.ZonedDateTime.from('2025-01-20T14:30:45.124Z[UTC]');

    expect(isSameMillisecond(ms123, ms124)).toBe(false);
  });

  it('returns false for different milliseconds across timezones', () => {
    const ny = Temporal.ZonedDateTime.from(
      '2025-01-20T14:30:45.123-05:00[America/New_York]'
    );
    const tokyo = Temporal.ZonedDateTime.from(
      '2025-01-21T04:30:45.987+09:00[Asia/Tokyo]'
    );

    // Same instant, different local milliseconds
    expect(isSameMillisecond(ny, tokyo)).toBe(false);
  });

  it('returns true when comparing same instant in different timezones after conversion', () => {
    const ny = Temporal.ZonedDateTime.from(
      '2025-01-20T14:30:45.123-05:00[America/New_York]'
    );
    const tokyo = Temporal.ZonedDateTime.from(
      '2025-01-21T04:30:45.123+09:00[Asia/Tokyo]'
    );

    // Convert to UTC to compare
    expect(isSameMillisecond(ny.withTimeZone('UTC'), tokyo.withTimeZone('UTC'))).toBe(
      true
    );

    // Convert to NY timezone
    expect(isSameMillisecond(ny, tokyo.withTimeZone('America/New_York'))).toBe(true);
  });

  it('handles Instant inputs by converting to UTC', () => {
    const instant1 = Temporal.Instant.from('2025-01-20T14:30:45.123456Z');
    const instant2 = Temporal.Instant.from('2025-01-20T14:30:45.123999Z');

    expect(isSameMillisecond(instant1, instant2)).toBe(true);
  });

  it('returns false for different seconds even with same millisecond value', () => {
    const time1 = Temporal.ZonedDateTime.from('2025-01-20T14:30:45.123Z[UTC]');
    const time2 = Temporal.ZonedDateTime.from('2025-01-20T14:30:46.123Z[UTC]');

    expect(isSameMillisecond(time1, time2)).toBe(false);
  });

  it('handles mixed Instant and ZonedDateTime inputs', () => {
    const instant = Temporal.Instant.from('2025-01-20T14:30:45.123Z');
    const zoned = Temporal.ZonedDateTime.from('2025-01-20T14:30:45.123999Z[UTC]');

    expect(isSameMillisecond(instant, zoned)).toBe(true);
  });
});
