# Tiempo API Semantics

This document audits the public API by the meaning of each Temporal type. The goal is that function names and TypeScript signatures predict behavior without requiring documentation.

## Default Rules

1. `to<Type>` functions are explicit conversions and always return `<Type>`.
2. Temporal normalization helpers accept their target type when that produces a useful composable pipeline.
3. `PlainDate` stays in calendar space for meaningful date-sized operations.
4. Supplying a timezone with a `PlainDate` explicitly bridges calendar space to a `ZonedDateTime`.
5. `ZonedDateTime` operations preserve its timezone unless an explicit timezone override is accepted.
6. Query functions may return scalars: formatting returns `string`, comparisons return `boolean`, differences return `number` or `bigint`, and `getQuarter` returns `1 | 2 | 3 | 4`.
7. Defaults that choose calendar context must be predictable and documented. UTC is the current Instant default; local intent requires an explicit zone. Treat date-only values separately from actual clock times, and gate changes to existing behavior on demonstrated benefit.

## Public API Audit

| Family | Functions | Verdict |
|---|---|---|
| Explicit conversion | `toInstant`, `toZonedTime`, `toPlainDate`, `toPlainTime`, `toDate` | Name predicts the returned type. |
| Serialization | `toIso`, `toIso9075` | Returns a string by design; options choose representation, not Temporal output type. |
| Current values | `now`, `today`, `browserTimezone` | Names and return types are direct: zoned current moment, current date, and timezone identifier. |
| Formatting | `format`, `formatPlainDate`, `simpleFormat`, `intlFormatDistance` | `format` accepts PlainDate through the existing date-only formatter and rejects timezone overrides for dates. Scalar string output is expected. `simpleFormat` has a future tightening opportunity described below. |
| Parsing | `parse` | Inverse of `format` with the same tokens. Without a timezone it returns a PlainDate and rejects time fields; with `timeZone` it returns a ZonedDateTime, and an offset in the text fixes the moment. Requires a year, month, and day; rejects `yy`. |
| Calendar arithmetic | `addDays`, `addWeeks`, `addMonths`, `addQuarters`, `addYears`, `subDays`, `subWeeks`, `subMonths`, `subQuarters`, `subYears` | All listed calendar arithmetic functions accept `PlainDate` and preserve its calendar and date-only type; `ZonedDateTime` inputs remain zoned. `Instant` currently receives implicit UTC calendar context and needs an explicit future breaking-change decision. |
| Timeline arithmetic | `addHours`, `addMinutes`, `addSeconds`, `addMilliseconds`, `addMicroseconds`, `addNanoseconds`, `subHours`, `subMinutes`, `subSeconds`, `subMilliseconds`, `subMicroseconds`, `subNanoseconds` | `ZonedDateTime` is preserved. `Instant -> ZonedDateTime[UTC]` is deterministic but not type-preserving and remains a future breaking-change candidate. |
| Weekday navigation | `nextDay`, `previousDay` | Strictly after or before the input. PlainDate stays a date; ZonedDateTime keeps its zone and wall-clock time; Instant uses UTC. Days are numbered 1 (Monday) to 7 (Sunday); 0 is rejected. |
| Boundaries | `startOfDay`, `endOfDay`, `startOfWeek`, `endOfWeek`, `startOfMonth`, `endOfMonth`, `startOfQuarter`, `endOfQuarter`, `startOfYear`, `endOfYear` | Week functions take `weekStartsOn` (1–7, default Monday). PlainDate week/month/quarter/year boundaries preserve dates. Day moments require a timezone. Instant boundaries currently imply UTC and need an explicit future breaking-change decision. |
| Absolute comparison | `isBefore`, `isAfter`, `isEqual`, `isFuture`, `isPast`, `isWithinInterval`, `areIntervalsOverlapping` | `isBefore`/`isAfter`/`isEqual` additionally accept homogeneous PlainDate or PlainTime pairs and reject cross-domain pairs. Timeline inputs compare exact positions across Instant and ZonedDateTime. |
| Relative days | `isToday`, `isTomorrow`, `isYesterday` | The timezone is required: it defines "today" and the date of timeline inputs. PlainDate inputs compare directly. |
| Sorting and selection | `compareAsc`, `compareDesc`, `min`, `max`, `clamp`, `closestTo` | Same domains and ordering as `isBefore`, through `shared/compare.ts`. Selection returns an input unchanged, preserving its type, zone, and calendar. `min`/`max` throw on an empty array; `closestTo` returns `undefined`; `clamp` throws on a reversed interval. |
| Business days | `isWeekend`, `addBusinessDays`, `subBusinessDays`, `differenceInBusinessDays` | Monday–Friday, plus an optional list of PlainDate holidays. Arithmetic preserves input type and time of day like `addDays`; counts must be integers. `differenceInBusinessDays` counts `[earlier, later)` by calendar date and is antisymmetric. |
| Calendar equality | `isSameDay`, `isSameWeek`, `isSameMonth`, `isSameQuarter`, `isSameYear` | ZonedDateTime and PlainDate semantics are meaningful. Instant inputs currently imply UTC calendar context. |
| Clock equality | `isSameHour`, `isSameMinute`, `isSameSecond`, `isSameMillisecond`, `isSameMicrosecond`, `isSameNanosecond` | Scalar result. Zoned values use wall-clock fields; Instant inputs currently imply UTC fields. |
| Plain comparison | `isPlainDateBefore`, `isPlainDateAfter`, `isPlainDateEqual`, `isPlainTimeBefore`, `isPlainTimeAfter`, `isPlainTimeEqual` | Domain-specific names and homogeneous inputs are explicit and predictable. |
| Calendar difference | `differenceInDays`, `differenceInWeeks`, `differenceInMonths`, `differenceInQuarters`, `differenceInYears` | Scalar result. ZonedDateTime and PlainDate are meaningful; Instant currently implies UTC calendar context. |
| Calendar boundary counts | `differenceInCalendarDays`, `differenceInCalendarWeeks`, `differenceInCalendarMonths`, `differenceInCalendarQuarters`, `differenceInCalendarYears` | Counts boundaries crossed between the two dates, ignoring smaller units. Each value is read in its own timezone (UTC for Instant). Weeks take `weekStartsOn`. Mixed domains are rejected. |
| Timeline difference | `differenceInHours`, `differenceInMinutes`, `differenceInSeconds`, `differenceInMilliseconds`, `differenceInMicroseconds`, `differenceInNanoseconds` | Scalar elapsed-time result is meaningful for Instant and ZonedDateTime. |
| Calendar intervals | `eachDayOfInterval`, `eachWeekOfInterval`, `eachMonthOfInterval`, `eachQuarterOfInterval`, `eachYearOfInterval` | Zoned and supported PlainDate intervals are meaningful. Instant intervals currently become UTC ZonedDateTime arrays. |
| Timeline intervals | `eachHourOfInterval`, `eachMinuteOfInterval` | Zoned intervals preserve timezone. Instant intervals currently become UTC ZonedDateTime arrays rather than Instant arrays. |
| Rounding | `roundToNearestHour`, `roundToNearestMinute`, `roundToNearestSecond` | ZonedDateTime is preserved. Instant currently becomes UTC ZonedDateTime; preserving Instant remains a future breaking-change candidate. |
| Calendar projection | `getQuarter` | Scalar result is obvious for ZonedDateTime and PlainDate. Instant currently implies UTC calendar context. |

## Current Smart Conversions

Tiempo currently normalizes an `Instant` to `ZonedDateTime[UTC]` inside arithmetic, boundary, interval, rounding, same-period, and calendar-difference helpers. The written return types expose this, but the function names do not. Changing it would break existing return types and therefore requires a future breaking release.

Formatting also uses zoned context internally because calendar and clock output cannot be produced from an `Instant` without choosing a timezone. `format` and `simpleFormat` currently default an Instant to UTC when no override is supplied.

`simpleFormat` also permits a `PlainDate` with time-only options and manufactures midnight for formatting. That combination is deterministic but semantically weak and is a candidate for rejection in a future breaking release.

## Stricter Future Contract Candidate

Historical candidate, not an adopted v4 contract. The [8 October roadmap decision audit](reviews/2026-10-08-roadmap-decision-audit.md) withdraws the blanket recommendation to remove deterministic UTC conveniences. Retaining documented UTC defaults is now the baseline; any stricter policy below requires evidence that it improves real tasks enough to justify migration. Instant return-type preservation remains a separate gated candidate. The current-behavior descriptions above still apply.

| Operation kind | Instant | ZonedDateTime | PlainDate |
|---|---|---|---|
| Explicit `to*` conversion | Convert or preserve target type | Convert as named | Convert as named |
| Sub-day arithmetic and rounding | Preserve `Instant` | Preserve `ZonedDateTime` | Unsupported |
| Calendar arithmetic | Require explicit `toZonedTime` first | Preserve `ZonedDateTime` | Preserve `PlainDate` |
| Calendar boundaries and projections | Require explicit `toZonedTime` first | Preserve `ZonedDateTime` | Preserve `PlainDate` where the result is a date |
| Absolute comparison and elapsed difference | Accept | Accept | Use homogeneous PlainDate overloads only |
| Calendar comparison and difference | Require explicit `toZonedTime` first | Accept | Accept homogeneous PlainDate inputs |
| Interval enumeration | Return `Instant[]` only for sub-day timeline steps | Preserve `ZonedDateTime[]` | Return `PlainDate[]` for date-sized steps |
| Formatting | Require explicit timezone | Preserve input timezone unless overridden | Permit date output only; never manufacture a time |

This candidate is intentionally stricter than “whatever goes in comes out.” Type preservation is correct only when the operation is meaningful in that type's domain. An `Instant` has no month, week, day, or local hour until a timezone is chosen.

## Calendar-difference interoperability (current behavior)

`differenceInDays`, `differenceInWeeks`, `differenceInMonths`, `differenceInQuarters`, and `differenceInYears` accept native/polyfill timeline pairs in either direction. Instant inputs use UTC; calendar totals are relative to the second (`earlierDate`) input after normalization. ZonedDateTime pairs may use different zones but must have matching calendar identifiers. PlainDate quarters likewise support mixed implementations with matching calendars. Canonical Temporal strings bridge object-consuming methods without dropping zone, calendar or nanoseconds. Whole results still truncate toward zero; fractional results retain JavaScript number precision limits. The bundled runtime remains polyfill-backed pending a supported-runtime and declaration migration plan. The remaining object-consuming boundaries were audited in the subsequent boundary review.

## Temporal implementation and object identity

Temporal inputs may originate in native Temporal or `@js-temporal/polyfill`. The supported contract is the returned Temporal type and documented value/context, not a single constructor identity for every result. `toInstant(instant)` returns that same object. `toPlainDate(plainDate)` and `toPlainTime(plainTime)` create new values using tiempo’s selected implementation; PlainDate conversion preserves its calendar. Methods invoked directly on input values generally derive results from that input’s implementation. Parsing strings/property bags and month/quarter/year interval construction use tiempo’s implementation. Production remains polyfill-backed.

Month, quarter and year intervals use the start’s calendar and timezone and project the end into that context. PlainDate quarter intervals use the start’s calendar. Quarter starts group ordinal calendar months in threes and realign at each new year; a thirteenth month starts an additional shorter group. This fixes calendar-field loss without imposing ISO interpretation on non-ISO input. Broader quarter API typing and non-ISO semantics remain part of the separate API audit.

## PlainDate day operations

`differenceInDays(laterDate, earlierDate, options?)` accepts two PlainDates with matching calendars and returns signed whole days. Fractional options leave that integer unchanged. `eachDayOfInterval({ start, end })` accepts PlainDate bounds and returns PlainDate[] in the start calendar, including both endpoints; equal bounds produce one date and reversed bounds produce an empty array. Different endpoint calendars are interpreted in the start calendar for enumeration. PlainDate enumeration does not skip dates for timezone transitions. Both APIs reject mixed PlainDate/timeline pairs in types and at runtime. Existing Instant/ZonedDateTime behavior and UTC defaults remain unchanged.

## Complete PlainDate difference and interval families

All existing day/week/month/quarter/year difference functions accept homogeneous PlainDate pairs with matching calendars. Weeks/months/quarters/years support fractional totals; whole results truncate toward zero. Native and polyfill pairs are supported. Day differences remain whole days.

All existing day/week/month/quarter/year interval functions accept homogeneous PlainDate bounds and return PlainDate[]. Weeks start Monday; month/quarter/year functions return the starts of periods touched by the original interval. The first boundary may precede the supplied start. Original reversed bounds produce an empty array. The start calendar determines the context for the end. Mixed PlainDate/timeline bounds are rejected explicitly, including the existing quarter helper. Timeline behavior and signatures remain unchanged.

The [API conventions guide](../www/content/docs/api-conventions.mdx) explains the date-fns-style calling shapes with executable examples. Same-period comparison overloads remain separate work.
