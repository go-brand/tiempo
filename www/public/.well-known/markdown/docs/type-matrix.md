# Type Matrix

Every function at a glance — which Temporal types it **accepts** as input and what it **returns**. Generated directly from the current source API.

> **How to read this.** The **accepts** columns mark whether a function takes that Temporal type as a date/time input. **Other in** lists non-Temporal or `*Like` inputs (`string`, `number`, `Date`, `PlainDateLike`, …). **Returns** is the literal return type. `✅` means supported. A written note marks an intentional non-operation. `·` only means the type is not accepted; it is not automatically a missing feature.

The summary combines overloads. For exact input-to-output mappings, optional parameters and required timezones, see [Callable signatures](#callable-signatures).

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
| `toInstant` | ✅ | ✅ | · | · | `string`, `number`, `Date` | `Instant` |
| `toIso` | ✅ | ✅ | · | · | · | `string` |
| `toIso9075` | ✅ | ✅ | · | · | · | `string` |
| `toPlainDate` | ✅ | ✅ | ✅ | · | `string`, `Date`, `PlainDateLike` | `PlainDate` |
| `toPlainTime` | ✅ | ✅ | · | ✅ | `string`, `Date`, `PlainTimeLike` | `PlainTime` |
| `toZonedTime` | ✅ | ✅ | · | · | `string`, `number`, `Date` | `ZonedDateTime` |

## Current Time

| Function | Instant | Zoned | PlainDate | PlainTime | Other in | Returns |
|----------|:-------:|:-----:|:---------:|:---------:|----------|---------|
| `now` | · | · | · | · | · | `ZonedDateTime` |
| `today` | · | · | · | · | · | `PlainDate` |

## Formatting

| Function | Instant | Zoned | PlainDate | PlainTime | Other in | Returns |
|----------|:-------:|:-----:|:---------:|:---------:|----------|---------|
| `format` | ✅ | ✅ | ✅ | · | · | `string` |
| `formatPlainDate` | · | · | ✅ | · | · | `string` |
| `intlFormatDistance` | ✅ | ✅ | · | · | · | `string` |
| `simpleFormat` | ✅ | ✅ | ✅ | · | · | `string` |

## Arithmetic

| Function | Instant | Zoned | PlainDate | PlainTime | Other in | Returns |
|----------|:-------:|:-----:|:---------:|:---------:|----------|---------|
| `addDays` | ✅ | ✅ | ✅ | · | · | `PlainDate` / `ZonedDateTime` |
| `addHours` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `addMicroseconds` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `addMilliseconds` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `addMinutes` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `addMonths` | ✅ | ✅ | ✅ | · | · | `PlainDate` / `ZonedDateTime` |
| `addNanoseconds` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `addQuarters` | ✅ | ✅ | ✅ | · | · | `ZonedDateTime` / `PlainDate` |
| `addSeconds` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `addWeeks` | ✅ | ✅ | ✅ | · | · | `PlainDate` / `ZonedDateTime` |
| `addYears` | ✅ | ✅ | ✅ | · | · | `PlainDate` / `ZonedDateTime` |
| `subDays` | ✅ | ✅ | ✅ | · | · | `PlainDate` / `ZonedDateTime` |
| `subHours` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `subMicroseconds` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `subMilliseconds` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `subMinutes` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `subMonths` | ✅ | ✅ | ✅ | · | · | `PlainDate` / `ZonedDateTime` |
| `subNanoseconds` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `subQuarters` | ✅ | ✅ | ✅ | · | · | `ZonedDateTime` / `PlainDate` |
| `subSeconds` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `subWeeks` | ✅ | ✅ | ✅ | · | · | `PlainDate` / `ZonedDateTime` |
| `subYears` | ✅ | ✅ | ✅ | · | · | `PlainDate` / `ZonedDateTime` |

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
| `isAfter` | ✅ | ✅ | ✅ | ✅ | · | `boolean` |
| `isBefore` | ✅ | ✅ | ✅ | ✅ | · | `boolean` |
| `isEqual` | ✅ | ✅ | ✅ | ✅ | · | `boolean` |
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
| `isToday` | ✅ | ✅ | ✅ | · | · | `boolean` |
| `isTomorrow` | ✅ | ✅ | ✅ | · | · | `boolean` |
| `isWithinInterval` | ✅ | ✅ | · | · | · | `boolean` |
| `isYesterday` | ✅ | ✅ | ✅ | · | · | `boolean` |

## Sorting & Selection

| Function | Instant | Zoned | PlainDate | PlainTime | Other in | Returns |
|----------|:-------:|:-----:|:---------:|:---------:|----------|---------|
| `clamp` | · | · | ✅ | ✅ | · | `T \| S \| E` / `PlainDate` / `PlainTime` |
| `closestTo` | · | · | ✅ | ✅ | · | `T \| undefined` / `PlainDate \| undefined` / `PlainTime \| undefined` |
| `compareAsc` | ✅ | ✅ | ✅ | ✅ | · | `-1 \| 0 \| 1` |
| `compareDesc` | ✅ | ✅ | ✅ | ✅ | · | `-1 \| 0 \| 1` |
| `max` | · | · | ✅ | ✅ | · | `T` / `PlainDate` / `PlainTime` |
| `min` | · | · | ✅ | ✅ | · | `T` / `PlainDate` / `PlainTime` |

## Difference

| Function | Instant | Zoned | PlainDate | PlainTime | Other in | Returns |
|----------|:-------:|:-----:|:---------:|:---------:|----------|---------|
| `differenceInDays` | ✅ | ✅ | ✅ | · | · | `number` |
| `differenceInHours` | ✅ | ✅ | · | · | · | `number` |
| `differenceInMicroseconds` | ✅ | ✅ | · | · | · | `number` |
| `differenceInMilliseconds` | ✅ | ✅ | · | · | · | `number` |
| `differenceInMinutes` | ✅ | ✅ | · | · | · | `number` |
| `differenceInMonths` | ✅ | ✅ | ✅ | · | · | `number` |
| `differenceInNanoseconds` | ✅ | ✅ | · | · | · | `bigint` |
| `differenceInQuarters` | ✅ | ✅ | ✅ | · | · | `number` |
| `differenceInSeconds` | ✅ | ✅ | · | · | · | `number` |
| `differenceInWeeks` | ✅ | ✅ | ✅ | · | · | `number` |
| `differenceInYears` | ✅ | ✅ | ✅ | · | · | `number` |

## Business Days

| Function | Instant | Zoned | PlainDate | PlainTime | Other in | Returns |
|----------|:-------:|:-----:|:---------:|:---------:|----------|---------|
| `addBusinessDays` | ✅ | ✅ | ✅ | · | · | `PlainDate` / `ZonedDateTime` |
| `differenceInBusinessDays` | ✅ | ✅ | ✅ | · | · | `number` |
| `isWeekend` | ✅ | ✅ | ✅ | · | · | `boolean` |
| `subBusinessDays` | ✅ | ✅ | ✅ | · | · | `PlainDate` / `ZonedDateTime` |

## Intervals

| Function | Instant | Zoned | PlainDate | PlainTime | Other in | Returns |
|----------|:-------:|:-----:|:---------:|:---------:|----------|---------|
| `eachDayOfInterval` | ✅ | ✅ | ✅ | · | · | `PlainDate[]` / `ZonedDateTime[]` |
| `eachHourOfInterval` | ✅ | ✅ | · | · | · | `ZonedDateTime[]` |
| `eachMinuteOfInterval` | ✅ | ✅ | · | · | · | `ZonedDateTime[]` |
| `eachMonthOfInterval` | ✅ | ✅ | ✅ | · | · | `PlainDate[]` / `ZonedDateTime[]` |
| `eachQuarterOfInterval` | ✅ | ✅ | ✅ | · | · | `ZonedDateTime[]` / `PlainDate[]` |
| `eachWeekOfInterval` | ✅ | ✅ | ✅ | · | · | `PlainDate[]` / `ZonedDateTime[]` |
| `eachYearOfInterval` | ✅ | ✅ | ✅ | · | · | `PlainDate[]` / `ZonedDateTime[]` |

## Utilities

| Function | Instant | Zoned | PlainDate | PlainTime | Other in | Returns |
|----------|:-------:|:-----:|:---------:|:---------:|----------|---------|
| `browserTimezone` | · | · | · | · | · | `IANATimezone` |
| `getQuarter` | ✅ | ✅ | ✅ | · | · | `1 \| 2 \| 3 \| 4` |
| `roundToNearestHour` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `roundToNearestMinute` | ✅ | ✅ | · | · | · | `ZonedDateTime` |
| `roundToNearestSecond` | ✅ | ✅ | · | · | · | `ZonedDateTime` |

## Callable signatures

Each line is one public overload. Implementation-only unions are omitted. Temporal prefixes are shortened for readability.

### addBusinessDays

```ts
addBusinessDays(input: PlainDate, days: number): PlainDate
addBusinessDays(input: Instant | ZonedDateTime, days: number): ZonedDateTime
```

### addDays

```ts
addDays(input: PlainDate, days: number): PlainDate
addDays(input: Instant | ZonedDateTime, days: number): ZonedDateTime
```

### addHours

```ts
addHours(input: Instant | ZonedDateTime, hours: number): ZonedDateTime
```

### addMicroseconds

```ts
addMicroseconds(input: Instant | ZonedDateTime, microseconds: number): ZonedDateTime
```

### addMilliseconds

```ts
addMilliseconds(input: Instant | ZonedDateTime, milliseconds: number): ZonedDateTime
```

### addMinutes

```ts
addMinutes(input: Instant | ZonedDateTime, minutes: number): ZonedDateTime
```

### addMonths

```ts
addMonths(input: PlainDate, months: number): PlainDate
addMonths(input: Instant | ZonedDateTime, months: number): ZonedDateTime
```

### addNanoseconds

```ts
addNanoseconds(input: Instant | ZonedDateTime, nanoseconds: number): ZonedDateTime
```

### addQuarters

```ts
addQuarters(input: Instant | ZonedDateTime, quarters: number): ZonedDateTime
addQuarters(input: PlainDate, quarters: number): PlainDate
```

### addSeconds

```ts
addSeconds(input: Instant | ZonedDateTime, seconds: number): ZonedDateTime
```

### addWeeks

```ts
addWeeks(input: PlainDate, weeks: number): PlainDate
addWeeks(input: Instant | ZonedDateTime, weeks: number): ZonedDateTime
```

### addYears

```ts
addYears(input: PlainDate, years: number): PlainDate
addYears(input: Instant | ZonedDateTime, years: number): ZonedDateTime
```

### browserTimezone

```ts
browserTimezone(): IANATimezone
```

### clamp

```ts
clamp(value: T, interval: { start: S; end: E }): T | S | E
clamp(value: PlainDate, interval: { start: PlainDate; end: PlainDate }): PlainDate
clamp(value: PlainTime, interval: { start: PlainTime; end: PlainTime }): PlainTime
```

### closestTo

```ts
closestTo(target: Timeline, candidates: readonly T[]): T | undefined
closestTo(target: PlainDate, candidates: readonly PlainDate[]): PlainDate | undefined
closestTo(target: PlainTime, candidates: readonly PlainTime[]): PlainTime | undefined
```

### compareAsc

```ts
compareAsc(date1: PlainDate, date2: PlainDate): -1 | 0 | 1
compareAsc(date1: PlainTime, date2: PlainTime): -1 | 0 | 1
compareAsc(date1: Instant | ZonedDateTime, date2: Instant | ZonedDateTime): -1 | 0 | 1
```

### compareDesc

```ts
compareDesc(date1: PlainDate, date2: PlainDate): -1 | 0 | 1
compareDesc(date1: PlainTime, date2: PlainTime): -1 | 0 | 1
compareDesc(date1: Instant | ZonedDateTime, date2: Instant | ZonedDateTime): -1 | 0 | 1
```

### differenceInBusinessDays

```ts
differenceInBusinessDays(laterDate: PlainDate, earlierDate: PlainDate): number
differenceInBusinessDays(laterDate: Instant | ZonedDateTime, earlierDate: Instant | ZonedDateTime): number
```

### differenceInDays

```ts
differenceInDays(laterDate: PlainDate, earlierDate: PlainDate, options?: DifferenceOptions): number
differenceInDays(laterDate: Instant | ZonedDateTime, earlierDate: Instant | ZonedDateTime, options?: DifferenceOptions): number
```

### differenceInHours

```ts
differenceInHours(laterDate: Instant | ZonedDateTime, earlierDate: Instant | ZonedDateTime, options?: DifferenceOptions): number
```

### differenceInMicroseconds

```ts
differenceInMicroseconds(laterDate: Instant | ZonedDateTime, earlierDate: Instant | ZonedDateTime): number
```

### differenceInMilliseconds

```ts
differenceInMilliseconds(laterDate: Instant | ZonedDateTime, earlierDate: Instant | ZonedDateTime): number
```

### differenceInMinutes

```ts
differenceInMinutes(laterDate: Instant | ZonedDateTime, earlierDate: Instant | ZonedDateTime, options?: DifferenceOptions): number
```

### differenceInMonths

```ts
differenceInMonths(laterDate: PlainDate, earlierDate: PlainDate, options?: DifferenceOptions): number
differenceInMonths(laterDate: Instant | ZonedDateTime, earlierDate: Instant | ZonedDateTime, options?: DifferenceOptions): number
```

### differenceInNanoseconds

```ts
differenceInNanoseconds(laterDate: Instant | ZonedDateTime, earlierDate: Instant | ZonedDateTime): bigint
```

### differenceInQuarters

```ts
differenceInQuarters(laterDate: Instant | ZonedDateTime, earlierDate: Instant | ZonedDateTime, options?: DifferenceOptions): number
differenceInQuarters(laterDate: PlainDate, earlierDate: PlainDate, options?: DifferenceOptions): number
```

### differenceInSeconds

```ts
differenceInSeconds(laterDate: Instant | ZonedDateTime, earlierDate: Instant | ZonedDateTime, options?: DifferenceOptions): number
```

### differenceInWeeks

```ts
differenceInWeeks(laterDate: PlainDate, earlierDate: PlainDate, options?: DifferenceOptions): number
differenceInWeeks(laterDate: Instant | ZonedDateTime, earlierDate: Instant | ZonedDateTime, options?: DifferenceOptions): number
```

### differenceInYears

```ts
differenceInYears(laterDate: PlainDate, earlierDate: PlainDate, options?: DifferenceOptions): number
differenceInYears(laterDate: Instant | ZonedDateTime, earlierDate: Instant | ZonedDateTime, options?: DifferenceOptions): number
```

### eachDayOfInterval

```ts
eachDayOfInterval(interval: { start: PlainDate; end: PlainDate; }): PlainDate[]
eachDayOfInterval(interval: { start: Instant | ZonedDateTime; end: Instant | ZonedDateTime; }): ZonedDateTime[]
```

### eachHourOfInterval

```ts
eachHourOfInterval(interval: { start: Instant | ZonedDateTime; end: Instant | ZonedDateTime; }): ZonedDateTime[]
```

### eachMinuteOfInterval

```ts
eachMinuteOfInterval(interval: { start: Instant | ZonedDateTime; end: Instant | ZonedDateTime; }): ZonedDateTime[]
```

### eachMonthOfInterval

```ts
eachMonthOfInterval(interval: { start: PlainDate; end: PlainDate; }): PlainDate[]
eachMonthOfInterval(interval: { start: Instant | ZonedDateTime; end: Instant | ZonedDateTime; }): ZonedDateTime[]
```

### eachQuarterOfInterval

```ts
eachQuarterOfInterval(interval: { start: Instant | ZonedDateTime; end: Instant | ZonedDateTime; }): ZonedDateTime[]
eachQuarterOfInterval(interval: { start: PlainDate; end: PlainDate; }): PlainDate[]
```

### eachWeekOfInterval

```ts
eachWeekOfInterval(interval: { start: PlainDate; end: PlainDate; }): PlainDate[]
eachWeekOfInterval(interval: { start: Instant | ZonedDateTime; end: Instant | ZonedDateTime; }): ZonedDateTime[]
```

### eachYearOfInterval

```ts
eachYearOfInterval(interval: { start: PlainDate; end: PlainDate; }): PlainDate[]
eachYearOfInterval(interval: { start: Instant | ZonedDateTime; end: Instant | ZonedDateTime; }): ZonedDateTime[]
```

### endOfDay

```ts
endOfDay(input: Instant | ZonedDateTime): ZonedDateTime
endOfDay(input: PlainDate, timezone: Timezone): ZonedDateTime
```

### endOfMonth

```ts
endOfMonth(input: Instant | ZonedDateTime): ZonedDateTime
endOfMonth(input: PlainDate): PlainDate
endOfMonth(input: PlainDate, timezone: Timezone): ZonedDateTime
```

### endOfQuarter

```ts
endOfQuarter(input: Instant | ZonedDateTime): ZonedDateTime
endOfQuarter(input: PlainDate): PlainDate
endOfQuarter(input: PlainDate, timezone: Timezone): ZonedDateTime
```

### endOfWeek

```ts
endOfWeek(input: Instant | ZonedDateTime): ZonedDateTime
endOfWeek(input: PlainDate): PlainDate
endOfWeek(input: PlainDate, timezone: Timezone): ZonedDateTime
```

### endOfYear

```ts
endOfYear(input: Instant | ZonedDateTime): ZonedDateTime
endOfYear(input: PlainDate): PlainDate
endOfYear(input: PlainDate, timezone: Timezone): ZonedDateTime
```

### format

```ts
format(input: PlainDate, formatStr: string, options?: FormatPlainDateOptions & { timeZone?: never }): string
format(input: Instant | ZonedDateTime, formatStr: string, options?: FormatOptions): string
```

### formatPlainDate

```ts
formatPlainDate(date: PlainDate, formatStr: string, options?: FormatPlainDateOptions): string
```

### getQuarter

```ts
getQuarter(input: Instant | ZonedDateTime | PlainDate): 1 | 2 | 3 | 4
```

### intlFormatDistance

```ts
intlFormatDistance(laterDate: Instant | ZonedDateTime, earlierDate: Instant | ZonedDateTime, options?: IntlFormatDistanceOptions): string
```

### isAfter

```ts
isAfter(date1: PlainDate, date2: PlainDate): boolean
isAfter(date1: PlainTime, date2: PlainTime): boolean
isAfter(date1: Instant | ZonedDateTime, date2: Instant | ZonedDateTime): boolean
```

### isBefore

```ts
isBefore(date1: PlainDate, date2: PlainDate): boolean
isBefore(date1: PlainTime, date2: PlainTime): boolean
isBefore(date1: Instant | ZonedDateTime, date2: Instant | ZonedDateTime): boolean
```

### isEqual

```ts
isEqual(date1: PlainDate, date2: PlainDate): boolean
isEqual(date1: PlainTime, date2: PlainTime): boolean
isEqual(date1: Instant | ZonedDateTime, date2: Instant | ZonedDateTime): boolean
```

### isFuture

```ts
isFuture(date: Instant | ZonedDateTime): boolean
```

### isPast

```ts
isPast(date: Instant | ZonedDateTime): boolean
```

### isPlainDateAfter

```ts
isPlainDateAfter(date1: PlainDate, date2: PlainDate): boolean
```

### isPlainDateBefore

```ts
isPlainDateBefore(date1: PlainDate, date2: PlainDate): boolean
```

### isPlainDateEqual

```ts
isPlainDateEqual(date1: PlainDate, date2: PlainDate): boolean
```

### isPlainTimeAfter

```ts
isPlainTimeAfter(time1: PlainTime, time2: PlainTime): boolean
```

### isPlainTimeBefore

```ts
isPlainTimeBefore(time1: PlainTime, time2: PlainTime): boolean
```

### isPlainTimeEqual

```ts
isPlainTimeEqual(time1: PlainTime, time2: PlainTime): boolean
```

### isSameDay

```ts
isSameDay(date1: Instant | ZonedDateTime, date2: Instant | ZonedDateTime): boolean
```

### isSameHour

```ts
isSameHour(date1: Instant | ZonedDateTime, date2: Instant | ZonedDateTime): boolean
```

### isSameMicrosecond

```ts
isSameMicrosecond(date1: Instant | ZonedDateTime, date2: Instant | ZonedDateTime): boolean
```

### isSameMillisecond

```ts
isSameMillisecond(date1: Instant | ZonedDateTime, date2: Instant | ZonedDateTime): boolean
```

### isSameMinute

```ts
isSameMinute(date1: Instant | ZonedDateTime, date2: Instant | ZonedDateTime): boolean
```

### isSameMonth

```ts
isSameMonth(date1: Instant | ZonedDateTime, date2: Instant | ZonedDateTime): boolean
```

### isSameNanosecond

```ts
isSameNanosecond(date1: Instant | ZonedDateTime, date2: Instant | ZonedDateTime): boolean
```

### isSameQuarter

```ts
isSameQuarter(date1: Instant | ZonedDateTime, date2: Instant | ZonedDateTime): boolean
isSameQuarter(date1: PlainDate, date2: PlainDate): boolean
```

### isSameSecond

```ts
isSameSecond(date1: Instant | ZonedDateTime, date2: Instant | ZonedDateTime): boolean
```

### isSameWeek

```ts
isSameWeek(date1: Instant | ZonedDateTime, date2: Instant | ZonedDateTime): boolean
```

### isSameYear

```ts
isSameYear(date1: Instant | ZonedDateTime, date2: Instant | ZonedDateTime): boolean
```

### isToday

```ts
isToday(date: Instant | ZonedDateTime | PlainDate, timezone: Timezone): boolean
```

### isTomorrow

```ts
isTomorrow(date: Instant | ZonedDateTime | PlainDate, timezone: Timezone): boolean
```

### isWeekend

```ts
isWeekend(input: Instant | ZonedDateTime | PlainDate): boolean
```

### isWithinInterval

```ts
isWithinInterval(date: Instant | ZonedDateTime, interval: { start: Instant | ZonedDateTime; end: Instant | ZonedDateTime; }): boolean
```

### isYesterday

```ts
isYesterday(date: Instant | ZonedDateTime | PlainDate, timezone: Timezone): boolean
```

### max

```ts
max(values: readonly T[]): T
max(values: readonly PlainDate[]): PlainDate
max(values: readonly PlainTime[]): PlainTime
```

### min

```ts
min(values: readonly T[]): T
min(values: readonly PlainDate[]): PlainDate
min(values: readonly PlainTime[]): PlainTime
```

### now

```ts
now(timezone: Timezone): ZonedDateTime
```

### roundToNearestHour

```ts
roundToNearestHour(input: Instant | ZonedDateTime, options?: RoundToNearestHourOptions): ZonedDateTime
```

### roundToNearestMinute

```ts
roundToNearestMinute(input: Instant | ZonedDateTime, options?: RoundToNearestMinuteOptions): ZonedDateTime
```

### roundToNearestSecond

```ts
roundToNearestSecond(input: Instant | ZonedDateTime, options?: RoundToNearestSecondOptions): ZonedDateTime
```

### simpleFormat

```ts
simpleFormat(input: PlainDate | ZonedDateTime | Instant, options: SimpleFormatOptions): string
```

### startOfDay

```ts
startOfDay(input: Instant | ZonedDateTime): ZonedDateTime
startOfDay(input: PlainDate, timezone: Timezone): ZonedDateTime
```

### startOfMonth

```ts
startOfMonth(input: Instant | ZonedDateTime): ZonedDateTime
startOfMonth(input: PlainDate): PlainDate
startOfMonth(input: PlainDate, timezone: Timezone): ZonedDateTime
```

### startOfQuarter

```ts
startOfQuarter(input: Instant | ZonedDateTime): ZonedDateTime
startOfQuarter(input: PlainDate): PlainDate
startOfQuarter(input: PlainDate, timezone: Timezone): ZonedDateTime
```

### startOfWeek

```ts
startOfWeek(input: Instant | ZonedDateTime): ZonedDateTime
startOfWeek(input: PlainDate): PlainDate
startOfWeek(input: PlainDate, timezone: Timezone): ZonedDateTime
```

### startOfYear

```ts
startOfYear(input: Instant | ZonedDateTime): ZonedDateTime
startOfYear(input: PlainDate): PlainDate
startOfYear(input: PlainDate, timezone: Timezone): ZonedDateTime
```

### subBusinessDays

```ts
subBusinessDays(input: PlainDate, days: number): PlainDate
subBusinessDays(input: Instant | ZonedDateTime, days: number): ZonedDateTime
```

### subDays

```ts
subDays(input: PlainDate, days: number): PlainDate
subDays(input: Instant | ZonedDateTime, days: number): ZonedDateTime
```

### subHours

```ts
subHours(input: Instant | ZonedDateTime, hours: number): ZonedDateTime
```

### subMicroseconds

```ts
subMicroseconds(input: Instant | ZonedDateTime, microseconds: number): ZonedDateTime
```

### subMilliseconds

```ts
subMilliseconds(input: Instant | ZonedDateTime, milliseconds: number): ZonedDateTime
```

### subMinutes

```ts
subMinutes(input: Instant | ZonedDateTime, minutes: number): ZonedDateTime
```

### subMonths

```ts
subMonths(input: PlainDate, months: number): PlainDate
subMonths(input: Instant | ZonedDateTime, months: number): ZonedDateTime
```

### subNanoseconds

```ts
subNanoseconds(input: Instant | ZonedDateTime, nanoseconds: number): ZonedDateTime
```

### subQuarters

```ts
subQuarters(input: Instant | ZonedDateTime, quarters: number): ZonedDateTime
subQuarters(input: PlainDate, quarters: number): PlainDate
```

### subSeconds

```ts
subSeconds(input: Instant | ZonedDateTime, seconds: number): ZonedDateTime
```

### subWeeks

```ts
subWeeks(input: PlainDate, weeks: number): PlainDate
subWeeks(input: Instant | ZonedDateTime, weeks: number): ZonedDateTime
```

### subYears

```ts
subYears(input: PlainDate, years: number): PlainDate
subYears(input: Instant | ZonedDateTime, years: number): ZonedDateTime
```

### toDate

```ts
toDate(input: Instant | ZonedDateTime): Date
```

### today

```ts
today(timezone: Timezone): PlainDate
```

### toInstant

```ts
toInstant(input: string | number | Date | Instant | ZonedDateTime): Instant
```

### toIso

```ts
toIso(input: Instant): string
toIso(input: ZonedDateTime, options?: ToIsoOptions): string
```

### toIso9075

```ts
toIso9075(input: Instant, options?: Omit<ToIso9075Options, 'mode'>): string
toIso9075(input: ZonedDateTime, options?: ToIso9075Options): string
```

### toPlainDate

```ts
toPlainDate(input: ZonedDateTime): PlainDate
toPlainDate(input: string | Date | Instant | ZonedDateTime, timezone: Timezone): PlainDate
toPlainDate(input: PlainDateLike | string): PlainDate
```

### toPlainTime

```ts
toPlainTime(input: ZonedDateTime): PlainTime
toPlainTime(input: string | Date | Instant | ZonedDateTime, timezone: Timezone): PlainTime
toPlainTime(input: PlainTimeLike | string): PlainTime
```

### toZonedTime

```ts
toZonedTime(input: string | number | Date | Instant | ZonedDateTime, timezone: Timezone): ZonedDateTime
```
