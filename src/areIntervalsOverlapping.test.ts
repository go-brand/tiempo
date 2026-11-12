import { describe, expect, it } from 'vitest';
import { Temporal } from './shared/temporal';
import { areIntervalsOverlapping } from './areIntervalsOverlapping';

const date = (iso: string) => Temporal.PlainDate.from(iso);
const at = (iso: string) => Temporal.Instant.from(iso);
const dates = (start: string, end: string) => ({ start: date(start), end: date(end) });
const times = (start: string, end: string) => ({ start: at(start), end: at(end) });

describe('areIntervalsOverlapping', () => {
  it('detects partial, contained, and identical overlaps in either order', () => {
    const cases = [
      [
        times('2025-01-20T09:00:00Z', '2025-01-20T10:00:00Z'),
        times('2025-01-20T09:30:00Z', '2025-01-20T11:00:00Z')
      ],
      [
        times('2025-01-20T09:00:00Z', '2025-01-20T12:00:00Z'),
        times('2025-01-20T10:00:00Z', '2025-01-20T11:00:00Z')
      ],
      [
        times('2025-01-20T09:00:00Z', '2025-01-20T10:00:00Z'),
        times('2025-01-20T09:00:00Z', '2025-01-20T10:00:00Z')
      ]
    ] as const;
    for (const [a, b] of cases) {
      expect(areIntervalsOverlapping(a, b)).toBe(true);
      expect(areIntervalsOverlapping(b, a)).toBe(true);
    }
  });

  it('treats touching intervals as separate unless inclusive', () => {
    const first = times('2025-01-20T09:00:00Z', '2025-01-20T10:00:00Z');
    const second = times('2025-01-20T10:00:00Z', '2025-01-20T11:00:00Z');
    expect(areIntervalsOverlapping(first, second)).toBe(false);
    expect(areIntervalsOverlapping(second, first)).toBe(false);
    expect(areIntervalsOverlapping(first, second, { inclusive: true })).toBe(true);
    expect(areIntervalsOverlapping(second, first, { inclusive: true })).toBe(true);
  });

  it('returns false for separate intervals even when inclusive', () => {
    const first = times('2025-01-20T09:00:00Z', '2025-01-20T10:00:00Z');
    const later = times('2025-01-20T10:00:00.000000001Z', '2025-01-20T11:00:00Z');
    expect(areIntervalsOverlapping(first, later, { inclusive: true })).toBe(false);
  });

  it('compares Instant and ZonedDateTime endpoints by moment', () => {
    const madrid = {
      start: Temporal.ZonedDateTime.from('2025-01-20T09:00:00+01:00[Europe/Madrid]'),
      end: Temporal.ZonedDateTime.from('2025-01-20T10:00:00+01:00[Europe/Madrid]')
    };
    expect(
      areIntervalsOverlapping(madrid, times('2025-01-20T08:30:00Z', '2025-01-20T09:30:00Z'))
    ).toBe(true);
    expect(
      areIntervalsOverlapping(madrid, times('2025-01-20T09:00:00Z', '2025-01-20T09:30:00Z'))
    ).toBe(false);
  });

  it('compares PlainDate intervals by date', () => {
    expect(
      areIntervalsOverlapping(dates('2025-07-01', '2025-07-04'), dates('2025-07-04', '2025-07-08'))
    ).toBe(false);
    expect(
      areIntervalsOverlapping(
        dates('2025-07-01', '2025-07-04'),
        dates('2025-07-04', '2025-07-08'),
        { inclusive: true }
      )
    ).toBe(true);
    expect(
      areIntervalsOverlapping(dates('2025-07-01', '2025-07-05'), dates('2025-07-04', '2025-07-08'))
    ).toBe(true);
    expect(
      areIntervalsOverlapping(
        { start: date('2025-07-01').withCalendar('hebrew'), end: date('2025-07-05') },
        dates('2025-07-04', '2025-07-08')
      )
    ).toBe(true);
  });

  it('accepts zero-length intervals', () => {
    const point = times('2025-01-20T09:30:00Z', '2025-01-20T09:30:00Z');
    const hour = times('2025-01-20T09:00:00Z', '2025-01-20T10:00:00Z');
    expect(areIntervalsOverlapping(point, hour)).toBe(true);
    expect(
      areIntervalsOverlapping(times('2025-01-20T09:00:00Z', '2025-01-20T09:00:00Z'), hour)
    ).toBe(false);
  });

  it('rejects reversed intervals', () => {
    const reversed = times('2025-01-20T10:00:00Z', '2025-01-20T09:00:00Z');
    const hour = times('2025-01-20T09:00:00Z', '2025-01-20T10:00:00Z');
    expect(() => areIntervalsOverlapping(reversed, hour)).toThrow(RangeError);
    expect(() => areIntervalsOverlapping(hour, reversed)).toThrow(RangeError);
  });

  it('rejects mixed PlainDate and timeline intervals', () => {
    const hour = times('2025-01-20T09:00:00Z', '2025-01-20T10:00:00Z');
    // @ts-expect-error PlainDate and timeline intervals are different domains
    expect(() => areIntervalsOverlapping(dates('2025-01-20', '2025-01-21'), hour)).toThrow(
      TypeError
    );
    expect(() =>
      // @ts-expect-error PlainDate and timeline endpoints are different domains
      areIntervalsOverlapping({ start: date('2025-01-20'), end: at('2025-01-21T00:00:00Z') }, hour)
    ).toThrow(TypeError);
  });
});
