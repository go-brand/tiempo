import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Temporal } from './shared/temporal';
import { isToday } from './isToday';
import { isTomorrow } from './isTomorrow';
import { isYesterday } from './isYesterday';

// 2025-01-20 in UTC and Los Angeles; already 2025-01-21 in Tokyo.
const NOW = Temporal.Instant.from('2025-01-20T23:30:00Z');

describe('isToday, isTomorrow, isYesterday', () => {
  beforeEach(() => {
    vi.spyOn(Temporal.Now, 'zonedDateTimeISO').mockImplementation((timezone) =>
      NOW.toZonedDateTimeISO(timezone!)
    );
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('compares a PlainDate to the current date in the given timezone', () => {
    const jan20 = Temporal.PlainDate.from('2025-01-20');
    const jan21 = Temporal.PlainDate.from('2025-01-21');

    expect(isToday(jan20, 'UTC')).toBe(true);
    expect(isToday(jan20, 'Asia/Tokyo')).toBe(false);
    expect(isYesterday(jan20, 'Asia/Tokyo')).toBe(true);
    expect(isToday(jan21, 'Asia/Tokyo')).toBe(true);
    expect(isTomorrow(jan21, 'America/Los_Angeles')).toBe(true);
  });

  it('takes an Instant date in the given timezone', () => {
    const instant = Temporal.Instant.from('2025-01-21T01:00:00Z'); // Jan 21 in UTC, Jan 20 17:00 in LA

    expect(isTomorrow(instant, 'UTC')).toBe(true);
    expect(isToday(instant, 'America/Los_Angeles')).toBe(true);
  });

  it('converts a ZonedDateTime to the given timezone before taking its date', () => {
    const laEvening = Temporal.ZonedDateTime.from('2025-01-20T10:00:00-08:00[America/Los_Angeles]'); // Jan 21 03:00 in Tokyo

    expect(isToday(laEvening, 'America/Los_Angeles')).toBe(true);
    expect(isToday(laEvening, 'Asia/Tokyo')).toBe(true);
    expect(isYesterday(laEvening, 'Asia/Tokyo')).toBe(false);
  });

  it('returns false for dates further away', () => {
    expect(isTomorrow(Temporal.PlainDate.from('2025-01-22'), 'UTC')).toBe(false);
    expect(isYesterday(Temporal.PlainDate.from('2025-01-18'), 'UTC')).toBe(false);
  });

  it('accepts non-ISO calendar dates', () => {
    expect(isToday(Temporal.PlainDate.from('2025-01-20').withCalendar('hebrew'), 'UTC')).toBe(true);
  });
});

describe('isToday with the real clock', () => {
  it('is true for the current instant in any timezone', () => {
    const now = Temporal.Now.instant();

    expect(isToday(now, 'UTC')).toBe(true);
    expect(isToday(now, 'Pacific/Kiritimati')).toBe(true);
    expect(isToday(now, 'Pacific/Pago_Pago')).toBe(true);
  });
});
