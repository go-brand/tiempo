# tiempo

[![npm version](https://img.shields.io/npm/v/@gobrand/tiempo.svg)](https://www.npmjs.com/package/@gobrand/tiempo)
[![CI](https://github.com/go-brand/tiempo/actions/workflows/ci.yml/badge.svg)](https://github.com/go-brand/tiempo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**date-fns-style functions for the [Temporal API](https://tc39.es/proposal-temporal/docs/).** Convert timezones, do date math that survives daylight saving time, format, parse, and count business days, in TypeScript.

👉 **[Documentation](https://tiempo.gobrand.app)**

![tiempo banner](https://raw.githubusercontent.com/go-brand/tiempo/main/tiempo_banner.png)


- **IANA timezone support** — Named timezone rules and DST handling through Temporal
- **DST-aware math** — `addDays(1)` means tomorrow, even across 23- and 25-hour clock changes
- **Zero-polyfill native entry** — Import from `@gobrand/tiempo/native` on Node.js 26+ and modern browsers (`< 1 kB` gzip per tree-shaken function)
- **Zero-bundle localization** — `format`, `intlFormatDistance`, and `formatDuration` use standard `Intl` (`DateTimeFormat`, `RelativeTimeFormat`, `DurationFormat`) with no locale files to ship
- **Type-safe domains** — Full TypeScript; mixing `PlainDate`, `PlainTime`, and timestamps fails at compile time and throws a `TypeError`
- **Familiar API** — 100+ date-fns-style functions with matching names and argument order ([mapping](https://tiempo.gobrand.app/docs/date-fns))
- **Tested on both runtimes** — Full test suite runs against `@js-temporal/polyfill` and native Node.js 26+ `Temporal` on every commit

```typescript
import { toZonedTime, addDays, format, toIso } from '@gobrand/tiempo';

// Backend sends UTC: Saturday 3:00 AM in New York
const utc = "2026-03-07T08:00:00Z";

// Convert to the user's timezone and add a day across the DST change
const userTime = toZonedTime(utc, "America/New_York");
const tomorrow = addDays(userTime, 1);
format(tomorrow, "EEEE 'at' h:mm a"); // "Sunday at 3:00 AM"

// Send back to the backend as an ISO 8601 string
toIso(tomorrow); // "2026-03-08T07:00:00Z" (23 hours later; clocks moved forward)
```

## Install

```bash
npm install @gobrand/tiempo
```

With Deno, from [JSR](https://jsr.io/@gobrand/tiempo):

```bash
deno add jsr:@gobrand/tiempo
```

Works everywhere out of the box (Node.js 22+ and all modern browsers) — `@gobrand/tiempo` includes [`@js-temporal/polyfill`](https://github.com/js-temporal/temporal-polyfill) so your app never breaks on older runtimes, and accepts native `Temporal` values too.

### Native entry (`@gobrand/tiempo/native`)

Targeting Node.js 26+ or browsers with built-in `Temporal`? Import from `@gobrand/tiempo/native` to drop the polyfill completely — **under 1 kB gzip** per function (`0.56 kB` for `addDays` + `toInstant`, `2.1 kB` for `format`, `8.8 kB` for the full library):

```typescript
import { toZonedTime, addDays, format } from '@gobrand/tiempo/native';
```

## Coming from date-fns

Most names and argument orders are the same. What changes is that every value says what it is:

| date-fns | tiempo |
|---|---|
| `addDays(new Date(), 1)` | `addDays(now('Europe/Madrid'), 1)` |
| `parseISO(str)` | `toZonedTime(str, timezone)` or `toPlainDate(str)` |
| `format(date, 'yyyy-MM-dd')` | `format(value, 'yyyy-MM-dd')` |
| `differenceInDays(later, earlier)` | `differenceInDays(later, earlier)` |
| `formatInTimeZone(date, tz, fmt)` (date-fns-tz) | `format(instant, fmt, { timeZone: tz })` |

The full mapping is at [tiempo.gobrand.app/docs/date-fns](https://tiempo.gobrand.app/docs/date-fns).

## Docs

**[tiempo.gobrand.app](https://tiempo.gobrand.app)** — Full API reference, examples, and guides.

Guides:

- [Replace JavaScript Date with Temporal](https://tiempo.gobrand.app/guides/replace-date-with-temporal)
- [Choose a JavaScript date library](https://tiempo.gobrand.app/guides/choose-a-date-library)
- [Convert UTC to a user's timezone](https://tiempo.gobrand.app/guides/convert-utc-to-timezone)
- [Add days across daylight saving time](https://tiempo.gobrand.app/guides/dst-safe-date-math)
- [Start and end of day in a timezone](https://tiempo.gobrand.app/guides/start-and-end-of-day)
- [Store dates in a database](https://tiempo.gobrand.app/guides/store-dates-in-a-database)
- [Use Temporal in Next.js, tRPC, Zod, Prisma, and Drizzle](https://tiempo.gobrand.app/guides/temporal-in-fullstack-typescript)
- [Count business days with holidays](https://tiempo.gobrand.app/guides/business-days-with-holidays)

For coding agents: [llms.txt](https://tiempo.gobrand.app/llms.txt), or install the Agent Skill with `npx skills add go-brand/tiempo`.

## License

MIT © [Ruben Costa](https://x.com/PonziChad) / [Go Brand](https://gobrand.app)
