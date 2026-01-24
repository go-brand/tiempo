import { describe, expect, it } from 'vitest';
import { browserTimezone } from './browserTimezone';

describe('browserTimezone', () => {
  it('returns a valid IANA timezone string', () => {
    const tz = browserTimezone();

    expect(typeof tz).toBe('string');
    expect(tz.length).toBeGreaterThan(0);
    // IANA timezones contain a slash (e.g., "America/New_York") or are "UTC"
    expect(tz === 'UTC' || tz.includes('/')).toBe(true);
  });

  it('returns a consistent value', () => {
    const tz1 = browserTimezone();
    const tz2 = browserTimezone();

    expect(tz1).toBe(tz2);
  });
});
