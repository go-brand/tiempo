# format

Format a `Temporal.Instant`, `ZonedDateTime`, or `PlainDate` using date-fns-like format tokens. PlainDate formatting is equivalent to `formatPlainDate`; it uses date-only information and accepts a locale, without a timezone override.

## Signature

```ts
function format(
  input: Temporal.PlainDate,
  formatStr: string,
  options?: FormatPlainDateOptions & { timeZone?: never }
): string;
function format(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  formatStr: string,
  options?: FormatOptions
): string

interface FormatPlainDateOptions {
  locale?: string;
}

interface FormatOptions {
  locale?: string;
  timeZone?: Timezone;
}
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `Temporal.Instant \| Temporal.ZonedDateTime \| Temporal.PlainDate` | The datetime or calendar date to format |
| `formatStr` | `string` | Format string using date-fns tokens |
| `options.locale` | `string` | Locale for formatting (default: "en-US") |
| `options.timeZone` | `Timezone` | Override timezone for Instant/ZonedDateTime formatting only |

For ISO offset tokens, widths 1–3 omit offset seconds; widths 4–5 include seconds when present. For example, historical Paris `+00:09:21` formats as `+00:09` with `XXX` and `+00:09:21` with `XXXXX`. Uppercase `X` tokens use `Z` only for an actual zero offset.

## Format Tokens

| Token | Example | Description |
|-------|---------|-------------|
| `yyyy` | 2025 | 4-digit year |
| `yy` | 25 | 2-digit year |
| `MMMM` | January | Full month name |
| `MMM` | Jan | Abbreviated month name |
| `MM` | 01 | 2-digit month |
| `M` | 1 | Month number |
| `Mo` | 1st | Month with ordinal |
| `dd` | 20 | 2-digit day |
| `d` | 20 | Day number |
| `do` | 20th | Day with ordinal |
| `EEEE` | Monday | Full weekday name |
| `EEE` | Mon | Abbreviated weekday |
| `HH` | 15 | 24-hour (2-digit) |
| `H` | 15 | 24-hour |
| `hh` | 03 | 12-hour (2-digit) |
| `h` | 3 | 12-hour |
| `mm` | 30 | Minutes (2-digit) |
| `ss` | 45 | Seconds (2-digit) |
| `SSS` | 123 | Milliseconds |
| `a` | PM | AM/PM (locale-aware) |
| `z` | EST | Timezone abbreviation |
| `zzzz` | Eastern Standard Time | Full timezone name |
| `XXX` | -05:00 | Timezone offset (Z for UTC) |
| `X` | +0530 | Timezone offset (Z for UTC); includes minutes |
| `x` | +0530 | Timezone offset; includes minutes |

The offset tokens include the minutes of the offset for zones that need them — India (+05:30) renders as `+0530` and Nepal (+05:45) as `+0545`. The AM/PM tokens (`a`, `aa`, `aaa`, `aaaa`, `aaaaa`) respect the `locale` option, so non-English locales render their own day-period text.

## Examples

### Basic formatting

```ts
import { format } from '@gobrand/tiempo';

const zoned = Temporal.ZonedDateTime.from("2025-01-20T15:00:00-05:00[America/New_York]");

format(zoned, "yyyy-MM-dd");
// "2025-01-20"

format(zoned, "MMMM d, yyyy");
// "January 20, 2025"

format(zoned, "h:mm a");
// "3:00 PM"

format(zoned, "EEEE, MMMM do, yyyy 'at' h:mm a");
// "Monday, January 20th, 2025 at 3:00 PM"
```

### With locale

```ts
format(zoned, "MMMM d, yyyy", { locale: "es-ES" });
// "enero 20, 2025"

format(zoned, "EEEE, d MMMM yyyy", { locale: "fr-FR" });
// "lundi, 20 janvier 2025"
```

### Escaping text

Use single quotes to include literal text:

```ts
format(zoned, "'Today is' EEEE");
// "Today is Monday"

format(zoned, "MMMM do, yyyy 'at' h:mm a");
// "January 20th, 2025 at 3:00 PM"
```

## Common Patterns

### Internationalization

```ts
import { format } from '@gobrand/tiempo';

// Japanese
format(date, "yyyy年M月d日 (EEEE)", { locale: 'ja-JP' });
// "2025年1月20日 (月曜日)"
```

## Calendar dates

```ts
import { format, toPlainDate } from '@gobrand/tiempo';

const birthday = toPlainDate('1990-06-15');
format(birthday, 'yyyy-MM-dd'); // "1990-06-15"
format(birthday, 'MMMM d, yyyy', { locale: 'en-US' }); // "June 15, 1990"
```

Use the date tokens supported by `formatPlainDate`. As in that helper, unsupported time/zone tokens remain literal text; they do not create a time or timezone. For example, `format(birthday, 'HH:mm')` returns `"HH:mm"`. Quote intentional literal text. Passing a `timeZone` option for a PlainDate is rejected by TypeScript and throws a TypeError at runtime.

Instant inputs still default to UTC; ZonedDateTime inputs use their zone unless overridden. `formatPlainDate` remains supported.
