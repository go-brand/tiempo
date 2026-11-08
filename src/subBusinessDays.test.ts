import { describe, expect, it } from 'vitest';
import { Temporal } from './shared/temporal';
import { subBusinessDays } from './subBusinessDays';

describe('subBusinessDays', () => {
  it('subtracts business days, skipping weekends', () => {
    const monday = Temporal.PlainDate.from('2025-01-27');

    expect(subBusinessDays(monday, 1).toString()).toBe('2025-01-24');
    expect(subBusinessDays(monday, 6).toString()).toBe('2025-01-17');
    expect(subBusinessDays(monday, -1).toString()).toBe('2025-01-28');
  });

  it('keeps zoned results for timeline input', () => {
    const instant = Temporal.Instant.from('2025-01-27T08:00:00Z');

    expect(subBusinessDays(instant, 1).toString()).toBe('2025-01-24T08:00:00+00:00[UTC]');
  });
});
