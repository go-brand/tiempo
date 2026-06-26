# Plan 005: Give the `differenceIn*` family a consistent contract — truncate by default, opt-in `{ fractional: true }`

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. If a
> "STOP conditions" item occurs, stop and report — do not improvise. When done,
> update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**:
> `git diff --stat 9f5bc98..HEAD -- src/differenceInSeconds.ts src/differenceInMinutes.ts src/differenceInHours.ts src/differenceInDays.ts src/differenceInWeeks.ts src/differenceInMonths.ts src/differenceInYears.ts src/intlFormatDistance.ts src/index.ts`
> If any changed since this plan was written, compare the "Current state"
> excerpts against the live code; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED (intentional breaking change to default return values)
- **Depends on**: none
- **Category**: bug / direction (API consistency)
- **Planned at**: commit `9f5bc98`, 2026-06-25

## Why this matters

The `differenceIn*` family is internally inconsistent. Calendar-ish units return
**fractional** values and sub-day units **truncate**:

- `differenceInDays`, `differenceInWeeks`, `differenceInMonths`,
  `differenceInYears` → `duration.total(...)` → fractional (e.g. `1.5`).
- `differenceInHours`, `differenceInMinutes`, `differenceInSeconds` →
  `Math.trunc(...)` → integer.

So `differenceInDays(a, b)` can return `1.5` while `differenceInHours(a, b)`
returns `1` for a `1.5`-hour gap. Same family, two contracts — surprising, and
undocumented in the `@returns` lines (which just say "the number of days").

**Decision (made by the maintainer):** unify on **truncate-toward-zero by
default** (predictable, the familiar default), with an **opt-in
`{ fractional: true }`** for callers who want precision. This is a breaking
change for the four calendar units, whose default flips from fractional to
truncated; the precise value remains available via the option.

```ts
differenceInDays(a, b)                    // 1     (was 1.5)
differenceInDays(a, b, { fractional: true }) // 1.5
differenceInHours(a, b)                   // 1     (unchanged)
differenceInHours(a, b, { fractional: true }) // 1.5  (now available)
```

`intlFormatDistance` consumes these functions internally and rounds the result;
to keep its output identical it must request `{ fractional: true }` from every
internal call (see Step 3) — otherwise its unit selection and rounding shift.

## Scope of "the family"

Exactly **7 functions** convert across unit boundaries and gain the option:

`differenceInSeconds`, `differenceInMinutes`, `differenceInHours`,
`differenceInDays`, `differenceInWeeks`, `differenceInMonths`,
`differenceInYears`.

**Out of scope** (do NOT add the option):
- `differenceInMilliseconds`, `differenceInMicroseconds`,
  `differenceInNanoseconds` — these already return exact integer/`bigint` counts
  of their own unit; "fractional" is meaningless for them. Leave them untouched.

## Current state

Two implementation shapes today.

**Truncating shape** (`differenceInSeconds.ts:39-47`; minutes/hours identical
but for the divisor):

```ts
export function differenceInSeconds(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime
): number {
  const zoned1 = normalizeTemporalInput(laterDate);
  const zoned2 = normalizeTemporalInput(earlierDate);

  return Math.trunc(differenceInMilliseconds(zoned1, zoned2) / 1000);
}
```
Divisors: seconds `/ 1000`, minutes `/ 60000`, hours `/ 3600000`.

**Fractional shape** (`differenceInMonths.ts:44-53`; days/weeks/years identical
but for the `unit`):

```ts
export function differenceInMonths(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime
): number {
  const zoned1 = normalizeTemporalInput(laterDate);
  const zoned2 = normalizeTemporalInput(earlierDate);

  const duration = zoned2.until(zoned1, { largestUnit: 'hours' });
  return duration.total({ unit: 'months', relativeTo: zoned2 });
}
```
Units: `differenceInDays` → `'days'`, `differenceInWeeks` → `'weeks'`,
`differenceInMonths` → `'months'`, `differenceInYears` → `'years'`.

`intlFormatDistance.ts` calls these internally (`intlFormatDistance.ts:105-110`
for auto-unit detection and `133-158` for the value), then `Math.round`s /
`Math.abs`es the results.

`src/index.ts` re-exports each function (lines 69-78) but no shared options type
yet.

> **Coordination with plan 001**: plan 001 repoints the polyfill import in these
> same files from `@js-temporal/polyfill` to `./shared/temporal`. The two plans
> do not conflict (001 touches the import line, this plan touches the signature,
> body, and JSDoc), but if 001 has already landed, the value import line will
> read `import { Temporal } from './shared/temporal';` — that is fine, leave it.
> Do not change imports in this plan.

### Repo conventions to match
- One options interface per feature, exported alongside it (see
  `FormatOptions` in `src/format.ts`, `RoundToNearestMinuteOptions` in
  `src/roundToNearestMinute.ts`). Follow that style for `DifferenceOptions`.
- Heavy JSDoc with `@param`/`@returns`/`@example`. Update them to match the new
  behavior — stale examples are a documented STOP-worthy hazard for this repo.
- Tests co-located `*.test.ts`, Vitest, exact-value assertions.

## Commands you will need

| Purpose   | Command                                          | Expected |
|-----------|--------------------------------------------------|----------|
| Typecheck | `pnpm typecheck`                                 | exit 0   |
| One file  | `pnpm exec vitest run src/differenceInDays.test.ts` | pass  |
| Full suite| `pnpm exec vitest run`                           | all pass |

## Scope

**In scope** (modify only these):
- **Create** `src/shared/differenceOptions.ts` (the shared option type).
- The **7 impl files**: `differenceInSeconds.ts`, `differenceInMinutes.ts`,
  `differenceInHours.ts`, `differenceInDays.ts`, `differenceInWeeks.ts`,
  `differenceInMonths.ts`, `differenceInYears.ts`.
- `src/intlFormatDistance.ts` — pass `{ fractional: true }` to internal calls.
- `src/index.ts` — export the new type.
- The **7 matching `*.test.ts` files** for the functions above.

**Out of scope** (do NOT touch):
- `differenceInMilliseconds.ts`, `differenceInMicroseconds.ts`,
  `differenceInNanoseconds.ts` and their tests.
- `src/shared/differenceInMilliseconds.ts` (the internal helper) — unchanged.
- `www/content/docs/**` MDX (docs regeneration is a separate follow-up; see
  Maintenance notes).
- Any other function.

## Git workflow

- Branch: `advisor/005-difference-opt-in-fractional`
- Conventional commit, e.g.
  `feat!: differenceIn* truncate by default, add { fractional } option` (the `!`
  marks the breaking change — matches the repo's conventional-commit style).
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Create the shared options type

Create `src/shared/differenceOptions.ts`:

```ts
/**
 * Options for the differenceIn* family (unit-converting members:
 * seconds, minutes, hours, days, weeks, months, years).
 */
export interface DifferenceOptions {
  /**
   * Return the precise fractional value instead of truncating toward zero.
   * @default false
   *
   * @example
   * differenceInDays(a, b);                     // 1   (truncated)
   * differenceInDays(a, b, { fractional: true }); // 1.5 (precise)
   */
  fractional?: boolean;
}
```

**Verify**: `pnpm typecheck` → exit 0.

### Step 2: Add the option to the 7 functions

For each function, add a third parameter `options?: DifferenceOptions`, compute
the **precise** value, then return truncated unless `fractional` is set.

**Truncating trio** (`differenceInSeconds/Minutes/Hours`) — example for seconds:

```ts
import type { DifferenceOptions } from './shared/differenceOptions';
// ...existing imports unchanged...

export function differenceInSeconds(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime,
  options?: DifferenceOptions
): number {
  const zoned1 = normalizeTemporalInput(laterDate);
  const zoned2 = normalizeTemporalInput(earlierDate);

  const precise = differenceInMilliseconds(zoned1, zoned2) / 1000;
  return options?.fractional ? precise : Math.trunc(precise);
}
```
Apply identically to `differenceInMinutes` (`/ 60000`) and `differenceInHours`
(`/ 3600000`). Note this is a pure addition for these three — the default
(`Math.trunc(precise)`) equals today's behavior.

**Fractional four** (`differenceInDays/Weeks/Months/Years`) — example for months:

```ts
import type { DifferenceOptions } from './shared/differenceOptions';
// ...existing imports unchanged...

export function differenceInMonths(
  laterDate: Temporal.Instant | Temporal.ZonedDateTime,
  earlierDate: Temporal.Instant | Temporal.ZonedDateTime,
  options?: DifferenceOptions
): number {
  const zoned1 = normalizeTemporalInput(laterDate);
  const zoned2 = normalizeTemporalInput(earlierDate);

  const duration = zoned2.until(zoned1, { largestUnit: 'hours' });
  const precise = duration.total({ unit: 'months', relativeTo: zoned2 });
  return options?.fractional ? precise : Math.trunc(precise);
}
```
Apply identically to days (`unit: 'days'`), weeks (`'weeks'`), years
(`'years'`). For these four the **default behavior changes** (was `precise`,
now `Math.trunc(precise)`).

**JSDoc updates (required, per repo convention):** in each of the 7 files,
update `@returns` to read like:
`@returns The number of <unit> between the dates, truncated toward zero (pass
{ fractional: true } for the precise value)`
and add `@param options - Optional { fractional } to return the precise value`.

**Fix stale examples** that show a fractional default — at minimum
`differenceInMonths.ts:36-42`, which currently reads:
```ts
 * // Returns fractional months for partial month differences
 * differenceInMonths(later, earlier); // ~0.5 (approximately half a month)
```
Change it to demonstrate the option:
```ts
 * // Pass { fractional: true } for partial-unit precision
 * differenceInMonths(later, earlier);                     // 0
 * differenceInMonths(later, earlier, { fractional: true }); // ~0.5
```
Scan the other six files' `@example` blocks and correct any that assert a
non-integer default result the same way.

**Verify**: `pnpm typecheck` → exit 0.

### Step 3: Preserve `intlFormatDistance` behavior

`intlFormatDistance` must keep producing today's output **byte-for-byte** — that
is the binding invariant of this step.

**Corrected during execution (the original "fractional everywhere" instruction
was wrong):** only the **calendar units** get `{ fractional: true }`. The
sub-day trio (seconds/minutes/hours) was *already truncated* in the old code, so
`Math.round` on it was a no-op; forcing fractional there would feed e.g. `0.5`
into `Math.round` and change output (the `< 1 second` test flips from `now` to
`in 1 second`). So:

- `differenceInSeconds/Minutes/Hours` call sites → **NO** option (keep
  truncated; `Math.round`/threshold logic stays a no-op = old behavior).
- `differenceInDays/Weeks/Months/Years` + the `quarter` case
  (`differenceInMonths(...) / 3`) → `{ fractional: true }` (these were
  fractional before; `Math.round` handled them).

That is **8** `{ fractional: true }` occurrences across the auto-unit detection
block (`~lines 105-110`) and the value `switch` (`~133-158`), not "every call".
Add a one-line comment at these sites so nobody "fixes" the asymmetry later,
e.g. `// calendar units were fractional pre-2.x; sub-day units stay truncated so Math.round is a no-op`.

> Do not change `differenceInMilliseconds`/`Micro`/`Nano` calls — not in this
> family and not called here anyway.

**Verify**:
- `pnpm exec vitest run src/intlFormatDistance.test.ts` → all pass with **no
  changes to that test file** (`git diff --stat src/intlFormatDistance.test.ts`
  is empty). If any assertion fails, the call-site split above is wrong — adjust
  the calls, never the test.

### Step 4: Export the type

In `src/index.ts`, add near the other type exports:

```ts
export type { DifferenceOptions } from './shared/differenceOptions';
```

**Verify**: `pnpm typecheck` → exit 0.

### Step 5: Update the 7 test files

Existing tests assert the *fractional* default for the four calendar units; those
defaults now truncate. Apply this rule to each affected assertion:

> Any existing assertion that expects a **non-integer** value: change the call to
> pass `{ fractional: true }` so it keeps asserting the precise value. Then add a
> sibling assertion (no option) expecting the **truncated** integer.

Known non-integer assertions to convert (from the suite at `9f5bc98`):

| File | Line | Current | After |
|------|------|---------|-------|
| `differenceInDays.test.ts`   | 32  | `.toBe(1.5)`            | `(later, earlier, { fractional: true })).toBe(1.5)` + add `(later, earlier)).toBe(1)` |
| `differenceInDays.test.ts`   | 136 | `.toBeCloseTo(25.166, 1)` | add `{ fractional: true }` to that call |
| `differenceInDays.test.ts`   | 160 | `.toBeCloseTo(89.3, 0)`   | add `{ fractional: true }` |
| `differenceInWeeks.test.ts`  | 41  | `.toBeCloseTo(1.428, 2)`  | add `{ fractional: true }` |
| `differenceInWeeks.test.ts`  | 116 | `.toBeCloseTo(2, 1)`      | add `{ fractional: true }` (was relying on fraction≈2) |
| `differenceInMonths.test.ts` | 114 | `.toBeCloseTo(5, 1)`      | add `{ fractional: true }` |
| `differenceInYears.test.ts`  | 34  | `toBeLessThan(0.55)`      | add `{ fractional: true }` to the call producing `result` |
| `differenceInYears.test.ts`  | 104 | `.toBeCloseTo(5, 1)`      | add `{ fractional: true }` |

Also search each of the 7 test files for any other assertion expecting a
non-integer (e.g. comments like "1.5 months" near a `toBeCloseTo`) and apply the
same rule. `differenceInSeconds/Minutes/Hours` tests should already pass
unchanged (their default was already truncated) — confirm, don't edit unless a
test happened to rely on a value the new precise/trunc split changes (it should
not).

Add at least one explicit truncation test per calendar unit, e.g. in
`differenceInDays.test.ts`:

```ts
it('truncates toward zero by default', () => {
  const later = Temporal.Instant.from('2025-01-22T12:00:00Z');
  const earlier = Temporal.Instant.from('2025-01-21T00:00:00Z'); // 1.5 days
  expect(differenceInDays(later, earlier)).toBe(1);
  expect(differenceInDays(later, earlier, { fractional: true })).toBe(1.5);
  // negative truncates toward zero, not toward -Infinity:
  expect(differenceInDays(earlier, later)).toBe(-1);
  expect(differenceInDays(earlier, later, { fractional: true })).toBe(-1.5);
});
```

**Verify**: `pnpm exec vitest run` → all pass.

### Step 6: Full verification

`pnpm typecheck` → exit 0; `pnpm exec vitest run` → all pass.

## Test plan

- Per calendar unit (days/weeks/months/years): default truncates toward zero;
  `{ fractional: true }` returns the precise value; both directions
  (positive/negative) truncate toward zero, not floor.
- Sub-day units (seconds/minutes/hours): default unchanged; `{ fractional: true }`
  now returns precision (add one such assertion each).
- `intlFormatDistance` output unchanged (its test file untouched and passing).
- Pattern to follow: existing assertions in each `differenceIn*.test.ts`.
- Verification: `pnpm exec vitest run` → all pass.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `src/shared/differenceOptions.ts` exists and exports `DifferenceOptions`.
- [ ] `grep -L "DifferenceOptions" src/differenceInSeconds.ts src/differenceInMinutes.ts src/differenceInHours.ts src/differenceInDays.ts src/differenceInWeeks.ts src/differenceInMonths.ts src/differenceInYears.ts`
      → prints nothing (all 7 reference the type).
- [ ] `grep -c "fractional: true" src/intlFormatDistance.ts` → **8** (calendar
      units + quarter only; sub-day trio stays truncated — see corrected Step 3).
- [ ] `grep -n "DifferenceOptions" src/index.ts` → the export line exists.
- [ ] `pnpm typecheck` exits 0.
- [ ] `pnpm exec vitest run` exits 0; `src/intlFormatDistance.test.ts` passes
      with no diff to that file (`git diff --stat src/intlFormatDistance.test.ts`
      → empty).
- [ ] `differenceInMilliseconds/Micro/Nano` files and tests are unchanged
      (`git status`).
- [ ] `plans/README.md` status row for 005 updated.

## STOP conditions

Stop and report if:
- The drift check shows any in-scope impl changed since `9f5bc98` and the
  excerpts no longer match.
- `intlFormatDistance.test.ts` fails and you cannot make it pass purely by
  adding `{ fractional: true }` to call sites (it would mean its expected output
  genuinely depends on truncation — surface it, don't rewrite the test).
- You find a unit-converting `differenceIn*` not in the 7-function list (none
  should exist) — report rather than guessing whether it gets the option.

## Maintenance notes

- **Docs regeneration follow-up (out of scope):** the `www/content/docs/difference/*`
  MDX and the generated `llms.txt`/skill refs may show fractional defaults.
  Regenerate docs and update those MDX examples in a separate change (run
  `pnpm generate:docs` — but only after plan 002 lands, or it will also write to
  your home directory).
- **Changelog / semver:** this is a breaking default change for
  days/weeks/months/years — it warrants a **minor or major** bump per the repo's
  `pnpm release` flow and a clear note that precise values now require
  `{ fractional: true }`.
- Reviewer focus: confirm `Math.trunc` (toward zero), not `Math.floor`, so
  negatives behave symmetrically; and confirm `intlFormatDistance` output is
  byte-for-byte unchanged.
