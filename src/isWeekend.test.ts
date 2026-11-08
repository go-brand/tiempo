import { describe, expect, it } from 'vitest';
import { Temporal } from './shared/temporal';
import { isWeekend } from './isWeekend';

describe('isWeekend', () => {
  it('is true on Saturday and Sunday only', () => {
    const week = [
      '2025-01-20',
      '2025-01-21',
      '2025-01-22',
      '2025-01-23',
      '2025-01-24',
      '2025-01-25',
      '2025-01-26'
    ];

    expect(week.map((d) => isWeekend(Temporal.PlainDate.from(d)))).toEqual([
      false,
      false,
      false,
      false,
      false,
      true,
      true
    ]);
  });

  it('reads Instant in UTC and ZonedDateTime in its own timezone', () => {
    const instant = Temporal.Instant.from('2025-01-25T02:00:00Z'); // Saturday in UTC, Friday evening in New York

    expect(isWeekend(instant)).toBe(true);
    expect(isWeekend(instant.toZonedDateTimeISO('America/New_York'))).toBe(false);
  });
});
