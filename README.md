# tiempo

[![npm version](https://img.shields.io/npm/v/@gobrand/tiempo.svg)](https://www.npmjs.com/package/@gobrand/tiempo)
[![CI](https://github.com/go-brand/tiempo/actions/workflows/ci.yml/badge.svg)](https://github.com/go-brand/tiempo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**date-fns-style functions for the [Temporal API](https://tc39.es/proposal-temporal/docs/).** Convert timezones, do date math that survives daylight saving time, format, parse, and count business days, in TypeScript.

👉 **[Documentation](https://tiempo.gobrand.app)**

![tiempo banner](./tiempo_banner.png)


- **IANA timezone support** - Named timezone rules and DST handling through Temporal
- **DST-aware math** - `addDays(1)` means tomorrow, even across clock changes
- **Nanosecond precision** - When milliseconds aren't enough
- **Type-safe** - Full TypeScript, catches datetime errors at compile time
- **Familiar API** - date-fns names and argument order ([mapping](https://tiempo.gobrand.app/docs/date-fns))

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

Runs on Node.js 22+ and in modern browsers. tiempo depends on [`@js-temporal/polyfill`](https://github.com/js-temporal/temporal-polyfill), so it works whether or not your runtime has Temporal built in, and it accepts values from native `Temporal` (Node.js 26+) too.

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

- [Replace JavaScript Date with Temporal](https://tiempo.gobrand.app/docs/guides/replace-date-with-temporal)
- [Convert UTC to a user's timezone](https://tiempo.gobrand.app/docs/guides/convert-utc-to-timezone)
- [Add days across daylight saving time](https://tiempo.gobrand.app/docs/guides/dst-safe-date-math)
- [Start and end of day in a timezone](https://tiempo.gobrand.app/docs/guides/start-and-end-of-day)
- [Store dates in a database](https://tiempo.gobrand.app/docs/guides/store-dates-in-a-database)
- [Count business days with holidays](https://tiempo.gobrand.app/docs/guides/business-days-with-holidays)

For coding agents: [llms.txt](https://tiempo.gobrand.app/llms.txt), or install the Agent Skill with `npx skills add go-brand/tiempo`.

## License

MIT © [Ruben Costa](https://x.com/PonziChad) / [Go Brand](https://gobrand.app)
