# Use Temporal in Next.js, tRPC, Zod, Prisma, and Drizzle

Temporal values are class instances, not plain JSON values. At every boundary — database, HTTP API, or React Server Component — serialize them as strings (or `Date` when an ORM requires it) and convert back into Temporal values where you do date math or formatting.

| Boundary | Send across the wire | Reconstruct with |
|---|---|---|
| Exact moment (`Instant` / `ZonedDateTime`) | UTC ISO string (`toIso(value)`) | `toInstant(str)` or `toZonedTime(str, timezone)` |
| Calendar date (`PlainDate`) | `YYYY-MM-DD` (`date.toString()`) | `toPlainDate(str)` |
| Wall-clock time (`PlainTime`) | `HH:mm` / `HH:mm:ss` (`time.toString()`) | `toPlainTime(str)` |
| ORM timestamp column expecting `Date` | `toDate(value)` | `toZonedTime(date, timezone)` or `toInstant(date)` |

## Next.js Server to Client Components

React Server Components only pass plain JSON-serializable props to Client Components. Passing a `Temporal.ZonedDateTime` or `Temporal.PlainDate` directly throws `"Only plain objects can be passed to Client Components"`.

Convert to strings on the server and format in the user's timezone on the client:

```ts
import { toIso, toZonedTime, format, toPlainDate } from '@gobrand/tiempo';

// Server Component: serialize Temporal values to strings before passing as props
const serverProps = {
  startsAtIso: toIso(Temporal.ZonedDateTime.from('2026-06-15T14:00:00+02:00[Europe/Madrid]')),
  dueDate: Temporal.PlainDate.from('2026-06-30').toString()
};

serverProps.startsAtIso; // "2026-06-15T12:00:00Z"
serverProps.dueDate; // "2026-06-30"

// Client Component: turn strings back into Temporal values for display
const localStart = toZonedTime(serverProps.startsAtIso, 'America/New_York');
const due = toPlainDate(serverProps.dueDate);

format(localStart, 'MMM d, h:mm a'); // "Jun 15, 8:00 AM"
format(due, 'MMMM d, yyyy'); // "June 30, 2026"
```

## tRPC with SuperJSON

If you use tRPC with `superjson`, register custom serializers once in a shared file imported by both client and server. Use `Symbol.toStringTag` (not `instanceof`) so both native `Temporal` and `@js-temporal/polyfill` values serialize cleanly:

```ts
import SuperJSON from 'superjson';
import { Temporal } from '@js-temporal/polyfill'; // or globalThis.Temporal on Node 26+

const tag = (v: unknown) =>
  typeof v === 'object' && v !== null
    ? (v as { [Symbol.toStringTag]?: string })[Symbol.toStringTag]
    : undefined;

SuperJSON.registerCustom<Temporal.Instant, string>(
  {
    isApplicable: (v): v is Temporal.Instant => tag(v) === 'Temporal.Instant',
    serialize: (v) => v.toString(),
    deserialize: (v) => Temporal.Instant.from(v)
  },
  'Temporal.Instant'
);

SuperJSON.registerCustom<Temporal.ZonedDateTime, string>(
  {
    isApplicable: (v): v is Temporal.ZonedDateTime => tag(v) === 'Temporal.ZonedDateTime',
    serialize: (v) => v.toString(),
    deserialize: (v) => Temporal.ZonedDateTime.from(v)
  },
  'Temporal.ZonedDateTime'
);

SuperJSON.registerCustom<Temporal.PlainDate, string>(
  {
    isApplicable: (v): v is Temporal.PlainDate => tag(v) === 'Temporal.PlainDate',
    serialize: (v) => v.toString(),
    deserialize: (v) => Temporal.PlainDate.from(v)
  },
  'Temporal.PlainDate'
);

SuperJSON.registerCustom<Temporal.PlainTime, string>(
  {
    isApplicable: (v): v is Temporal.PlainTime => tag(v) === 'Temporal.PlainTime',
    serialize: (v) => v.toString(),
    deserialize: (v) => Temporal.PlainTime.from(v)
  },
  'Temporal.PlainTime'
);
```

## Zod validation at API and form boundaries

Validate ISO strings at your API or form boundary and transform them into Temporal values once so downstream code never parses strings again:

```tsx
import { z } from 'zod';
import { toInstant, toPlainDate, toPlainTime } from '@gobrand/tiempo';

const instantSchema = z.string().datetime({ offset: true }).transform((s) => toInstant(s));
const plainDateSchema = z.string().date().transform((s) => toPlainDate(s));
const plainTimeSchema = z.string().time().transform((s) => toPlainTime(s));

const bookingInput = z.object({
  createdAt: instantSchema,
  checkIn: plainDateSchema,
  arrivalTime: plainTimeSchema
});
```

## Prisma and Drizzle

Both Prisma and Drizzle return JavaScript `Date` objects for timestamp columns (Drizzle also supports `mode: 'string'`). `toInstant` and `toZonedTime` accept `Date` and ISO strings directly, and `toDate` / `toIso` convert back when writing:

```ts
import { toZonedTime, addDays, toDate, toIso } from '@gobrand/tiempo';

// Value returned by Prisma (`Date`) or Drizzle (`Date` or `string`)
const dbCreatedAt = new Date('2026-05-20T14:45:00.000Z');

const localCreatedAt = toZonedTime(dbCreatedAt, 'America/New_York');
const followUpAt = addDays(localCreatedAt, 7);

toDate(followUpAt).toISOString(); // "2026-05-27T14:45:00.000Z"
toIso(followUpAt); // "2026-05-27T14:45:00Z"
```

For calendar dates (`DATE` columns such as birthdays or due dates), store `YYYY-MM-DD` strings and read them with `toPlainDate` so they never shift across timezones.

## Related

- [Store dates in a database](https://tiempo.gobrand.app/guides/store-dates-in-a-database)
- [Convert UTC to a user's timezone](https://tiempo.gobrand.app/guides/convert-utc-to-timezone)
- [Installation](https://tiempo.gobrand.app/docs/installation)
