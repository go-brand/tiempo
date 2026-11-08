# TypeScript

tiempo's types autocomplete timezone names, return the right Temporal type for your input, and reject calls that mix dates with timestamps.

## Timezone autocomplete

Timezone parameters are typed as `Timezone`, so your editor suggests IANA names as you type.

```ts
import { toZonedTime, type Timezone } from '@gobrand/tiempo';

const officeTimezone: Timezone = 'Europe/Madrid';

toZonedTime('2026-03-14T18:30:00Z', officeTimezone).toString(); // 2026-03-14T19:30:00+01:00[Europe/Madrid]
```

Use it in your own types too:

```ts
import { toZonedTime, format, type Timezone } from '@gobrand/tiempo';

interface UserPreferences {
  timezone: Timezone;
}

function formatForUser(timestamp: string, prefs: UserPreferences): string {
  return format(toZonedTime(timestamp, prefs.timezone), 'EEE d MMM, HH:mm');
}

formatForUser('2026-03-14T18:30:00Z', { timezone: 'Asia/Tokyo' }); // "Sun 15 Mar, 03:30"
```

Any string still compiles, so timezones from a database or the browser work; an unknown name throws a `RangeError` when used.

## Return types follow your input

```ts
import { addDays, toZonedTime } from '@gobrand/tiempo';

const dueDate = addDays(Temporal.PlainDate.from('2026-03-14'), 30); // Temporal.PlainDate
const meeting = addDays(toZonedTime('2026-03-14T17:30:00Z', 'America/New_York'), 1); // Temporal.ZonedDateTime

dueDate.toString(); // 2026-04-13
meeting.toString(); // 2026-03-15T13:30:00-04:00[America/New_York]
```

Options appear only where they apply: `mode` exists for a `ZonedDateTime`, not for an `Instant`.

```ts
import { toIso } from '@gobrand/tiempo';

const flight = Temporal.ZonedDateTime.from('2026-06-01T10:15:00+02:00[Europe/Madrid]');

toIso(flight); // "2026-06-01T08:15:00Z"
toIso(flight, { mode: 'offset' }); // "2026-06-01T10:15:00+02:00"
toIso(flight.toInstant()); // "2026-06-01T08:15:00Z"
```

## Mixing dates and timestamps is a type error

```ts
import { isBefore } from '@gobrand/tiempo';

const dueDate = Temporal.PlainDate.from('2026-03-14');
const paidAt = Temporal.Instant.from('2026-03-13T22:00:00Z');

// @ts-expect-error A calendar date can't be compared with an exact moment
isBefore(paidAt, dueDate);
```

Convert first with `toPlainDate(paidAt, timezone)`.

## Exported types

```ts
import type {
  Timezone,
  IANATimezone,
  IsoMode,
  ToIsoOptions,
  Iso9075Mode,
  Iso9075Representation,
  ToIso9075Options,
  FormatOptions,
  FormatPlainDateOptions,
  SimpleFormatOptions,
  IntlFormatDistanceOptions,
  DifferenceOptions,
  RoundToNearestHourOptions,
  RoundToNearestMinuteOptions,
  RoundToNearestSecondOptions,
} from '@gobrand/tiempo';
```
