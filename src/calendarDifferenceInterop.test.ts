import { Temporal as Polyfill } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vitest';
import {
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInQuarters,
  differenceInYears
} from './index';

const Native = (globalThis as unknown as { Temporal?: typeof Polyfill }).Temporal;
const differences = {
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInQuarters,
  differenceInYears
};
const pairs = [
  ['polyfill/polyfill', Polyfill, Polyfill],
  ['native/native', Native, Native],
  ['polyfill/native', Polyfill, Native],
  ['native/polyfill', Native, Polyfill]
] as const;
const ranges = [
  ['spring DST', '2025-03-08T12:00[America/New_York]', '2025-03-10T12:00[America/New_York]'],
  ['fall DST', '2025-11-01T12:00[America/New_York]', '2025-11-03T12:00[America/New_York]'],
  [
    'half-hour DST',
    '2025-04-05T12:00[Australia/Lord_Howe]',
    '2025-04-07T12:00[Australia/Lord_Howe]'
  ],
  ['month end', '2024-01-31T12:00[UTC]', '2024-02-29T12:00[UTC]'],
  ['leap year', '2024-02-29T12:00[UTC]', '2025-02-28T12:00[UTC]'],
  ['different zones', '2025-03-08T12:00[America/New_York]', '2025-03-11T12:00[Asia/Tokyo]'],
  ['Hebrew leap month', '2024-02-10T12:00[UTC][u-ca=hebrew]', '2024-05-10T12:00[UTC][u-ca=hebrew]'],
  [
    'nanosecond boundary',
    '2025-01-01T00:00:00.000000002[UTC]',
    '2025-01-02T00:00:00.000000001[UTC]'
  ]
] as const;

for (const [pair, Left, Right] of pairs) {
  describe.skipIf(!Left || !Right)(pair, () => {
    for (const [name, difference] of Object.entries(differences)) {
      it.each(ranges)(
        `${name}: %s agrees with same-implementation inputs in either direction`,
        (_label, start, end) => {
          const earlier = Left!.ZonedDateTime.from(start);
          const later = Right!.ZonedDateTime.from(end);
          const baselineEarlier = Polyfill.ZonedDateTime.from(start);
          const baselineLater = Polyfill.ZonedDateTime.from(end);
          for (const fractional of [false, true]) {
            expect(difference(later, earlier, { fractional })).toBeCloseTo(
              difference(baselineLater, baselineEarlier, { fractional }),
              12
            );
            expect(difference(earlier, later, { fractional })).toBeCloseTo(
              difference(baselineEarlier, baselineLater, { fractional }),
              12
            );
          }
          expect(earlier.toString()).toBe(baselineEarlier.toString());
          expect(later.toString()).toBe(baselineLater.toString());
        }
      );

      it(`${name}: supports Instant inputs and mixed timeline types with UTC defaults`, () => {
        const earlier = Left!.Instant.from('2025-01-01T12:00Z');
        const later = Right!.Instant.from('2026-01-01T12:00Z');
        const expected = difference(
          Polyfill.Instant.from(earlier.toString()),
          Polyfill.Instant.from(later.toString()),
          { fractional: true }
        );
        expect(difference(earlier, later, { fractional: true })).toBe(expected);
        expect(difference(earlier.toZonedDateTimeISO('UTC'), later, { fractional: true })).toBe(
          expected
        );
        expect(difference(earlier, later.toZonedDateTimeISO('UTC'), { fractional: true })).toBe(
          expected
        );
        expect(difference(earlier, Right!.Instant.from(earlier.toString()))).toBe(0);
      });
    }

    it('keeps two calendar days across a 47-hour DST interval', () => {
      expect(
        differenceInDays(
          Right!.ZonedDateTime.from(ranges[0][2]),
          Left!.ZonedDateTime.from(ranges[0][1])
        )
      ).toBe(2);
    });

    it.each(['iso8601', 'hebrew'])(
      'supports PlainDate quarters with the %s calendar',
      (calendar) => {
        const earlier = Left!.PlainDate.from(`2024-02-10[u-ca=${calendar}]`);
        const later = Right!.PlainDate.from(`2024-05-10[u-ca=${calendar}]`);
        const baselineEarlier = Polyfill.PlainDate.from(earlier.toString());
        const baselineLater = Polyfill.PlainDate.from(later.toString());
        for (const fractional of [false, true]) {
          expect(differenceInQuarters(later, earlier, { fractional })).toBe(
            differenceInQuarters(baselineLater, baselineEarlier, { fractional })
          );
          expect(differenceInQuarters(earlier, later, { fractional })).toBe(
            differenceInQuarters(baselineEarlier, baselineLater, { fractional })
          );
        }
      }
    );

    it('preserves rejection of incompatible calendars', () => {
      const earlier = Left!.PlainDate.from('2024-02-10');
      const later = Right!.PlainDate.from('2024-05-10[u-ca=hebrew]');
      expect(() => differenceInQuarters(later, earlier)).toThrow(RangeError);
      for (const difference of Object.values(differences)) {
        expect(() =>
          difference(later.toZonedDateTime('UTC'), earlier.toZonedDateTime('UTC'))
        ).toThrow(RangeError);
      }
    });
  });
}
