import { describe, expect, it } from 'vitest';
import { Temporal } from './shared/temporal';
import {
  addHours,
  subHours,
  addMinutes,
  subMinutes,
  addSeconds,
  subSeconds,
  addMilliseconds,
  subMilliseconds,
  addMicroseconds,
  subMicroseconds,
  addNanoseconds,
  subNanoseconds,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  differenceInMilliseconds,
  differenceInMicroseconds,
  differenceInNanoseconds,
  addDays,
  differenceInDays
} from './index';

const date = Temporal.PlainDate.from('2025-01-20');
const time = Temporal.PlainTime.from('09:00');
const dateTime = Temporal.PlainDateTime.from('2025-01-20T09:00');
const message = /Expected a Temporal.Instant or Temporal.ZonedDateTime, got /;

const adders = [
  ['addHours', addHours],
  ['subHours', subHours],
  ['addMinutes', addMinutes],
  ['subMinutes', subMinutes],
  ['addSeconds', addSeconds],
  ['subSeconds', subSeconds],
  ['addMilliseconds', addMilliseconds],
  ['subMilliseconds', subMilliseconds],
  ['addMicroseconds', addMicroseconds],
  ['subMicroseconds', subMicroseconds],
  ['addNanoseconds', addNanoseconds],
  ['subNanoseconds', subNanoseconds]
] as const;

const differences = [
  ['differenceInHours', differenceInHours],
  ['differenceInMinutes', differenceInMinutes],
  ['differenceInSeconds', differenceInSeconds],
  ['differenceInMilliseconds', differenceInMilliseconds],
  ['differenceInMicroseconds', differenceInMicroseconds],
  ['differenceInNanoseconds', differenceInNanoseconds]
] as const;

for (const [name, operation] of adders) {
  describe(`${name} timeline domain`, () => {
    it('rejects a PlainDate instead of returning it unchanged', () => {
      // @ts-expect-error A calendar date has no hours to add.
      expect(() => operation(date, 1)).toThrow('got Temporal.PlainDate');
    });

    it('rejects other non-timeline values with the same message', () => {
      for (const value of [time, dateTime, '2025-01-20T09:00:00Z']) {
        expect(() => operation(value as never, 1)).toThrow(TypeError);
        expect(() => operation(value as never, 1)).toThrow(message);
      }
    });
  });
}

for (const [name, operation] of differences) {
  describe(`${name} timeline domain`, () => {
    it('rejects PlainDates with a TypeError that names the type', () => {
      // @ts-expect-error Two calendar dates have no hours between them.
      expect(() => operation(date, date)).toThrow('got Temporal.PlainDate');
    });

    it('rejects a mixed PlainDate and Instant', () => {
      const instant = Temporal.Instant.from('2025-01-20T09:00:00Z');
      // @ts-expect-error Mixing domains is rejected.
      expect(() => operation(instant, date)).toThrow(TypeError);
    });

    it('rejects other non-timeline values', () => {
      for (const value of [time, dateTime, '2025-01-20T09:00:00Z']) {
        expect(() => operation(value as never, value as never)).toThrow(message);
      }
    });
  });
}

describe('functions that also accept PlainDate', () => {
  it('still reject a PlainTime', () => {
    // @ts-expect-error A clock time has no days to add.
    expect(() => addDays(time, 1)).toThrow('got Temporal.PlainTime');
    // @ts-expect-error A clock time has no days between it and another.
    expect(() => differenceInDays(time, time)).toThrow('got Temporal.PlainTime');
  });
});
