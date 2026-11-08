# Store Timestamps in UTC; Preserve Calendar Intent

Use UTC for exact timestamps such as audit events and expiry times. A birthday is a calendar date, not a timestamp. Future local appointments and recurring schedules may also need their local date/time and IANA timezone retained, so their intended wall time survives timezone-rule changes.

## Timestamp Round Trip

```ts
import { toZonedTime, toIso, format } from '@gobrand/tiempo';

const utcFromApi = '2025-03-09T07:00:00Z';
const userTime = toZonedTime(utcFromApi, 'America/New_York');
const display = format(userTime, "EEEE 'at' h:mm a"); // "Sunday at 3:00 AM"
const payload = toIso(userTime); // "2025-03-09T07:00:00Z"
```

Choose the display timezone from a user preference or `browserTimezone()` when that matches the task. The exact string above assumes New York; a browser in another zone displays another local time.

An ISO timestamp with an offset already identifies an instant. An offset alone does not identify the timezone rules for future local scheduling. `toZonedTime` parses offset-bearing timestamps; passing a target zone does not make an offsetless string into a local appointment.

## Calendar Dates and Local Appointments

```ts
import { Temporal } from '@js-temporal/polyfill';
import { toPlainDate, toIso } from '@gobrand/tiempo';

const birthday = toPlainDate('1990-06-15');
const storedBirthday = birthday.toString(); // "1990-06-15"

const local = Temporal.PlainDateTime.from('2025-11-02T01:30');
const timezone = 'America/New_York';
const appointment = local.toZonedDateTime(timezone, { disambiguation: 'later' });
const storedAppointment = {
  local: local.toString(),
  timezone,
  disambiguation: 'later',
  instant: toIso(appointment), // "2025-11-02T06:30:00Z"
};
```

Select the missing/repeated-time policy for the application. For a recurrence, retain the recurrence rule and local timezone intent too; one resolved instant does not describe future occurrences.

## Database Boundaries

`toIso(value)` produces a UTC timestamp. `toIso9075(value)` provides SQL-style output; verify that the database column and connection interpret it as UTC because the text carries no offset. Use `toDate(value)` only for APIs/ORMs requiring legacy Date objects; perform datetime arithmetic with Temporal.
