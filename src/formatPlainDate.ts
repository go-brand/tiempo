import { Temporal } from '@js-temporal/polyfill';

export interface FormatPlainDateOptions {
  locale?: string;
}

/**
 * Format a Temporal.PlainDate using date-fns-like format tokens.
 * Uses Intl.DateTimeFormat under the hood for locale support.
 *
 * Only supports date-related tokens (no time or timezone tokens).
 *
 * @param date - A Temporal.PlainDate to format
 * @param formatStr - Format string using date-fns tokens (e.g., "yyyy-MM-dd")
 * @param options - Optional configuration for locale
 * @returns Formatted date string
 *
 * @example
 * ```typescript
 * const date = Temporal.PlainDate.from("2025-01-20");
 *
 * formatPlainDate(date, "yyyy-MM-dd"); // "2025-01-20"
 * formatPlainDate(date, "MMMM d, yyyy"); // "January 20, 2025"
 * formatPlainDate(date, "EEEE, MMMM do, yyyy"); // "Monday, January 20th, 2025"
 *
 * // With locale
 * formatPlainDate(date, "MMMM d, yyyy", { locale: "es-ES" }); // "enero 20, 2025"
 * ```
 */
export function formatPlainDate(
  date: Temporal.PlainDate,
  formatStr: string,
  options: FormatPlainDateOptions = {}
): string {
  const { locale = 'en-US' } = options;

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
      result += formatToken(token, date, locale);
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

  // Valid tokens for PlainDate (date-only, no time/timezone)
  const validTokens = [
    // Era
    'GGGGG',
    'GGGG',
    'GGG',
    'GG',
    'G',
    // Year
    'yyyy',
    'yyy',
    'yy',
    'y',
    // Quarter
    'QQQQQ',
    'QQQQ',
    'QQQ',
    'QQ',
    'Q',
    // Month
    'MMMMM',
    'MMMM',
    'MMM',
    'MM',
    'M',
    // Day
    'dd',
    'd',
    // Weekday
    'EEEEEE',
    'EEEEE',
    'EEEE',
    'EEE',
    'EE',
    'E',
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

function formatToken(token: string, date: Temporal.PlainDate, locale: string): string {
  switch (token) {
    // Era
    case 'GGGGG':
      return formatPart(date, 'era', 'narrow', locale);
    case 'GGGG':
      return formatPart(date, 'era', 'long', locale);
    case 'GGG':
    case 'GG':
    case 'G':
      return formatPart(date, 'era', 'short', locale);

    // Year
    case 'yyyy':
      return date.year.toString().padStart(4, '0');
    case 'yyy':
      return date.year.toString().padStart(3, '0');
    case 'yy':
      return (date.year % 100).toString().padStart(2, '0');
    case 'y':
      return date.year.toString();

    // Quarter
    case 'QQQQQ':
      return Math.ceil(date.month / 3).toString();
    case 'QQQQ': {
      const quarter = Math.ceil(date.month / 3);
      return `${quarter}${getOrdinalSuffix(quarter)} quarter`;
    }
    case 'QQQ':
      return `Q${Math.ceil(date.month / 3)}`;
    case 'QQ':
      return Math.ceil(date.month / 3)
        .toString()
        .padStart(2, '0');
    case 'Q':
      return Math.ceil(date.month / 3).toString();

    // Month
    case 'MMMMM':
      return formatPart(date, 'month', 'narrow', locale);
    case 'MMMM':
      return formatPart(date, 'month', 'long', locale);
    case 'MMM':
      return formatPart(date, 'month', 'short', locale);
    case 'MM':
      return date.month.toString().padStart(2, '0');
    case 'Mo':
      return `${date.month}${getOrdinalSuffix(date.month)}`;
    case 'M':
      return date.month.toString();

    // Day of month
    case 'do':
      return `${date.day}${getOrdinalSuffix(date.day)}`;
    case 'dd':
      return date.day.toString().padStart(2, '0');
    case 'd':
      return date.day.toString();

    // Day of week
    case 'EEEEEE':
      return formatPart(date, 'weekday', 'short', locale).slice(0, 2);
    case 'EEEEE':
      return formatPart(date, 'weekday', 'narrow', locale);
    case 'EEEE':
      return formatPart(date, 'weekday', 'long', locale);
    case 'EEE':
    case 'EE':
    case 'E':
      return formatPart(date, 'weekday', 'short', locale);

    default:
      return token;
  }
}

function formatPart(
  date: Temporal.PlainDate,
  part: 'era' | 'year' | 'month' | 'weekday' | 'day',
  style: 'narrow' | 'short' | 'long' | 'numeric' | '2-digit',
  locale: string
): string {
  const options: Intl.DateTimeFormatOptions = {
    [part]: style,
  };

  return date.toLocaleString(locale, options);
}

function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}
