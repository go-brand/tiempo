# tiempo — Future Work

Candidate functionality to add, derived from a gap analysis against `date-fns`.
Each item maps cleanly onto Temporal API primitives (no `Date` objects).

Ranked by value + Temporal fit. Check off as shipped (impl + tests + skill reference doc + index export).

Suggested ship order: **1 → 2 → 4** first (clearest demand + best Temporal showcase).

---

## 1. Quarter family — biggest hole

date-fns has full quarter support; tiempo has none.

- [x] `startOfQuarter`
- [x] `endOfQuarter`
- [x] `addQuarters`
- [x] `subQuarters`
- [x] `differenceInQuarters`
- [x] `getQuarter`
- [x] `isSameQuarter`
- [x] `eachQuarterOfInterval`

**Why:** finance/reporting/dashboards live on quarters.
**Temporal fit:** trivial. `add({ months: n * 3 })`, `with({ month: quarterStartMonth, day: 1 })`. Pattern already exists — copy `addMonths` / `startOfMonth`.

## 2. Business-day family — most real-world demand

- [ ] `addBusinessDays`
- [ ] `subBusinessDays`
- [ ] `differenceInBusinessDays`
- [ ] `isWeekend`
- [ ] `isBusinessDay`
- [ ] `nextBusinessDay`
- [ ] `previousBusinessDay`

**Why:** scheduling, SLAs, payroll, delivery dates. Heavy ask in every date lib.
**Temporal fit:** `PlainDate.dayOfWeek` (1=Mon..7=Sun). DST-safe because day stepping stays in zoned space.
**Note:** date-fns has no holiday support. Keep minimal (Rob Pike). Optional holiday-list param only if explicitly requested.

## 3. Selection helpers — cheap, common

- [ ] `min`
- [ ] `max`
- [ ] `clamp`
- [ ] `closestTo`
- [ ] `closestIndexTo`

**Why:** "earliest/latest of these", "pin date into range". One-liners users keep rewriting.
**Temporal fit:** `Temporal.Instant.compare` / `ZonedDateTime.compare`. Few lines each.

## 4. Duration humanizing

- [ ] `intervalToDuration` (span → `{ years, months, days, ... }`)
- [ ] `formatDuration` (duration → "2 hours 30 minutes")

**Why:** complements existing `intlFormatDistance`. Different job: exact breakdown, not fuzzy "in 3 days".
**Temporal fit:** best fit in date-fns. `Temporal.Duration` is native. `since` / `until` with `largestUnit` returns a Duration directly. `formatDuration` via `Intl.DurationFormat` (or `Duration.toLocaleString`).

## 5. Calendar-relative predicates

- [ ] `isToday`
- [ ] `isTomorrow`
- [ ] `isYesterday`
- [ ] `isWeekend` (shared with #2)
- [ ] `isLeapYear`

**Why:** UI labels ("Today", "Tomorrow"), highlight weekends, validation.
**Temporal fit:** compare `PlainDate` vs `today(tz)` (already have `today`). `isLeapYear` = `PlainDate.inLeapYear` prop, free.

---

## Honorable mentions (lower priority / skipped)

- Calendar diffs: `differenceInCalendarDays` vs duration-based `differenceInDays` — subtle distinction, lower demand.
- `set*` helpers (`setHour`, `setDay`, ...) — Temporal `.with()` already covers this ergonomically.
- ISO-week getters: `getISOWeek`, `getISOWeekYear` — niche.
