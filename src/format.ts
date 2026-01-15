import { Temporal } from '@js-temporal/polyfill';
import { normalizeTemporalInput } from './shared/normalizeTemporalInput';

export interface FormatOptions {
  locale?: string;
  timeZone?: string;
}

/**
 * Format a Temporal.Instant or ZonedDateTime using date-fns-like format tokens.
 * Uses Intl.DateTimeFormat under the hood via Temporal's toLocaleString() for zero dependencies.
 *
 * @param input - A Temporal.Instant or Temporal.ZonedDateTime to format
 * @param formatStr - Format string using date-fns tokens (e.g., "yyyy-MM-dd HH:mm:ss")
 * @param options - Optional configuration for locale and timezone
 * @returns Formatted date string
 *
 * @example
 * ```typescript
 * const zoned = Temporal.ZonedDateTime.from("2025-01-20T15:00:00-05:00[America/New_York]");
 *
 * format(zoned, "yyyy-MM-dd"); // "2025-01-20"
 * format(zoned, "MMMM d, yyyy"); // "January 20, 2025"
 * format(zoned, "h:mm a"); // "3:00 PM"
 * format(zoned, "EEEE, MMMM do, yyyy 'at' h:mm a"); // "Monday, January 20th, 2025 at 3:00 PM"
 *
 * // With locale
 * format(zoned, "MMMM d, yyyy", { locale: "es-ES" }); // "enero 20, 2025"
 * ```
 */
export function format(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  formatStr: string,
  options: FormatOptions = {}
): string {
  const { locale = 'en-US', timeZone } = options;

  // Convert to ZonedDateTime, applying custom timezone if provided
  let zonedDateTime: Temporal.ZonedDateTime;
  if (timeZone) {
    // If custom timezone specified, convert via Instant
    const instant = input instanceof Temporal.Instant ? input : input.toInstant();
    zonedDateTime = instant.toZonedDateTimeISO(timeZone);
  } else {
    // No custom timezone: normalize to ZonedDateTime (Instant -> UTC, ZonedDateTime -> keep as-is)
    zonedDateTime = normalizeTemporalInput(input);
  }

  let result = '';
  let i = 0;
  const len = formatStr.length;

  while (i < len) {
    const char = formatStr[i];
    if (!char) break;

    // Handle escaped text
    if (char === "'") {
      // Check for double single quote (not inside a string, just '')
      if (i + 1 < len && formatStr[i + 1] === "'") {
        result += "'";
        i += 2;
        continue;
      }
      // Find closing quote, handling '' inside the string
      i++;
      while (i < len) {
        if (formatStr[i] === "'") {
          // Check if it's a doubled quote ''
          if (i + 1 < len && formatStr[i + 1] === "'") {
            result += "'";
            i += 2;
          } else {
            // End of quoted string
            i++;
            break;
          }
        } else {
          result += formatStr[i];
          i++;
        }
      }
      continue;
    }

    // Check for tokens by looking ahead
    const token = consumeToken(formatStr, i, char);
    if (token !== null) {
      result += formatToken(token, zonedDateTime, locale);
      i += token.length;
    } else {
      result += char;
      i++;
    }
  }

  return result;
}

function consumeToken(formatStr: string, start: number, char: string): string | null {
  // Special case for 'Mo' and 'do' - these end with 'o'
  if (char === 'M' && start + 1 < formatStr.length && formatStr[start + 1] === 'o') {
    return 'Mo';
  }
  if (char === 'd' && start + 1 < formatStr.length && formatStr[start + 1] === 'o') {
    return 'do';
  }

  // Count how many consecutive identical characters
  let end = start;
  while (end < formatStr.length && formatStr[end] === char) {
    end++;
  }
  const count = end - start;

  // Check if this is a valid token pattern
  const validTokens = [
    'GGGGG',
    'GGGG',
    'GGG',
    'GG',
    'G',
    'yyyy',
    'yyy',
    'yy',
    'y',
    'QQQQQ',
    'QQQQ',
    'QQQ',
    'QQ',
    'Q',
    'MMMMM',
    'MMMM',
    'MMM',
    'MM',
    'M',
    'dd',
    'd',
    'EEEEEE',
    'EEEEE',
    'EEEE',
    'EEE',
    'EE',
    'E',
    'aaaaa',
    'aaaa',
    'aaa',
    'aa',
    'a',
    'HH',
    'H',
    'hh',
    'h',
    'mm',
    'm',
    'ss',
    's',
    'SSS',
    'SS',
    'S',
    'XXXXX',
    'XXXX',
    'XXX',
    'XX',
    'X',
    'xxxxx',
    'xxxx',
    'xxx',
    'xx',
    'x',
    'zzzz',
    'zzz',
    'zz',
    'z',
    'T',
    't',
  ];

  // Try to match from longest to shortest
  for (let len = Math.min(count, 6); len > 0; len--) {
    const candidate = char.repeat(len);
    if (validTokens.includes(candidate)) {
      return candidate;
    }
  }

  return null;
}

function formatToken(token: string, zonedDateTime: Temporal.ZonedDateTime, locale: string): string {
  switch (token) {
    // Era
    case 'GGGGG':
      return formatPart(zonedDateTime, 'era', 'narrow', locale);
    case 'GGGG':
      return formatPart(zonedDateTime, 'era', 'long', locale);
    case 'GGG':
    case 'GG':
    case 'G':
      return formatPart(zonedDateTime, 'era', 'short', locale);

    // Year
    case 'yyyy':
      return zonedDateTime.year.toString().padStart(4, '0');
    case 'yyy':
      return zonedDateTime.year.toString().padStart(3, '0');
    case 'yy':
      return (zonedDateTime.year % 100).toString().padStart(2, '0');
    case 'y':
      return zonedDateTime.year.toString();

    // Quarter
    case 'QQQQQ':
      return Math.ceil(zonedDateTime.month / 3).toString();
    case 'QQQQ': {
      const quarter = Math.ceil(zonedDateTime.month / 3);
      return `${quarter}${getOrdinalSuffix(quarter)} quarter`;
    }
    case 'QQQ':
      return `Q${Math.ceil(zonedDateTime.month / 3)}`;
    case 'QQ':
      return Math.ceil(zonedDateTime.month / 3)
        .toString()
        .padStart(2, '0');
    case 'Q':
      return Math.ceil(zonedDateTime.month / 3).toString();

    // Month
    case 'MMMMM':
      return formatPart(zonedDateTime, 'month', 'narrow', locale);
    case 'MMMM':
      return formatPart(zonedDateTime, 'month', 'long', locale);
    case 'MMM':
      return formatPart(zonedDateTime, 'month', 'short', locale);
    case 'MM':
      return zonedDateTime.month.toString().padStart(2, '0');
    case 'Mo':
      return `${zonedDateTime.month}${getOrdinalSuffix(zonedDateTime.month)}`;
    case 'M':
      return zonedDateTime.month.toString();

    // Day of month
    case 'do':
      return `${zonedDateTime.day}${getOrdinalSuffix(zonedDateTime.day)}`;
    case 'dd':
      return zonedDateTime.day.toString().padStart(2, '0');
    case 'd':
      return zonedDateTime.day.toString();

    // Day of week
    case 'EEEEEE':
      return formatPart(zonedDateTime, 'weekday', 'short', locale).slice(0, 2);
    case 'EEEEE':
      return formatPart(zonedDateTime, 'weekday', 'narrow', locale);
    case 'EEEE':
      return formatPart(zonedDateTime, 'weekday', 'long', locale);
    case 'EEE':
    case 'EE':
    case 'E':
      return formatPart(zonedDateTime, 'weekday', 'short', locale);

    // AM/PM
    case 'aaaaa': {
      const period = formatPart(zonedDateTime, 'dayPeriod', 'narrow', locale).toLowerCase();
      return period.charAt(0);
    }
    case 'aaaa': {
      const period = formatPart(zonedDateTime, 'dayPeriod', 'short', locale);
      return period === 'AM' ? 'a.m.' : 'p.m.';
    }
    case 'aaa':
      return formatPart(zonedDateTime, 'dayPeriod', 'short', locale).toLowerCase();
    case 'aa':
    case 'a':
      return formatPart(zonedDateTime, 'dayPeriod', 'short', locale);

    // Hour [0-23]
    case 'HH':
      return zonedDateTime.hour.toString().padStart(2, '0');
    case 'H':
      return zonedDateTime.hour.toString();

    // Hour [1-12]
    case 'hh': {
      const hour12 = zonedDateTime.hour % 12 || 12;
      return hour12.toString().padStart(2, '0');
    }
    case 'h': {
      const hour12 = zonedDateTime.hour % 12 || 12;
      return hour12.toString();
    }

    // Minute
    case 'mm':
      return zonedDateTime.minute.toString().padStart(2, '0');
    case 'm':
      return zonedDateTime.minute.toString();

    // Second
    case 'ss':
      return zonedDateTime.second.toString().padStart(2, '0');
    case 's':
      return zonedDateTime.second.toString();

    // Fractional seconds
    case 'SSS':
      return zonedDateTime.millisecond.toString().padStart(3, '0');
    case 'SS':
      return Math.floor(zonedDateTime.millisecond / 10)
        .toString()
        .padStart(2, '0');
    case 'S':
      return Math.floor(zonedDateTime.millisecond / 100).toString();

    // Timezone
    case 'XXXXX': {
      const offset = getTimezoneOffset(zonedDateTime);
      return offset === '+00:00' ? 'Z' : offset;
    }
    case 'XXXX': {
      const offset = getTimezoneOffset(zonedDateTime).replace(':', '');
      return offset === '+0000' ? 'Z' : offset;
    }
    case 'XXX': {
      const offset = getTimezoneOffset(zonedDateTime);
      return offset === '+00:00' ? 'Z' : offset;
    }
    case 'XX': {
      const offset = getTimezoneOffset(zonedDateTime).replace(':', '');
      return offset === '+0000' ? 'Z' : offset;
    }
    case 'X': {
      const offset = getTimezoneOffset(zonedDateTime);
      if (offset === '+00:00') return 'Z';
      const [hours] = offset.split(':');
      return hours || '+00';
    }
    case 'xxxxx':
      return getTimezoneOffset(zonedDateTime);
    case 'xxxx':
      return getTimezoneOffset(zonedDateTime).replace(':', '');
    case 'xxx':
      return getTimezoneOffset(zonedDateTime);
    case 'xx':
      return getTimezoneOffset(zonedDateTime).replace(':', '');
    case 'x': {
      const offset = getTimezoneOffset(zonedDateTime);
      const [hours] = offset.split(':');
      return hours || '+00';
    }
    case 'zzzz':
      return formatPart(zonedDateTime, 'timeZoneName', 'long', locale);
    case 'zzz':
    case 'zz':
    case 'z':
      return formatPart(zonedDateTime, 'timeZoneName', 'short', locale);

    // Timestamps
    case 'T':
      return zonedDateTime.epochMilliseconds.toString();
    case 't':
      return Math.floor(zonedDateTime.epochMilliseconds / 1000).toString();

    default:
      return token;
  }
}

function formatPart(
  zonedDateTime: Temporal.ZonedDateTime,
  part: 'era' | 'year' | 'month' | 'weekday' | 'day' | 'dayPeriod' | 'hour' | 'minute' | 'second' | 'timeZoneName',
  style: 'narrow' | 'short' | 'long' | 'numeric' | '2-digit',
  locale: string
): string {
  const options: Intl.DateTimeFormatOptions = {};

  if (part === 'dayPeriod') {
    // dayPeriod needs hour to be present
    options.hour = 'numeric';
    options.hour12 = true;
  } else {
    options[part] = style as any;
  }

  const formatted = zonedDateTime.toLocaleString(locale, options);

  if (part === 'dayPeriod') {
    // Extract just the AM/PM part
    const match = formatted.match(/\b(AM|PM|am|pm|a\.m\.|p\.m\.)\b/);
    return match ? match[0] : formatted.split(' ').pop() || '';
  }

  return formatted;
}

function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}

function getTimezoneOffset(zonedDateTime: Temporal.ZonedDateTime): string {
  const offsetNs = zonedDateTime.offsetNanoseconds;
  const offsetMinutes = offsetNs / (60 * 1e9);
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const absMinutes = Math.abs(offsetMinutes);
  const hours = Math.floor(absMinutes / 60);
  const minutes = absMinutes % 60;
  return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
