import { Temporal, isDuration } from './shared/temporal';

/** Unit names accepted by `formatDuration`'s `format` option. */
export type DurationUnit =
  | 'years'
  | 'months'
  | 'weeks'
  | 'days'
  | 'hours'
  | 'minutes'
  | 'seconds'
  | 'milliseconds'
  | 'microseconds'
  | 'nanoseconds';

/** Options for `formatDuration`. */
export interface FormatDurationOptions {
  /** Locale for unit names and list separators. @default 'en-US' */
  locale?: string | string[];
  /** Output width. @default 'long' */
  style?: 'long' | 'short' | 'narrow' | 'digital';
  /** Subset of units to include. Omitted units are not shown. */
  format?: DurationUnit[];
  /** Include zero-valued units listed in `format` (or present on a plain object). @default false */
  zero?: boolean;
}

const ALL_UNITS: readonly DurationUnit[] = [
  'years',
  'months',
  'weeks',
  'days',
  'hours',
  'minutes',
  'seconds',
  'milliseconds',
  'microseconds',
  'nanoseconds'
];

// Intl.DurationFormat ships in Node 22+ and modern browsers, but is not yet in
// TypeScript's default ESNext lib declarations.
interface DurationFormatInstance {
  format(duration: Temporal.DurationLike): string;
}

type DurationFormatConstructor = new (
  locales?: string | string[],
  options?: Record<string, string | undefined>
) => DurationFormatInstance;

/**
 * Formats a `Temporal.Duration` or duration-like object as a localized, human-readable string
 * using `Intl.DurationFormat` with zero locale bundles.
 *
 * Pairs naturally with `intervalToDuration` to format exact elapsed spans.
 *
 * @param duration - A `Temporal.Duration` or plain duration object (e.g. `{ hours: 2, minutes: 30 }`)
 * @param options - Optional locale, style, unit filter, and zero-display control
 * @returns The formatted duration string
 *
 * @example
 * ```ts
 * formatDuration({ hours: 2, minutes: 30 }); // "2 hours, 30 minutes"
 * formatDuration({ hours: 2, minutes: 30 }, { style: 'short' }); // "2 hr, 30 min"
 * formatDuration({ hours: 2, minutes: 30 }, { locale: 'es-ES' }); // "2 horas y 30 minutos"
 * formatDuration({ hours: 1, minutes: 5, seconds: 9 }, { style: 'digital' }); // "1:05:09"
 * ```
 *
 * @example
 * ```ts
 * // Format an interval breakdown
 * const duration = intervalToDuration({
 *   start: Temporal.PlainDate.from('2025-01-15'),
 *   end: Temporal.PlainDate.from('2026-04-20')
 * });
 * formatDuration(duration); // "1 year, 3 months, 5 days"
 * formatDuration(duration, { format: ['years', 'months'] }); // "1 year, 3 months"
 * ```
 */
export function formatDuration(
  duration: Temporal.Duration | Temporal.DurationLike,
  options: FormatDurationOptions = {}
): string {
  const { locale = 'en-US', style = 'long', format: units, zero = false } = options;

  // Validate and bridge native/polyfill Temporal.Duration instances cleanly.
  const normalized = Temporal.Duration.from(isDuration(duration) ? duration.toString() : duration);

  const selectedUnits: readonly DurationUnit[] =
    units ??
    (isDuration(duration) ? ALL_UNITS : ALL_UNITS.filter((unit) => duration[unit] !== undefined));

  const record: Partial<Record<DurationUnit, number>> = {};
  const intlOptions: Record<string, string | undefined> = { style };

  for (const unit of selectedUnits) {
    const value = normalized[unit];
    if (value !== 0 || zero || style === 'digital') {
      record[unit] = value;
      if (zero) {
        intlOptions[`${unit}Display`] = 'always';
      }
    }
  }

  if (Object.keys(record).length === 0) return '';

  const DurationFormat = (Intl as unknown as { DurationFormat?: DurationFormatConstructor })
    .DurationFormat;
  if (typeof DurationFormat === 'function') {
    return new DurationFormat(locale, intlOptions).format(record);
  }
  return fallbackFormatDuration(record, locale, style);
}

const SINGULAR_UNIT: Record<DurationUnit, string> = {
  years: 'year',
  months: 'month',
  weeks: 'week',
  days: 'day',
  hours: 'hour',
  minutes: 'minute',
  seconds: 'second',
  milliseconds: 'millisecond',
  microseconds: 'microsecond',
  nanoseconds: 'nanosecond'
};

function fallbackFormatDuration(
  record: Partial<Record<DurationUnit, number>>,
  locale: string | string[],
  style: 'long' | 'short' | 'narrow' | 'digital'
): string {
  if (style === 'digital') {
    const negative = Object.values(record).some((value) => value !== undefined && value < 0);
    const hours = Math.abs(record.hours ?? 0);
    const minutes = Math.abs(record.minutes ?? 0);
    const seconds = Math.abs(record.seconds ?? 0);
    const clock = [
      hours.toString(),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
    return negative ? `-${clock}` : clock;
  }

  const parts = (Object.entries(record) as [DurationUnit, number][]).map(([unit, value], index) => {
    const displayValue = index > 0 && value < 0 ? Math.abs(value) : value;
    return new Intl.NumberFormat(locale, {
      style: 'unit',
      unit: SINGULAR_UNIT[unit],
      unitDisplay: style
    }).format(displayValue);
  });

  return new Intl.ListFormat(locale, { style, type: 'unit' }).format(parts);
}
