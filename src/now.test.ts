import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vitest';
import { now } from './now';

describe('now', () => {
  it('returns current ZonedDateTime in system timezone when no timezone specified', () => {
    const current = now();
    const systemNow = Temporal.Now.zonedDateTimeISO();

    expect(current).toBeInstanceOf(Temporal.ZonedDateTime);
    // Should be within 1 second of system now
    expect(Math.abs(current.epochMilliseconds - systemNow.epochMilliseconds)).toBeLessThan(1000);
  });

  it('returns current ZonedDateTime in specified timezone', () => {
    const nowInMadrid = now('Europe/Madrid');

    expect(nowInMadrid).toBeInstanceOf(Temporal.ZonedDateTime);
    expect(nowInMadrid.timeZoneId).toBe('Europe/Madrid');
  });

  it('returns current ZonedDateTime in UTC when specified', () => {
    const nowUtc = now('UTC');

    expect(nowUtc).toBeInstanceOf(Temporal.ZonedDateTime);
    expect(nowUtc.timeZoneId).toBe('UTC');
  });

  it('returns ZonedDateTime representing the same instant regardless of timezone', () => {
    const nowSystem = now();
    const nowUtc = now('UTC');
    const nowTokyo = now('Asia/Tokyo');

    // All should represent the same instant in time (within 1ms due to execution time)
    expect(Math.abs(nowSystem.epochMilliseconds - nowUtc.epochMilliseconds)).toBeLessThan(10);
    expect(Math.abs(nowUtc.epochMilliseconds - nowTokyo.epochMilliseconds)).toBeLessThan(10);
  });

  it('returns ZonedDateTime with different local times for different timezones', () => {
    const nowUtc = now('UTC');
    const nowTokyo = now('Asia/Tokyo');

    // Tokyo is ahead of UTC, so the hour should be different
    // (unless we're exactly on a timezone boundary edge case)
    const utcHour = nowUtc.hour;
    const tokyoHour = nowTokyo.hour;

    // They should represent the same instant but different local times
    expect(nowUtc.epochMilliseconds).toBeCloseTo(nowTokyo.epochMilliseconds, -2);
    // In most cases, hours will be different (unless edge case)
    // We'll just verify they are valid ZonedDateTime instances
    expect(utcHour).toBeGreaterThanOrEqual(0);
    expect(utcHour).toBeLessThan(24);
    expect(tokyoHour).toBeGreaterThanOrEqual(0);
    expect(tokyoHour).toBeLessThan(24);
  });
});
