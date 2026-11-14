# Installation

## Install

```package-install
@gobrand/tiempo
```

tiempo runs on Node.js 22+ and in modern browsers. TypeScript is optional; if you use it, 5.0 or later gives you full type inference and timezone autocomplete.

## Where `Temporal` comes from

tiempo depends on [`@js-temporal/polyfill`](https://github.com/js-temporal/temporal-polyfill), so it works whether or not your runtime has Temporal built in. You only need `Temporal` yourself when you create values directly, such as `Temporal.PlainDate.from('2026-03-15')`:

- **Runtimes with built-in Temporal** (Node.js 26+, recent browsers): use the global `Temporal`.
- **Everywhere else**: import it from the polyfill, which is already installed with tiempo.

```ts
import { Temporal } from '@js-temporal/polyfill';
```

The examples in these docs use `Temporal` without an import. tiempo accepts values from either source, and you can mix them.

## First conversion

Most apps receive timestamps as ISO strings or `Date` objects. Convert them into the timezone you care about, work with them, and send UTC back:

```ts
import { toZonedTime, addDays, format, toIso } from '@gobrand/tiempo';

// From your API or database
const createdAt = toZonedTime('2026-03-14T18:30:00Z', 'Europe/Madrid');

format(createdAt, 'EEE d MMM, HH:mm'); // "Sat 14 Mar, 19:30"

const followUp = addDays(createdAt, 3);

toIso(followUp); // "2026-03-17T18:30:00Z"
```

## Databases and ORMs

ORMs usually hand you a `Date` or an ISO string. Drizzle, for example, returns a `Date` for `mode: 'date'` timestamp columns and a string for `mode: 'string'`. `toZonedTime` accepts both, and `toDate` / `toIso` convert back:

```ts
import { toZonedTime, addWeeks, toDate, toIso } from '@gobrand/tiempo';

const post = await db.query.posts.findFirst();

// Works for both Date and ISO string columns
const publishedAt = toZonedTime(post.publishedAt, 'America/New_York');
const republishAt = addWeeks(publishedAt, 1);

await db.update(posts).set({
  republishAt: toDate(republishAt), // mode: 'date'
  // republishAt: toIso(republishAt), // mode: 'string'
});
```

Store UTC (`toIso` or `toDate`) and convert to a timezone only when you need local calendar logic or display.

## Next steps

- [API conventions](https://tiempo.gobrand.app/docs/api-conventions) explains the four value types and argument order.
- [Coming from date-fns](https://tiempo.gobrand.app/docs/date-fns) maps the functions you already know.
- [Recipes](https://tiempo.gobrand.app/docs/recipes) has complete examples for common scheduling tasks.
