# toZonedTime

Shows a moment in a timezone. Use it to turn a timestamp from an API or database into a local date and time.

## Signature

```ts
function toZonedTime(
  input: string | number | Date | Temporal.Instant | Temporal.ZonedDateTime,
  timezone: Timezone
): Temporal.ZonedDateTime
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `string \| number \| Date \| Temporal.Instant \| Temporal.ZonedDateTime` | An ISO string with `Z` or an offset, milliseconds since the epoch, a `Date`, an `Instant`, or a `ZonedDateTime`. |
| `timezone` | `Timezone` | An IANA timezone name, such as `'America/New_York'`, or `'UTC'`. |

## Returns

A `Temporal.ZonedDateTime` for the same moment in `timezone`.

## Examples

### Show an API timestamp to a user, then send it back

```ts
import { toZonedTime, format, toIso } from '@gobrand/tiempo';

const local = toZonedTime('2026-06-02T16:30:00Z', 'America/Los_Angeles');
local; // 2026-06-02T09:30:00-07:00[America/Los_Angeles]

format(local, "EEEE, MMMM d 'at' h:mm a"); // "Tuesday, June 2 at 9:30 AM"
toIso(local); // 2026-06-02T16:30:00Z
```

### Show a flight's departure in the arrival city's time

```ts
import { toZonedTime } from '@gobrand/tiempo';

const departure = Temporal.ZonedDateTime.from('2026-03-14T10:30:00[Europe/Madrid]');

toZonedTime(departure, 'America/New_York'); // 2026-03-14T05:30:00-04:00[America/New_York]
```

### Read a Date or a millisecond timestamp from a database

```ts
import { toZonedTime } from '@gobrand/tiempo';

toZonedTime(new Date('2026-03-14T09:30:00.000Z'), 'Asia/Tokyo'); // 2026-03-14T18:30:00+09:00[Asia/Tokyo]
toZonedTime(1773480600000, 'UTC'); // 2026-03-14T09:30:00+00:00[UTC]
```

## Good to know

- A string without `Z` or an offset, such as `'2026-06-02T09:30:00'`, throws a `RangeError`.
- Numbers are milliseconds, not seconds.
