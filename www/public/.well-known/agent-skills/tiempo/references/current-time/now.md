# now

Returns the current date and time in the timezone you name.

## Signature

```ts
function now(timezone: Timezone): Temporal.ZonedDateTime
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `timezone` | `Timezone` | An IANA timezone name, such as `'Europe/Madrid'`, or `'UTC'`. |

## Returns

A `Temporal.ZonedDateTime` for the current moment.

## Examples

### Show the current time to a user

```ts
import { now, format } from '@gobrand/tiempo';

const local = now('America/Los_Angeles');

local.timeZoneId; // America/Los_Angeles
const label = format(local, 'EEEE h:mm a'); // for example "Sunday 8:25 AM"
```

### Set a support SLA deadline 4 hours from now

```ts
import { now, addHours, differenceInHours } from '@gobrand/tiempo';

const openedAt = now('UTC');
const replyBy = addHours(openedAt, 4);

differenceInHours(replyBy, openedAt); // 4
```

## Good to know

- For today's date without a time, use [today](https://tiempo.gobrand.app/docs/current-time/today).
