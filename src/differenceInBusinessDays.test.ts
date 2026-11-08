import { describe, expect, it } from 'vitest';
import { Temporal } from './shared/temporal';
import { differenceInBusinessDays } from './differenceInBusinessDays';

const date = (iso: string) => Temporal.PlainDate.from(iso);

describe('differenceInBusinessDays', () => {
  it('counts weekdays from the earlier date up to the later date', () => {
    expect(differenceInBusinessDays(date('2025-01-31'), date('2025-01-24'))).toBe(5);
    expect(differenceInBusinessDays(date('2025-01-27'), date('2025-01-24'))).toBe(1); // Fri -> Mon
    expect(differenceInBusinessDays(date('2025-01-24'), date('2025-01-20'))).toBe(4); // Mon -> Fri
  });

  it('counts zero across a weekend start and for the same date', () => {
    expect(differenceInBusinessDays(date('2025-01-27'), date('2025-01-25'))).toBe(0); // Sat -> Mon
    expect(differenceInBusinessDays(date('2025-01-24'), date('2025-01-24'))).toBe(0);
  });

  it('negates when the arguments are swapped, without negative zero', () => {
    const pairs = [
      ['2025-01-31', '2025-01-24'],
      ['2025-01-27', '2025-01-25'],
      ['2025-02-16', '2025-01-01']
    ] as const;

    for (const [a, b] of pairs) {
      expect(differenceInBusinessDays(date(b), date(a))).toBe(
        -differenceInBusinessDays(date(a), date(b)) || 0
      );
    }
    expect(Object.is(differenceInBusinessDays(date('2025-01-25'), date('2025-01-27')), 0)).toBe(
      true
    );
  });

  it('counts long spans', () => {
    // 2025 has 261 weekdays; the exclusive end drops Wednesday 31 December.
    expect(differenceInBusinessDays(date('2025-12-31'), date('2025-01-01'))).toBe(260);
    expect(differenceInBusinessDays(date('2026-01-01'), date('2025-01-01'))).toBe(261);
  });

  it('uses the UTC date for Instant and the local date for ZonedDateTime', () => {
    const fridayNightInNewYork = Temporal.ZonedDateTime.from(
      '2025-01-24T23:00:00-05:00[America/New_York]'
    ); // Saturday in UTC
    const monday = Temporal.Instant.from('2025-01-27T12:00:00Z');

    expect(differenceInBusinessDays(monday, fridayNightInNewYork)).toBe(1);
    expect(differenceInBusinessDays(monday, fridayNightInNewYork.toInstant())).toBe(0);
  });

  it('accepts non-ISO calendar dates', () => {
    expect(
      differenceInBusinessDays(date('2025-01-31'), date('2025-01-24').withCalendar('hebrew'))
    ).toBe(5);
  });

  it('rejects mixed PlainDate and timeline values', () => {
    const instant = Temporal.Instant.from('2025-01-24T00:00:00Z');

    // @ts-expect-error PlainDate and Instant are different domains
    const mixed = () => differenceInBusinessDays(date('2025-01-31'), instant);
    expect(mixed).toThrow(TypeError);
  });
});
