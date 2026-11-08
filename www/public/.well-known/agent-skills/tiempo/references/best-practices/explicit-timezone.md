# Choose the Timezone for Local Intent

Tiempo's Instant arithmetic, boundary, interval and formatting conveniences use deterministic UTC context. They do not infer the host's local timezone. ZonedDateTime inputs retain their zone unless a function explicitly accepts an override.

For UTC reporting, the UTC default is useful. For a person's local day, convert to their zone before calendar work:

```ts
import { toInstant, toZonedTime, startOfDay, format } from '@gobrand/tiempo';

const instant = toInstant('2025-01-01T01:00:00Z');
const utcDay = startOfDay(instant); // 2025-01-01T00:00Z[UTC]
const local = toZonedTime(instant, 'America/New_York');
const localDay = startOfDay(local); // 2024-12-31T00:00-05:00[America/New_York]
const display = format(local, 'yyyy-MM-dd'); // "2024-12-31"
```

Use a stored user timezone when the task concerns that user's calendar. Use `browserTimezone()` when the browser's timezone is the intended context. Functions such as `toZonedTime`, `now` and `today` require an explicit timezone; check the callable signature instead of assuming one uniform parameter list.

Keep birthdays and other date-only values as PlainDate. A timezone is needed when resolving a local date/time to an actual moment, not for every calendar-date operation.

Timezone types offer autocomplete while accepting arbitrary strings for forward compatibility. Temporal validates the identifier when it is used; TypeScript accepting a string does not prove the zone exists.
