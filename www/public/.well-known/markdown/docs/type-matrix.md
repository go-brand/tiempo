# Type Matrix

Every function at a glance — which Temporal types it **accepts** as input and what it **returns**. Generated directly from the current source API.

> **How to read this.** The **accepts** columns mark whether a function takes that Temporal type as a date/time input. **Other in** lists non-Temporal or `*Like` inputs (`string`, `Date`, `PlainDateLike`, …). **Returns** is the literal return type. `✅` means supported. A written note marks an intentional non-operation. `·` only means the type is not accepted; it is not automatically a missing feature.

## API Rules

- A `to<Type>` function returns `<Type>`. Temporal normalization helpers accept their target type when that produces a useful composable pipeline.
- `ZonedDateTime` operations preserve the input timezone unless an explicit override is part of the signature.
- Date-sized `PlainDate` operations stay in calendar space. Passing a timezone explicitly bridges a `PlainDate` to `ZonedDateTime`.
- Formatting, comparison, difference, and projection functions intentionally return scalar values instead of preserving the input type.
- Many `Instant` operations use implicit UTC calendar context and return `ZonedDateTime`. The table exposes that current contract; changing it would require a future breaking release.

## Conversion

| Function | Instant | Zoned | PlainDate | PlainTime | Other in | Returns |
|----------|:-------:|:-----:|:---------:|:---------:|----------|---------|
| `toDate` | ✅ | ✅ | · | · | · | `Date` |
| `toInstant` | ✅ | ✅ | · | · | `string`, `Date` | `Instant` |
| `toIso` | ✅ | ✅ | · | · | · | `string` |
| `toIso9075` | ✅ | ✅ | · | · | · | `string` |
| `toPlainDate` | ✅ | ✅ | ✅ | · | `string`, `Date`, `PlainDateLike` | `PlainDate` |
| `toPlainTime` | ✅ | ✅ | · | ✅ | `string`, `Date`, `PlainTimeLike` | `PlainTime` |
| `toZonedTime` | ✅ | ✅ | · | · | `string`, `Date` | `ZonedDateTime` |

## Current Time

| Function | Instant | Zoned | PlainDate | PlainTime | Other in | Returns |
|----------|:-------:|:-----:|:---------:|:---------:|----------|---------|
| `now` | · | · | · | · | · | `ZonedDateTime` |
| `today` | · | · | · | · | · | `PlainDate` |

## Formatting

| Function | Instant | Zoned | PlainDate | PlainTime | Other in | Returns |
|----------|:-------:|:-----:|:---------:|:---------:|----------|---------|
| `format` | ✅ | ✅ | · | · | `string` | `string` |
| `formatPlainDate` | · | · | ✅ | · | `string` | `string` |
| `intlFormatDistance` | ✅ | ✅ | · | · | · | `string` |
| `simpleFormat` | ✅ | ✅ | ✅ | · | · | `string` |

## Arithmetic

| Function | Instant | Zoned | PlainDate | PlainTime | Other in | Returns |
|----------|:-------:|:-----:|:---------:|:---------:|----------|---------|
| `addDays` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `addHours` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `addMicroseconds` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `addMilliseconds` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `addMinutes` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `addMonths` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `addNanoseconds` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `addQuarters` | ✅ | ✅ | ✅ | · | · | `ZonedDateTime` / `PlainDate` |
| `addSeconds` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `addWeeks` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `addYears` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `subDays` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `subHours` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `subMicroseconds` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `subMilliseconds` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `subMinutes` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `subMonths` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `subNanoseconds` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `subQuarters` | ✅ | ✅ | ✅ | · | · | `ZonedDateTime` / `PlainDate` |
| `subSeconds` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `subWeeks` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `subYears` | ✅ | ✅ | · | · | · | `ZonedDateTime` |

## Boundaries

| Function | Instant | Zoned | PlainDate | PlainTime | Other in | Returns |
|----------|:-------:|:-----:|:---------:|:---------:|----------|---------|
| `endOfDay` | ✅ | ✅ | ✅ | · | · | `ZonedDateTime` |
| `endOfMonth` | ✅ | ✅ | ✅ | · | · | `ZonedDateTime` / `PlainDate` |
| `endOfQuarter` | ✅ | ✅ | ✅ | · | · | `ZonedDateTime` / `PlainDate` |
| `endOfWeek` | ✅ | ✅ | ✅ | · | · | `ZonedDateTime` / `PlainDate` |
| `endOfYear` | ✅ | ✅ | ✅ | · | · | `ZonedDateTime` / `PlainDate` |
| `startOfDay` | ✅ | ✅ | ✅ | · | · | `ZonedDateTime` |
| `startOfMonth` | ✅ | ✅ | ✅ | · | · | `ZonedDateTime` / `PlainDate` |
| `startOfQuarter` | ✅ | ✅ | ✅ | · | · | `ZonedDateTime` / `PlainDate` |
| `startOfWeek` | ✅ | ✅ | ✅ | · | · | `ZonedDateTime` / `PlainDate` |
| `startOfYear` | ✅ | ✅ | ✅ | · | · | `ZonedDateTime` / `PlainDate` |

## Comparison

| Function | Instant | Zoned | PlainDate | PlainTime | Other in | Returns |
|----------|:-------:|:-----:|:---------:|:---------:|----------|---------|
| `isAfter` | ✅ | ✅ | · | · | · | `boolean` |
| `isBefore` | ✅ | ✅ | · | · | · | `boolean` |
| `isFuture` | ✅ | ✅ | · | · | · | `boolean` |
| `isPast` | ✅ | ✅ | · | · | · | `boolean` |
| `isPlainDateAfter` | · | · | ✅ | · | · | `boolean` |
| `isPlainDateBefore` | · | · | ✅ | · | · | `boolean` |
| `isPlainDateEqual` | · | · | ✅ | · | · | `boolean` |
| `isPlainTimeAfter` | · | · | · | ✅ | · | `boolean` |
| `isPlainTimeBefore` | · | · | · | ✅ | · | `boolean` |
| `isPlainTimeEqual` | · | · | · | ✅ | · | `boolean` |
| `isSameDay` | ✅ | ✅ | · | · | · | `boolean` |
| `isSameHour` | ✅ | ✅ | · | · | · | `boolean` |
| `isSameMicrosecond` | ✅ | ✅ | · | · | · | `boolean` |
| `isSameMillisecond` | ✅ | ✅ | · | · | · | `boolean` |
| `isSameMinute` | ✅ | ✅ | · | · | · | `boolean` |
| `isSameMonth` | ✅ | ✅ | · | · | · | `boolean` |
| `isSameNanosecond` | ✅ | ✅ | · | · | · | `boolean` |
| `isSameQuarter` | ✅ | ✅ | ✅ | · | · | `boolean` |
| `isSameSecond` | ✅ | ✅ | · | · | · | `boolean` |
| `isSameWeek` | ✅ | ✅ | · | · | · | `boolean` |
| `isSameYear` | ✅ | ✅ | · | · | · | `boolean` |
| `isWithinInterval` | ✅ | ✅ | · | · | · | `boolean` |

## Difference

| Function | Instant | Zoned | PlainDate | PlainTime | Other in | Returns |
|----------|:-------:|:-----:|:---------:|:---------:|----------|---------|
| `differenceInDays` | ✅ | ✅ | · | · | · | `number` |
| `differenceInHours` | ✅ | ✅ | · | · | · | `number` |
| `differenceInMicroseconds` | ✅ | ✅ | · | · | · | `number` |
| `differenceInMilliseconds` | ✅ | ✅ | · | · | · | `number` |
| `differenceInMinutes` | ✅ | ✅ | · | · | · | `number` |
| `differenceInMonths` | ✅ | ✅ | · | · | · | `number` |
| `differenceInNanoseconds` | ✅ | ✅ | · | · | · | `bigint` |
| `differenceInQuarters` | ✅ | ✅ | ✅ | · | · | `number` |
| `differenceInSeconds` | ✅ | ✅ | · | · | · | `number` |
| `differenceInWeeks` | ✅ | ✅ | · | · | · | `number` |
| `differenceInYears` | ✅ | ✅ | · | · | · | `number` |

## Intervals

| Function | Instant | Zoned | PlainDate | PlainTime | Other in | Returns |
|----------|:-------:|:-----:|:---------:|:---------:|----------|---------|
| `eachDayOfInterval` | ✅ | ✅ | · | · | · | `ZonedDateTime[]` |
| `eachHourOfInterval` | ✅ | ✅ | · | · | · | `ZonedDateTime[]` |
| `eachMinuteOfInterval` | ✅ | ✅ | · | · | · | `ZonedDateTime[]` |
| `eachMonthOfInterval` | ✅ | ✅ | · | · | · | `ZonedDateTime[]` |
| `eachQuarterOfInterval` | ✅ | ✅ | ✅ | · | · | `ZonedDateTime[]` / `PlainDate[]` |
| `eachWeekOfInterval` | ✅ | ✅ | · | · | · | `ZonedDateTime[]` |
| `eachYearOfInterval` | ✅ | ✅ | · | · | · | `ZonedDateTime[]` |

## Utilities

| Function | Instant | Zoned | PlainDate | PlainTime | Other in | Returns |
|----------|:-------:|:-----:|:---------:|:---------:|----------|---------|
| `browserTimezone` | · | · | · | · | · | `IANATimezone` |
| `getQuarter` | ✅ | ✅ | ✅ | · | · | `1 \| 2 \| 3 \| 4` |
| `roundToNearestHour` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `roundToNearestMinute` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `roundToNearestSecond` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
