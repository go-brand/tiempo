# Introduction

**tiempo** gives you the functions you know from date-fns (`addDays`, `format`, `differenceInDays`, `startOfMonth`, …) for JavaScript's [Temporal API](https://tc39.es/proposal-temporal/docs/), the replacement for `Date`.

Temporal has separate types for an exact moment, a moment in a timezone, a calendar date and a clock time. tiempo keeps those types intact, so the timezone you meant is the timezone you get.

## What it handles for you

- **Timezones.** Convert a UTC timestamp to `America/New_York` or `Asia/Tokyo`, no matter where your code runs.
- **Daylight saving time.** `addDays` moves to the next calendar day, so a 09:00 reminder stays at 09:00 when the clocks change.
- **Dates that aren't moments.** Birthdays, due dates and holidays stay `PlainDate`s; no timezone is invented for them.
- **Mix-ups.** Comparing a calendar date with a timestamp is a TypeScript error and a runtime `TypeError`, not a silent guess.
- **Precision.** Nanosecond timestamps survive the round trip; `Date` stops at milliseconds.

## A quick look

```ts
import { toZonedTime, format, addDays, differenceInDays, toIso } from '@gobrand/tiempo';

// An order timestamp from your API, shown to a customer in New York
const placedAt = toZonedTime('2026-01-22T19:30:00Z', 'America/New_York');

format(placedAt, 'EEEE, MMMM d, h:mm a'); // "Thursday, January 22, 2:30 PM"

// Delivery promised within 5 days
const deliverBy = addDays(placedAt, 5);
format(deliverBy, 'EEE MMM d'); // "Tue Jan 27"

differenceInDays(deliverBy, placedAt); // 5
toIso(deliverBy); // "2026-01-27T19:30:00Z"
```

New to Temporal? Start with [API conventions](https://tiempo.gobrand.app/docs/api-conventions). Coming from date-fns? See [the mapping](https://tiempo.gobrand.app/docs/date-fns).

## Using tiempo with a coding agent

Point your agent at [llms.txt](https://tiempo.gobrand.app/llms.txt), a plain-text index of every function. If it supports Agent Skills, install the skill:

```bash
npx skills add go-brand/tiempo
```

Agents that discover skills over HTTP can read it at [`/.well-known/agent-skills/tiempo/SKILL.md`](https://tiempo.gobrand.app/.well-known/agent-skills/tiempo/SKILL.md). The package itself installs with `pnpm add @gobrand/tiempo`. More in [AI resources](https://tiempo.gobrand.app/docs/ai-resources).

## Find a function

- [Installation](https://tiempo.gobrand.app/docs/installation): Install tiempo and get Temporal working
- [Coming from date-fns](https://tiempo.gobrand.app/docs/date-fns): The functions you know and what changed
- [Conversion](https://tiempo.gobrand.app/docs/conversion/to-zoned-time): ISO strings, Date objects, timezones, and back
- [Formatting](https://tiempo.gobrand.app/docs/formatting/format): Display dates with date-fns format tokens
- [Arithmetic](https://tiempo.gobrand.app/docs/arithmetic/add-days): Add and subtract days, months, hours, and more
- [Boundaries](https://tiempo.gobrand.app/docs/boundaries/start-of-day): Start and end of a day, week, month, or year
- [Rounding](https://tiempo.gobrand.app/docs/rounding/round-to-nearest-minute): Snap times to the nearest hour, minute, or second
- [Business Days](https://tiempo.gobrand.app/docs/business-days/add-business-days): Skip weekends when counting days
