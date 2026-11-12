import { Temporal } from './shared/temporal';
import { consumeToken } from './shared/formatTokens';
import type { Timezone } from './types';

export interface ParseOptions {
  /** Locale for month, weekday, and AM/PM names. @default 'en-US' */
  locale?: string;
  /** Timezone the parsed wall-clock time belongs to. Required when the pattern has time fields. */
  timeZone?: Timezone;
}

interface Fields {
  year?: number;
  month?: number;
  day?: number;
  dayOfWeek?: number;
  hour?: number;
  hour12?: number;
  pm?: boolean;
  minute?: number;
  second?: number;
  millisecond?: number;
  offset?: string;
}

/**
 * Reads a date, or a date and time, written in a known pattern. The pattern uses
 * the same tokens as `format`, so text that `format` writes with a supported
 * pattern reads back to the same fields.
 *
 * Without a timeZone the result is a PlainDate, and the pattern may only hold
 * date fields. With a timeZone the result is a ZonedDateTime in that timezone:
 * an offset in the text (`XXX`) fixes the moment, otherwise the wall-clock time
 * is read in the timezone, and a time skipped by a DST change moves forward as
 * in Temporal. A pattern without time fields gives the start of that day.
 *
 * Supported tokens: `yyyy` `y` `MMMM` `MMM` `MM` `M` `dd` `d` `EEEE` `EEE` `HH`
 * `H` `hh` `h` `a` `mm` `m` `ss` `s` `SSS` `SS` `S` `X…XXXXX` `x…xxxxx`. Text in
 * single quotes and any other character must match exactly. Two-digit years
 * (`yy`) are rejected because the century is a guess.
 *
 * @param text - The text to read
 * @param pattern - The pattern the text is written in, such as `dd/MM/yyyy`
 * @param options - `timeZone` for patterns with a time; `locale` for names (default 'en-US')
 * @returns PlainDate without a timeZone; ZonedDateTime with one
 * @throws RangeError if the text does not match the pattern or names an impossible date
 * @throws TypeError if the pattern has time fields but no timeZone is given
 *
 * @example
 * ```ts
 * parse('20/01/2025', 'dd/MM/yyyy').toString(); // "2025-01-20"
 * parse('January 20, 2025', 'MMMM d, yyyy').toString(); // "2025-01-20"
 * ```
 *
 * @example
 * ```ts
 * parse('01/20/2025 3:45 PM', 'MM/dd/yyyy h:mm a', { timeZone: 'America/New_York' }).toString();
 * // "2025-01-20T15:45:00-05:00[America/New_York]"
 * ```
 *
 * @example
 * ```ts
 * parse('20 enero 2025', 'd MMMM yyyy', { locale: 'es' }).toString(); // "2025-01-20"
 * ```
 */
export function parse(
  text: string,
  pattern: string,
  options: { locale?: string; timeZone: Timezone }
): Temporal.ZonedDateTime;
export function parse(
  text: string,
  pattern: string,
  options?: { locale?: string; timeZone?: undefined }
): Temporal.PlainDate;
export function parse(
  text: string,
  pattern: string,
  options: ParseOptions = {}
): Temporal.ZonedDateTime | Temporal.PlainDate {
  const { locale = 'en-US', timeZone } = options;
  const fields = readFields(text, pattern, locale);
  const fail = (reason: string) =>
    new RangeError(`Cannot parse "${text}" with pattern "${pattern}": ${reason}`);

  if (fields.year === undefined || fields.month === undefined || fields.day === undefined) {
    throw fail('the pattern needs a year, month, and day');
  }
  const date = Temporal.PlainDate.from(
    { year: fields.year, month: fields.month, day: fields.day },
    { overflow: 'reject' }
  );
  if (fields.dayOfWeek !== undefined && fields.dayOfWeek !== date.dayOfWeek) {
    throw fail(`${date} is not that day of the week`);
  }

  const hasTime =
    fields.hour !== undefined ||
    fields.hour12 !== undefined ||
    fields.minute !== undefined ||
    fields.second !== undefined ||
    fields.millisecond !== undefined;
  if (timeZone === undefined) {
    if (hasTime || fields.offset !== undefined) {
      throw new TypeError('Patterns with time or offset fields need a timeZone');
    }
    return date;
  }
  if (!hasTime && fields.offset === undefined) {
    return date.toZonedDateTime(timeZone);
  }

  if (fields.hour12 !== undefined) {
    if (fields.pm === undefined) throw fail('12-hour times (h) need AM/PM (a)');
    if (fields.hour12 < 1 || fields.hour12 > 12)
      throw fail(`${fields.hour12} is not a 12-hour hour`);
  }
  const hour =
    fields.hour ?? (fields.hour12 === undefined ? 0 : (fields.hour12 % 12) + (fields.pm ? 12 : 0));
  const dateTime = Temporal.PlainDateTime.from(
    {
      year: date.year,
      month: date.month,
      day: date.day,
      hour,
      minute: fields.minute ?? 0,
      second: fields.second ?? 0,
      millisecond: fields.millisecond ?? 0
    },
    { overflow: 'reject' }
  );
  if (fields.offset !== undefined) {
    return Temporal.Instant.from(`${dateTime}${fields.offset}`).toZonedDateTimeISO(timeZone);
  }
  return dateTime.toZonedDateTime(timeZone);
}

function readFields(text: string, pattern: string, locale: string): Fields {
  const fields: Fields = {};
  let position = 0;
  const fail = (reason: string) =>
    new RangeError(`Cannot parse "${text}" with pattern "${pattern}": ${reason}`);

  const literal = (expected: string) => {
    if (!text.startsWith(expected, position)) {
      throw fail(`expected "${expected}" at position ${position}`);
    }
    position += expected.length;
  };

  const digits = (min: number, max: number) => {
    const match = text.slice(position).match(new RegExp(`^\\d{${min},${max}}`));
    if (!match)
      throw fail(`expected ${min === max ? min : `${min}–${max}`} digits at position ${position}`);
    position += match[0].length;
    return match[0];
  };

  const name = (candidates: readonly string[]) => {
    const rest = text.slice(position).toLocaleLowerCase(locale);
    let best = -1;
    let length = 0;
    candidates.forEach((candidate, index) => {
      const lower = candidate.toLocaleLowerCase(locale);
      if (lower.length > length && rest.startsWith(lower)) {
        best = index;
        length = lower.length;
      }
    });
    if (best === -1) throw fail(`expected one of ${candidates.join(', ')} at position ${position}`);
    position += length;
    return best;
  };

  for (let i = 0; i < pattern.length;) {
    const char = pattern[i]!;

    if (char === "'") {
      // '' is a literal quote; 'text' is literal text with '' for a quote inside.
      if (pattern[i + 1] === "'") {
        literal("'");
        i += 2;
        continue;
      }
      let quoted = '';
      for (i++; i < pattern.length; i++) {
        if (pattern[i] !== "'") quoted += pattern[i];
        else if (pattern[i + 1] === "'") ((quoted += "'"), i++);
        else break;
      }
      literal(quoted);
      i++;
      continue;
    }

    const token = consumeToken(pattern, i, char);
    if (token === null) {
      literal(char);
      i++;
      continue;
    }
    i += token.length;

    switch (token) {
      case 'yyyy':
        fields.year = Number(digits(4, 4));
        break;
      case 'y':
        fields.year = Number(digits(1, 6));
        break;
      case 'MMMM':
      case 'MMM':
        fields.month = name(monthNames(locale, token === 'MMMM' ? 'long' : 'short')) + 1;
        break;
      case 'MM':
        fields.month = Number(digits(2, 2));
        break;
      case 'M':
        fields.month = Number(digits(1, 2));
        break;
      case 'dd':
        fields.day = Number(digits(2, 2));
        break;
      case 'd':
        fields.day = Number(digits(1, 2));
        break;
      case 'EEEE':
      case 'EEE':
      case 'EE':
      case 'E':
        fields.dayOfWeek = name(weekdayNames(locale, token === 'EEEE' ? 'long' : 'short')) + 1;
        break;
      case 'HH':
        fields.hour = Number(digits(2, 2));
        break;
      case 'H':
        fields.hour = Number(digits(1, 2));
        break;
      case 'hh':
        fields.hour12 = Number(digits(2, 2));
        break;
      case 'h':
        fields.hour12 = Number(digits(1, 2));
        break;
      case 'aaaa':
      case 'aaa':
      case 'aa':
      case 'a': {
        const [am, pm] = dayPeriods(locale);
        const candidates = [am, pm];
        if (isAsciiAmPm(am) && isAsciiAmPm(pm)) candidates.push('a.m.', 'p.m.');
        fields.pm = name(candidates) % 2 === 1;
        break;
      }
      case 'mm':
        fields.minute = Number(digits(2, 2));
        break;
      case 'm':
        fields.minute = Number(digits(1, 2));
        break;
      case 'ss':
        fields.second = Number(digits(2, 2));
        break;
      case 's':
        fields.second = Number(digits(1, 2));
        break;
      case 'SSS':
      case 'SS':
      case 'S':
        fields.millisecond = Number(digits(token.length, token.length).padEnd(3, '0'));
        break;
      default:
        if (/^[Xx]+$/.test(token)) {
          const match = text
            .slice(position)
            .match(token[0] === 'X' ? /^(Z|[+-]\d{2}(:?\d{2}){0,2})/ : /^[+-]\d{2}(:?\d{2}){0,2}/);
          if (!match) throw fail(`expected a UTC offset at position ${position}`);
          position += match[0].length;
          fields.offset = match[0] === 'Z' ? '+00:00' : normalizeOffset(match[0]);
          break;
        }
        throw new RangeError(
          token === 'yy'
            ? 'parse does not read two-digit years (yy); the century would be a guess'
            : token === 'T' || token === 't'
              ? 'parse does not read timestamps (T, t); use toInstant'
              : `parse does not support the "${token}" token`
        );
    }
  }

  if (position !== text.length) {
    throw fail(`unexpected "${text.slice(position)}" at position ${position}`);
  }
  return fields;
}

// "+0530" and "+05:30" both become "+05:30", which Temporal reads.
function normalizeOffset(offset: string): string {
  const numbers = offset.slice(1).replaceAll(':', '');
  const parts = numbers.match(/\d{2}/g)!;
  return `${offset[0]}${parts.length === 1 ? `${parts[0]}:00` : parts.join(':')}`;
}

// Names come from Intl exactly as format writes them, so what format writes, parse reads.
function intlPart(
  locale: string,
  options: Intl.DateTimeFormatOptions,
  type: Intl.DateTimeFormatPartTypes,
  date: Temporal.PlainDateTime
): string {
  const epochMilliseconds = date.toZonedDateTime('UTC').epochMilliseconds;
  return (
    new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' })
      .formatToParts(epochMilliseconds)
      .find((part) => part.type === type)?.value ?? ''
  );
}

function monthNames(locale: string, style: 'long' | 'short'): string[] {
  return Array.from({ length: 12 }, (_, index) =>
    intlPart(
      locale,
      { month: style },
      'month',
      Temporal.PlainDateTime.from({ year: 2000, month: index + 1, day: 15 })
    )
  );
}

function weekdayNames(locale: string, style: 'long' | 'short'): string[] {
  // 3 January 2000 was a Monday.
  return Array.from({ length: 7 }, (_, index) =>
    intlPart(
      locale,
      { weekday: style },
      'weekday',
      Temporal.PlainDateTime.from({ year: 2000, month: 1, day: 3 + index })
    )
  );
}

function dayPeriods(locale: string): [am: string, pm: string] {
  const at = (hour: number) =>
    intlPart(
      locale,
      { hour: 'numeric', hour12: true },
      'dayPeriod',
      Temporal.PlainDateTime.from({ year: 2000, month: 1, day: 3, hour })
    );
  return [at(9), at(15)];
}

function isAsciiAmPm(period: string): boolean {
  const normalized = period.toUpperCase().replace(/[.\s]/g, '');
  return normalized === 'AM' || normalized === 'PM';
}
