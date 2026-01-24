# simpleFormat

Format a Temporal date in a human-friendly way: "Dec 23" or "Dec 23, 2020".

By default, shows the year only if the date is not in the current year. Optionally includes time in 12-hour or 24-hour format.

## Signature

```ts
function simpleFormat(input: Temporal.PlainDate, options?: PlainDateOptions): string;
function simpleFormat(input: Temporal.ZonedDateTime, options?: ZonedDateTimeOptions): string;
function simpleFormat(input: Temporal.Instant, options: InstantOptions): string;
```

## Options

| Option | Type | Description |
|--------|------|-------------|
| `locale` | `string` | Locale for formatting (default: "en-US") |
| `year` | `'auto' \| 'always' \| 'never'` | When to show the year (default: "auto") |
| `time` | `'12h' \| '24h'` | Include time (only for ZonedDateTime/Instant) |
| `timeZone` | `Timezone` | Timezone (required for Instant, optional for ZonedDateTime) |

## Examples

### Basic usage

```ts
import { simpleFormat } from '@gobrand/tiempo';

// Assuming current year is 2026
const date2026 = Temporal.ZonedDateTime.from("2026-12-23T15:30:00[America/New_York]");
const date2020 = Temporal.ZonedDateTime.from("2020-12-23T15:30:00[America/New_York]");

simpleFormat(date2026);
// "Dec 23"

simpleFormat(date2020);
// "Dec 23, 2020"
```

### With time

```ts
simpleFormat(date2026, { time: '12h' });
// "Dec 23, 3:30 PM"

simpleFormat(date2026, { time: '24h' });
// "Dec 23, 15:30"
```

### Control year display

```ts
simpleFormat(date2026, { year: 'always' });
// "Dec 23, 2026"

simpleFormat(date2020, { year: 'never' });
// "Dec 23"
```

### With Instant (timeZone required)

```ts
const instant = Temporal.Instant.from("2026-12-23T20:30:00Z");

simpleFormat(instant, { timeZone: 'America/New_York' });
// "Dec 23"

simpleFormat(instant, { timeZone: 'America/New_York', time: '12h' });
// "Dec 23, 3:30 PM"
```

### With PlainDate (no time option)

```ts
const plain = Temporal.PlainDate.from("2020-12-23");

simpleFormat(plain);
// "Dec 23, 2020"
```

## Common Patterns

### Card timestamps

```ts
import { simpleFormat } from '@gobrand/tiempo';

const cardDate = simpleFormat(post.createdAt);
// "Jan 23" or "Jan 23, 2024"
```

### Localization

```ts
simpleFormat(date, { locale: 'fr-FR' });
// "23 déc."
```
