# Count business days with holidays

Due dates, delivery estimates, and SLAs usually count business days: Monday to Friday, minus public holidays.

## Add business days

`addBusinessDays` skips Saturdays and Sundays:

```ts
import { addBusinessDays } from '@gobrand/tiempo';

const ordered = Temporal.PlainDate.from('2026-11-20'); // Friday

addBusinessDays(ordered, 3); // 2026-11-25
addBusinessDays(ordered, -1); // 2026-11-19
```

## Skip holidays

Pass the holidays as `PlainDate`s. tiempo does not ship holiday calendars, because they depend on country, region, and company. Load yours from a file, a database, or a library such as `date-holidays`:

```ts
import { addBusinessDays } from '@gobrand/tiempo';

const usHolidays = [
  Temporal.PlainDate.from('2026-11-26'), // Thanksgiving
  Temporal.PlainDate.from('2026-12-25') // Christmas
];
const ordered = Temporal.PlainDate.from('2026-11-24'); // Tuesday

addBusinessDays(ordered, 3); // 2026-11-27
addBusinessDays(ordered, 3, usHolidays); // 2026-11-30
```

## Count business days between two dates

`differenceInBusinessDays` takes the later date first, like date-fns, and accepts the same holiday list:

```ts
import { differenceInBusinessDays } from '@gobrand/tiempo';

const holidays = [Temporal.PlainDate.from('2026-12-25')];
const start = Temporal.PlainDate.from('2026-12-21');
const end = Temporal.PlainDate.from('2026-12-28');

differenceInBusinessDays(end, start); // 5
differenceInBusinessDays(end, start, holidays); // 4
```

## Deadlines with a time of day

With a `ZonedDateTime`, the result keeps the local time, even across a DST change. Holidays are matched against the date in that timezone:

```ts
import { toZonedTime, addBusinessDays, toIso } from '@gobrand/tiempo';

const received = toZonedTime('2026-10-23T15:00:00Z', 'Europe/Berlin'); // Friday 17:00
const due = addBusinessDays(received, 2);

due.toString(); // 2026-10-27T17:00:00+01:00[Europe/Berlin]
toIso(due); // "2026-10-27T16:00:00Z"
```

Clocks in Berlin went back on October 25, so the deadline is still 17:00 local and one hour later in UTC.

## Check a single date

```ts
import { isWeekend } from '@gobrand/tiempo';

isWeekend(Temporal.PlainDate.from('2026-11-21')); // true
```

To treat a holiday as a non-working day, check the list as well: `isWeekend(date) || holidays.some((holiday) => holiday.equals(date))`.

## Related

- [addBusinessDays](https://tiempo.gobrand.app/docs/business-days/add-business-days), [subBusinessDays](https://tiempo.gobrand.app/docs/business-days/sub-business-days), [differenceInBusinessDays](https://tiempo.gobrand.app/docs/business-days/difference-in-business-days)
- [isWeekend](https://tiempo.gobrand.app/docs/business-days/is-weekend)
