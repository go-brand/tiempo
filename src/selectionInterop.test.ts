import { Temporal as Polyfill } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vitest';
import {
  addBusinessDays,
  clamp,
  closestTo,
  compareAsc,
  differenceInBusinessDays,
  isEqual,
  isWeekend,
  max,
  min
} from './index';

const Native = (globalThis as unknown as { Temporal?: typeof Polyfill }).Temporal;

describe.skipIf(!Native)('native/polyfill selection and business-day interoperability', () => {
  for (const [name, left, right] of [
    ['polyfill/native', Polyfill, Native],
    ['native/polyfill', Native, Polyfill]
  ] as const) {
    it(`${name} orders and selects timeline values`, () => {
      const early = left!.Instant.from('2025-01-20T15:00:00Z');
      const late = right!.ZonedDateTime.from('2025-01-20T11:00:00-05:00[America/New_York]');

      expect(compareAsc(early, late)).toBe(-1);
      expect(isEqual(early, late.subtract({ hours: 1 }))).toBe(true);
      expect(min([late, early])).toBe(early);
      expect(max([early, late])).toBe(late);
      expect(clamp(late, { start: early, end: early })).toBe(early);
      expect(closestTo(early, [late])).toBe(late);
    });

    it(`${name} orders and selects dates, including other calendars`, () => {
      const jan20 = left!.PlainDate.from('2025-01-20');
      const jan23 = right!.PlainDate.from('2025-01-23').withCalendar('hebrew');

      expect(compareAsc(jan20, jan23)).toBe(-1);
      expect(min([jan23, jan20])).toBe(jan20);
      expect(closestTo(jan20, [jan23])).toBe(jan23);
      expect(differenceInBusinessDays(jan23, jan20)).toBe(3);
    });

    it(`${name} counts business days`, () => {
      const friday = left!.PlainDate.from('2025-01-24');

      expect(isWeekend(right!.PlainDate.from('2025-01-25'))).toBe(true);
      expect(addBusinessDays(friday, 1).toString()).toBe('2025-01-27');
    });
  }
});
