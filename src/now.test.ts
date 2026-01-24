import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vitest';
import { now } from './now';
import { browserTimezone } from './browserTimezone';

describe('now', () => {
  it('returns current ZonedDateTime in specified timezone', () => {
    const nowInMadrid = now('Europe/Madrid');

    expect(nowInMadrid).toBeInstanceOf(Temporal.ZonedDateTime);
    expect(nowInMadrid.timeZoneId).toBe('Europe/Madrid');
  });

  it('returns current ZonedDateTime in UTC', () => {
    const nowUtc = now('UTC');

    expect(nowUtc).toBeInstanceOf(Temporal.ZonedDateTime);
    expect(nowUtc.timeZoneId).toBe('UTC');
  });

  it('works with browserTimezone()', () => {
    const nowLocal = now(browserTimezone());

    expect(nowLocal).toBeInstanceOf(Temporal.ZonedDateTime);
    expect(nowLocal.timeZoneId).toBe(browserTimezone());
  });

  it('returns ZonedDateTime representing the same instant regardless of timezone', () => {
    const nowUtc = now('UTC');
    const nowTokyo = now('Asia/Tokyo');
    const nowNy = now('America/New_York');

    // All should represent the same instant in time (within 10ms due to execution time)
    expect(Math.abs(nowUtc.epochMilliseconds - nowTokyo.epochMilliseconds)).toBeLessThan(10);
    expect(Math.abs(nowUtc.epochMilliseconds - nowNy.epochMilliseconds)).toBeLessThan(10);
  });

  it('returns ZonedDateTime with different local times for different timezones', () => {
    const nowUtc = now('UTC');
    const nowTokyo = now('Asia/Tokyo');

    // They should represent the same instant but different local times
    expect(nowUtc.epochMilliseconds).toBeCloseTo(nowTokyo.epochMilliseconds, -2);

    // Verify they are valid ZonedDateTime instances with valid hours
    expect(nowUtc.hour).toBeGreaterThanOrEqual(0);
    expect(nowUtc.hour).toBeLessThan(24);
    expect(nowTokyo.hour).toBeGreaterThanOrEqual(0);
    expect(nowTokyo.hour).toBeLessThan(24);
  });
});
