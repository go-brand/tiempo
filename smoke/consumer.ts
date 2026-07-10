import {
  startOfMonth,
  toInstant,
  toPlainDate,
  toZonedTime,
} from '../dist/index.js';

const instant = toInstant('2025-01-20T20:00:00Z');
const sameInstant = toInstant(instant);
const zoned = toZonedTime(instant, 'UTC');
const date = toPlainDate('2025-01-20');
const calendarBoundary = startOfMonth(date);
const timelineBoundary = startOfMonth(date, 'UTC');

if (instant.toString() !== '2025-01-20T20:00:00Z') {
  throw new Error('toInstant string conversion failed');
}

if (sameInstant !== instant) {
  throw new Error('toInstant is not idempotent');
}

if (zoned.timeZoneId !== 'UTC') {
  throw new Error('toZonedTime did not preserve the requested timezone');
}

if (calendarBoundary.toString() !== '2025-01-01') {
  throw new Error('PlainDate boundary changed calendar value');
}

if (timelineBoundary.timeZoneId !== 'UTC') {
  throw new Error('PlainDate timezone bridge did not return UTC');
}

// @ts-expect-error A calendar-only boundary has no clock fields.
calendarBoundary.hour;

console.log('✓ built-package consumer smoke passed');
