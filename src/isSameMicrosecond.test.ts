import { describe, it, expect } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { isSameMicrosecond } from './isSameMicrosecond';

describe('isSameMicrosecond', () => {
  it('returns true for same microsecond in same timezone', () => {
    const time1 = Temporal.ZonedDateTime.from(
      '2025-01-20T14:30:45.123456Z[UTC]'
    );
    const time2 = Temporal.ZonedDateTime.from(
      '2025-01-20T14:30:45.123456999Z[UTC]'
    );

    expect(isSameMicrosecond(time1, time2)).toBe(true);
  });

  it('returns false for different microseconds in same timezone', () => {
    const us456 = Temporal.ZonedDateTime.from(
      '2025-01-20T14:30:45.123456Z[UTC]'
    );
    const us457 = Temporal.ZonedDateTime.from(
      '2025-01-20T14:30:45.123457Z[UTC]'
    );

    expect(isSameMicrosecond(us456, us457)).toBe(false);
  });

  it('returns false for different microseconds across timezones', () => {
    const ny = Temporal.ZonedDateTime.from(
      '2025-01-20T14:30:45.123456-05:00[America/New_York]'
    );
    const tokyo = Temporal.ZonedDateTime.from(
      '2025-01-21T04:30:45.987654+09:00[Asia/Tokyo]'
    );

    // Same instant, different local microseconds
    expect(isSameMicrosecond(ny, tokyo)).toBe(false);
  });

  it('returns true when comparing same instant in different timezones after conversion', () => {
    const ny = Temporal.ZonedDateTime.from(
      '2025-01-20T14:30:45.123456-05:00[America/New_York]'
    );
    const tokyo = Temporal.ZonedDateTime.from(
      '2025-01-21T04:30:45.123456+09:00[Asia/Tokyo]'
    );

    // Convert to UTC to compare
    expect(
      isSameMicrosecond(ny.withTimeZone('UTC'), tokyo.withTimeZone('UTC'))
    ).toBe(true);

    // Convert to NY timezone
    expect(isSameMicrosecond(ny, tokyo.withTimeZone('America/New_York'))).toBe(
      true
    );
  });

  it('handles Instant inputs by converting to UTC', () => {
    const instant1 = Temporal.Instant.from('2025-01-20T14:30:45.123456789Z');
    const instant2 = Temporal.Instant.from('2025-01-20T14:30:45.123456999Z');

    expect(isSameMicrosecond(instant1, instant2)).toBe(true);
  });

  it('returns false for different milliseconds even with same microsecond value', () => {
    const time1 = Temporal.ZonedDateTime.from(
      '2025-01-20T14:30:45.123456Z[UTC]'
    );
    const time2 = Temporal.ZonedDateTime.from(
      '2025-01-20T14:30:45.124456Z[UTC]'
    );

    expect(isSameMicrosecond(time1, time2)).toBe(false);
  });

  it('handles mixed Instant and ZonedDateTime inputs', () => {
    const instant = Temporal.Instant.from('2025-01-20T14:30:45.123456Z');
    const zoned = Temporal.ZonedDateTime.from(
      '2025-01-20T14:30:45.123456999Z[UTC]'
    );

    expect(isSameMicrosecond(instant, zoned)).toBe(true);
  });
});
