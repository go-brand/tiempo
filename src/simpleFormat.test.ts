import { describe, expect, it } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';
import { simpleFormat } from './simpleFormat';

describe('simpleFormat', () => {
  const currentYear = Temporal.Now.plainDateISO().year;

  describe('date only', () => {
    const currentYearZoned = Temporal.ZonedDateTime.from(
      `${currentYear}-12-23T15:30:00-05:00[America/New_York]`
    );
    const pastYearZoned = Temporal.ZonedDateTime.from(
      '2020-12-23T15:30:00-05:00[America/New_York]'
    );

    it('compact: never shows year', () => {
      expect(simpleFormat(currentYearZoned, { date: 'compact' })).toBe('Dec 23');
      expect(simpleFormat(pastYearZoned, { date: 'compact' })).toBe('Dec 23');
    });

    it('auto: hides year for current year', () => {
      expect(simpleFormat(currentYearZoned, { date: 'auto' })).toBe('Dec 23');
    });

    it('auto: shows year for past year', () => {
      expect(simpleFormat(pastYearZoned, { date: 'auto' })).toBe('Dec 23, 2020');
    });

    it('full: always shows year', () => {
      expect(simpleFormat(currentYearZoned, { date: 'full' })).toBe(`Dec 23, ${currentYear}`);
      expect(simpleFormat(pastYearZoned, { date: 'full' })).toBe('Dec 23, 2020');
    });

    it('respects locale', () => {
      expect(simpleFormat(pastYearZoned, { date: 'auto', locale: 'es-ES' })).toBe('23 dic 2020');
    });
  });

  describe('time only', () => {
    const zoned = Temporal.ZonedDateTime.from(
      `${currentYear}-12-23T15:30:00-05:00[America/New_York]`
    );
    const zonedOnTheHour = Temporal.ZonedDateTime.from(
      `${currentYear}-12-23T09:00:00-05:00[America/New_York]`
    );

    it('12h format', () => {
      expect(simpleFormat(zoned, { time: '12h' })).toBe('3:30 PM');
    });

    it('24h format', () => {
      expect(simpleFormat(zoned, { time: '24h' })).toBe('15:30');
    });

    it('compact: shows minutes when non-zero', () => {
      expect(simpleFormat(zoned, { time: 'compact' })).toBe('3:30pm');
    });

    it('compact: omits minutes when zero', () => {
      expect(simpleFormat(zonedOnTheHour, { time: 'compact' })).toBe('9am');
    });

    it('compact: handles noon', () => {
      const noon = Temporal.ZonedDateTime.from(
        `${currentYear}-12-23T12:00:00-05:00[America/New_York]`
      );
      expect(simpleFormat(noon, { time: 'compact' })).toBe('12pm');
    });

    it('compact: handles midnight', () => {
      const midnight = Temporal.ZonedDateTime.from(
        `${currentYear}-12-23T00:00:00-05:00[America/New_York]`
      );
      expect(simpleFormat(midnight, { time: 'compact' })).toBe('12am');
    });
  });

  describe('date and time', () => {
    const currentYearZoned = Temporal.ZonedDateTime.from(
      `${currentYear}-12-23T09:00:00-05:00[America/New_York]`
    );
    const pastYearZoned = Temporal.ZonedDateTime.from(
      '2020-12-23T15:30:00-05:00[America/New_York]'
    );

    it('date auto + time 12h', () => {
      expect(simpleFormat(currentYearZoned, { date: 'auto', time: '12h' })).toBe('Dec 23, 9:00 AM');
    });

    it('date auto + time 24h', () => {
      expect(simpleFormat(currentYearZoned, { date: 'auto', time: '24h' })).toBe('Dec 23, 09:00');
    });

    it('date auto + time compact', () => {
      expect(simpleFormat(currentYearZoned, { date: 'auto', time: 'compact' })).toBe('Dec 23, 9am');
    });

    it('date full + time compact', () => {
      expect(simpleFormat(currentYearZoned, { date: 'full', time: 'compact' })).toBe(
        `Dec 23, ${currentYear}, 9am`
      );
    });

    it('shows year and time for past year', () => {
      expect(simpleFormat(pastYearZoned, { date: 'auto', time: 'compact' })).toBe(
        'Dec 23, 2020, 3:30pm'
      );
    });

    it('date compact + time compact (no year)', () => {
      expect(simpleFormat(pastYearZoned, { date: 'compact', time: 'compact' })).toBe(
        'Dec 23, 3:30pm'
      );
    });
  });

  describe('with timezone conversion', () => {
    const nyZoned = Temporal.ZonedDateTime.from(
      `${currentYear}-12-23T15:30:00-05:00[America/New_York]`
    );

    it('converts to different timezone', () => {
      // 15:30 in New York = 20:30 UTC
      expect(simpleFormat(nyZoned, { date: 'auto', time: '24h', timeZone: 'UTC' })).toBe(
        'Dec 23, 20:30'
      );
    });

    it('time only with timezone conversion', () => {
      expect(simpleFormat(nyZoned, { time: 'compact', timeZone: 'UTC' })).toBe('8:30pm');
    });
  });

  describe('with Instant', () => {
    const currentYearInstant = Temporal.Instant.from(`${currentYear}-12-23T20:30:00Z`);
    const pastYearInstant = Temporal.Instant.from('2020-12-23T20:30:00Z');

    it('date only with timeZone', () => {
      expect(simpleFormat(currentYearInstant, { date: 'auto', timeZone: 'America/New_York' })).toBe(
        'Dec 23'
      );
    });

    it('shows year for past year', () => {
      expect(simpleFormat(pastYearInstant, { date: 'auto', timeZone: 'America/New_York' })).toBe(
        'Dec 23, 2020'
      );
    });

    it('time only', () => {
      // 20:30 UTC = 15:30 New York
      expect(simpleFormat(currentYearInstant, { time: 'compact', timeZone: 'America/New_York' })).toBe(
        '3:30pm'
      );
    });

    it('date and time', () => {
      expect(
        simpleFormat(currentYearInstant, { date: 'auto', time: '12h', timeZone: 'America/New_York' })
      ).toBe('Dec 23, 3:30 PM');
    });

    it('defaults to UTC when no timeZone provided', () => {
      expect(simpleFormat(currentYearInstant, { time: '24h' })).toBe('20:30');
    });
  });

  describe('with PlainDate', () => {
    const currentYearPlain = Temporal.PlainDate.from(`${currentYear}-12-23`);
    const pastYearPlain = Temporal.PlainDate.from('2020-12-23');

    it('date compact', () => {
      expect(simpleFormat(currentYearPlain, { date: 'compact' })).toBe('Dec 23');
    });

    it('date auto hides year for current year', () => {
      expect(simpleFormat(currentYearPlain, { date: 'auto' })).toBe('Dec 23');
    });

    it('date auto shows year for past year', () => {
      expect(simpleFormat(pastYearPlain, { date: 'auto' })).toBe('Dec 23, 2020');
    });

    it('date full always shows year', () => {
      expect(simpleFormat(currentYearPlain, { date: 'full' })).toBe(`Dec 23, ${currentYear}`);
    });

    it('respects locale', () => {
      expect(simpleFormat(pastYearPlain, { date: 'auto', locale: 'de-DE' })).toBe('23. Dez. 2020');
    });
  });
});
