# Tiempo API Semantics

This document audits the public API by the meaning of each Temporal type. The goal is that function names and TypeScript signatures predict behavior without requiring documentation.

## Default Rules

1. `to<Type>` functions are explicit conversions and always return `<Type>`.
2. Temporal normalization helpers accept their target type when that produces a useful composable pipeline.
3. `PlainDate` stays in calendar space for meaningful date-sized operations.
4. Supplying a timezone with a `PlainDate` explicitly bridges calendar space to a `ZonedDateTime`.
5. `ZonedDateTime` operations preserve its timezone unless an explicit timezone override is accepted.
6. Query functions may return scalars: formatting returns `string`, comparisons return `boolean`, differences return `number` or `bigint`, and `getQuarter` returns `1 | 2 | 3 | 4`.
7. A function must not silently invent calendar or clock context in a future major version.

## Public API Audit

| Family | Functions | Verdict |
|---|---|---|
| Explicit conversion | `toInstant`, `toZonedTime`, `toPlainDate`, `toPlainTime`, `toDate` | Name predicts the returned type. |
| Serialization | `toIso`, `toIso9075` | Returns a string by design; options choose representation, not Temporal output type. |
| Current values | `now`, `today`, `browserTimezone` | Names and return types are direct: zoned current moment, current date, and timezone identifier. |
| Formatting | `format`, `formatPlainDate`, `simpleFormat`, `intlFormatDistance` | Scalar string output is expected. `simpleFormat` has a future tightening opportunity described below. |
| Calendar arithmetic | `addDays`, `addWeeks`, `addMonths`, `addQuarters`, `addYears`, `subDays`, `subWeeks`, `subMonths`, `subQuarters`, `subYears` | `ZonedDateTime` and supported `PlainDate` behavior is meaningful. `Instant` currently receives implicit UTC calendar context and needs an explicit future breaking-change decision. |
| Timeline arithmetic | `addHours`, `addMinutes`, `addSeconds`, `addMilliseconds`, `addMicroseconds`, `addNanoseconds`, `subHours`, `subMinutes`, `subSeconds`, `subMilliseconds`, `subMicroseconds`, `subNanoseconds` | `ZonedDateTime` is preserved. `Instant -> ZonedDateTime[UTC]` is deterministic but not type-preserving and remains a future breaking-change candidate. |
| Boundaries | `startOfDay`, `endOfDay`, `startOfWeek`, `endOfWeek`, `startOfMonth`, `endOfMonth`, `startOfQuarter`, `endOfQuarter`, `startOfYear`, `endOfYear` | PlainDate week/month/quarter/year boundaries preserve dates. Day moments require a timezone. Instant boundaries currently imply UTC and need an explicit future breaking-change decision. |
| Absolute comparison | `isBefore`, `isAfter`, `isFuture`, `isPast`, `isWithinInterval` | Scalar result; comparing exact timeline positions is meaningful across Instant and ZonedDateTime. |
| Calendar equality | `isSameDay`, `isSameWeek`, `isSameMonth`, `isSameQuarter`, `isSameYear` | ZonedDateTime and PlainDate semantics are meaningful. Instant inputs currently imply UTC calendar context. |
| Clock equality | `isSameHour`, `isSameMinute`, `isSameSecond`, `isSameMillisecond`, `isSameMicrosecond`, `isSameNanosecond` | Scalar result. Zoned values use wall-clock fields; Instant inputs currently imply UTC fields. |
| Plain comparison | `isPlainDateBefore`, `isPlainDateAfter`, `isPlainDateEqual`, `isPlainTimeBefore`, `isPlainTimeAfter`, `isPlainTimeEqual` | Domain-specific names and homogeneous inputs are explicit and predictable. |
| Calendar difference | `differenceInDays`, `differenceInWeeks`, `differenceInMonths`, `differenceInQuarters`, `differenceInYears` | Scalar result. ZonedDateTime and PlainDate are meaningful; Instant currently implies UTC calendar context. |
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
