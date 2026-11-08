# tiempo

[![npm version](https://img.shields.io/npm/v/@gobrand/tiempo.svg)](https://www.npmjs.com/package/@gobrand/tiempo)
[![CI](https://github.com/go-brand/tiempo/actions/workflows/ci.yml/badge.svg)](https://github.com/go-brand/tiempo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Timezone conversions that don't suck.** Built on the [Temporal API](https://tc39.es/proposal-temporal/docs/).

👉 **[Documentation](https://tiempo.gobrand.app)**

![tiempo banner](./tiempo_banner.png)


- **IANA timezone support** - Named timezone rules and DST handling through Temporal
- **DST-aware math** - `addDays(1)` means tomorrow, even across clock changes
- **Nanosecond precision** - When milliseconds aren't enough
- **Type-safe** - Full TypeScript, catches datetime errors at compile time
- **Familiar API** - date-fns names and argument order ([mapping](https://tiempo.gobrand.app/docs/date-fns))

```typescript
import { toZonedTime, addDays, format, toIso } from '@gobrand/tiempo';

// Backend sends UTC
const utc = "2025-03-09T07:00:00Z";

// Convert to user's timezone, manipulate, format
const userTime = toZonedTime(utc, "America/New_York");
const tomorrow = addDays(userTime, 1);  // DST transition handled correctly
const display = format(tomorrow, "EEEE 'at' h:mm a");  // "Monday at 3:00 AM"

// Send back to backend as ISO 8601 string
const payload = toIso(tomorrow);  // "2025-03-10T07:00:00Z"
```

## Install

```bash
npm install @gobrand/tiempo
```

## Docs

**[tiempo.gobrand.app](https://tiempo.gobrand.app)** — Full API reference, examples, and guides.

For coding agents: [llms.txt](https://tiempo.gobrand.app/llms.txt), or install the Agent Skill with `npx skills add go-brand/tiempo`.

## License

MIT © [Ruben Costa](https://x.com/PonziChad) / [Go Brand](https://gobrand.app)
