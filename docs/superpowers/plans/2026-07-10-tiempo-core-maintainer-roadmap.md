# Tiempo Core Maintainer Roadmap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Tiempo browser-safe and native-Temporal-ready, establish a coherent input/output policy for Temporal types, extend existing calendar-capable APIs consistently, and turn the Type Matrix into an enforceable public-contract artifact.

**Architecture:** Keep the library's direct, function-per-file design. Normalize foreign Temporal objects exactly once at the package boundary, then let each public function express its own calendar or timeline semantics through explicit overloads. Generate the Type Matrix from overload signatures, but preserve each overload's input, timezone requirement, and return type instead of flattening all parameters together.

**Tech Stack:** TypeScript 5.9, `@js-temporal/polyfill`, Vitest, tsup/esbuild, Fumadocs MDX, TanStack Start, pnpm, GitHub Actions.

## Global Constraints

- Preserve all existing uncommitted quarter-family and Type Matrix work. Do not reset, stash, overwrite, or silently reformat unrelated changes.
- Do not publish an npm version or deploy the website as part of this plan.
- Use Temporal primitives for datetime logic. JavaScript `Date` remains allowed only at explicit interop boundaries such as `toDate`, `toInstant`, and `toZonedTime`.
- `PlainDate` is calendar-only. Never add it to hours, minutes, seconds, sub-second arithmetic, time rounding, or hour/minute interval functions.
- `PlainTime` remains time-only. This plan adds comparison routing only; it does not add date or timezone semantics.
- Week and quarter helpers use ISO-8601 calendar conventions. Do not claim general non-ISO calendar support in v2 documentation.
- Preserve the current v2 rule that `Instant` calendar operations normalize through UTC and return `ZonedDateTime`. A same-type `Instant -> Instant` redesign is a separate v3 decision because it is breaking.
- Additive overloads are allowed in v2. Existing exports remain available; compatibility helpers delegate to the smarter general function instead of being removed.
- MDX files under `www/content/docs/` remain the API documentation source of truth. Regenerate skills and `llms.txt` through `pnpm generate:docs`.
- Every behavior change starts with a failing test, then the smallest implementation that makes it pass.
- Before execution, inspect and commit the current quarter/matrix baseline separately, or reproduce that baseline in an isolated worktree by applying a reviewed patch. Do not begin Task 1 on a dirty baseline and do not create a clean worktree from `HEAD` without carrying the current quarter/matrix work into it.

---

## File Structure

### New files

- `scripts/check-browser-bundle.ts` — bundles the built package for a browser and evaluates it without Node globals.
- `src/shared/normalizeTemporalValue.ts` — converts native/polyfill Temporal values into Tiempo's selected internal implementation.
- `src/shared/temporalInterop.test.ts` — verifies native/polyfill values can cross the package boundary in either direction.
- `src/plainDateCalendar.test.ts` — cross-family contract tests for calendar-only arithmetic and boundaries.
- `src/plainDateRelations.test.ts` — cross-family contract tests for comparisons, differences, and intervals.
- `docs/api-semantics.md` — maintainer contract defining meaningful operations and return types per Temporal type.
- `scripts/capability-matrix.ts` — pure AST analysis and rendering logic for the matrix.
- `scripts/capability-matrix.test.ts` — generator fixture tests.

### Existing files with focused changes

- `src/shared/temporal.ts` — browser-safe test-mode selection and `isPlainTime` guard.
- `src/shared/normalizeTemporalInput.ts` — canonicalizes timeline objects before use.
- Quarter-family and plain comparison files — canonicalize `PlainDate`/`PlainTime` objects.
- Calendar arithmetic, boundary, comparison, difference, and interval function files — add explicit `PlainDate` overloads where semantics are meaningful.
- `scripts/capability-matrix-semantics.ts` — records intentional non-operations without inventing public overloads.
- `scripts/capability-matrix-semantics.test.ts` — protects the distinction between unsupported and unnecessary inputs.
- `scripts/generate-capability-matrix.ts` — thin CLI calling the pure matrix module.
- `scripts/generate-docs.ts` — surface the matrix in `llms.txt` and `skills/tiempo/SKILL.md`.
- `www/content/docs/type-matrix.mdx` — regenerated overload-aware matrix.
- `www/src/components/button.tsx` — remove stale Fumadocs utility import and conflicting prop intersection.
- `package.json`, `pnpm-lock.yaml`, `.github/workflows/ci.yml` — browser smoke and website typecheck gates.

---

### Task 0: Establish the reviewed quarter/matrix baseline

**Files:**
- Verify and commit: the existing quarter-family source/tests/docs, matrix generator/page/navigation, and root build wiring
- Preserve without staging: `AGENTS.md` and any unrelated user files
- Commit separately: `docs/superpowers/plans/2026-07-10-tiempo-core-maintainer-roadmap.md`

**Interfaces:**
- Produces: a clean, reviewed baseline containing the current PlainDate quarter behavior and Type Matrix
- Required by: every later task and commit command

- [ ] **Step 1: Inspect the existing work before staging it**

```bash
git status --short
git diff --check
git diff --stat
```

Expected: only the known quarter/matrix work, `AGENTS.md`, and this plan are present. Stop if unrelated files appear; do not absorb them into the baseline.

- [ ] **Step 2: Verify the current baseline behavior**

```bash
pnpm test --run
pnpm typecheck
pnpm generate:matrix
```

Expected: the full existing suite plus the semantic-matrix tests pass on the current polyfill project, typecheck exits 0, and matrix generation succeeds.

- [ ] **Step 3: Commit only the existing quarter/matrix implementation**

```bash
git add \
  package.json \
  scripts/capability-matrix-semantics.ts \
  scripts/capability-matrix-semantics.test.ts \
  scripts/generate-capability-matrix.ts \
  src/{addQuarters,differenceInQuarters,eachQuarterOfInterval,endOfQuarter,getQuarter,isSameQuarter,startOfQuarter,subQuarters}.ts \
  src/{addQuarters,differenceInQuarters,eachQuarterOfInterval,endOfQuarter,getQuarter,isSameQuarter,startOfQuarter,subQuarters}.test.ts \
  www/content/docs/meta.json \
  www/content/docs/type-matrix.mdx \
  www/content/docs/arithmetic/{add-quarters,sub-quarters}.mdx \
  www/content/docs/boundaries/{start-of-quarter,end-of-quarter}.mdx \
  www/content/docs/comparison/is-same-quarter.mdx \
  www/content/docs/difference/difference-in-quarters.mdx \
  www/content/docs/intervals/each-quarter-of-interval.mdx \
  www/content/docs/utilities/get-quarter.mdx \
  skills/tiempo/references/arithmetic/{add-quarters,sub-quarters}.md \
  skills/tiempo/references/boundaries/{start-of-quarter,end-of-quarter}.md \
  skills/tiempo/references/comparison/is-same-quarter.md \
  skills/tiempo/references/difference/difference-in-quarters.md \
  skills/tiempo/references/intervals/each-quarter-of-interval.md \
  skills/tiempo/references/utilities/get-quarter.md
git diff --cached --check
git commit -m "feat: complete plain-date quarter support"
```

Do not stage `AGENTS.md`. If the implementation is already committed when execution begins, verify the corresponding commit and skip creating a duplicate.

- [ ] **Step 4: Commit the roadmap separately**

```bash
git add docs/superpowers/plans/2026-07-10-tiempo-core-maintainer-roadmap.md
git commit -m "docs: add tiempo core maintainer roadmap"
```

- [ ] **Step 5: Confirm the execution baseline is clean**

```bash
git status --short
```

Expected: either clean or only the intentionally preserved `AGENTS.md`; no quarter/matrix implementation file remains unstaged.

---

### Task 1: Make the published package browser-safe

**Files:**
- Create: `scripts/check-browser-bundle.ts`
- Modify: `src/shared/temporal.ts:25`
- Modify: `package.json:34-42`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Consumes: built `dist/index.js`
- Produces: `pnpm check:browser-bundle`, which exits non-zero if importing the browser bundle requires `process` or another unavailable Node global

- [ ] **Step 1: Add the failing browser-bundle checker**

Add `esbuild` as a direct dev dependency:

```bash
pnpm add -D esbuild@^0.27.2
```

Create `scripts/check-browser-bundle.ts`:

```ts
import { createContext, Script } from "node:vm";
import { build } from "esbuild";

const result = await build({
  entryPoints: ["dist/index.js"],
  bundle: true,
  format: "iife",
  globalName: "Tiempo",
  platform: "browser",
  write: false,
});

const output = result.outputFiles[0];
if (!output) throw new Error("esbuild did not produce a browser bundle");

const code = new TextDecoder().decode(output.contents);
new Script(code).runInContext(createContext({ console, Intl }));

console.log("Browser bundle imported without Node globals");
```

Add this script without wiring it into `build` yet:

```json
"check:browser-bundle": "tsx scripts/check-browser-bundle.ts"
```

- [ ] **Step 2: Run the checker and verify the current failure**

Run:

```bash
pnpm build
pnpm check:browser-bundle
```

Expected: `pnpm build` succeeds, then the checker fails with `ReferenceError: process is not defined`.

- [ ] **Step 3: Guard the test-only environment access**

Replace the unguarded selector in `src/shared/temporal.ts` with:

```ts
const requestedImplementation =
  typeof process === "undefined" ? undefined : process.env.TIEMPO_TEMPORAL;
const useNative = requestedImplementation === "native" && "Temporal" in globalThis;
```

Do not add a production configuration object or public runtime selector.

- [ ] **Step 4: Make browser verification part of every build**

Change the root scripts to:

```json
"check:browser-bundle": "tsx scripts/check-browser-bundle.ts",
"build": "pnpm generate:timezones && pnpm generate:matrix && pnpm generate:docs && tsup && tsc --emitDeclarationOnly && pnpm check:browser-bundle"
```

- [ ] **Step 5: Verify the fix**

Run:

```bash
pnpm build
pnpm test --run src/shared/temporal.test.ts
pnpm typecheck
```

Expected: all commands exit 0 and the build prints `Browser bundle imported without Node globals`.

- [ ] **Step 6: Commit the browser-safety gate**

```bash
git add package.json pnpm-lock.yaml scripts/check-browser-bundle.ts src/shared/temporal.ts
git commit -m "fix: keep browser bundle free of node globals"
```

---

### Task 2: Normalize native and polyfill Temporal values at the boundary

**Files:**
- Create: `src/shared/normalizeTemporalValue.ts`
- Create: `src/shared/temporalInterop.test.ts`
- Modify: `src/shared/normalizeTemporalInput.ts`
- Modify: `src/shared/normalizeWithPlainDate.ts`
- Modify: `src/shared/temporal.ts`
- Modify: `src/addQuarters.ts`
- Modify: `src/subQuarters.ts`
- Modify: `src/startOfQuarter.ts`
- Modify: `src/endOfQuarter.ts`
- Modify: `src/getQuarter.ts`
- Modify: `src/isSameQuarter.ts`
- Modify: `src/differenceInQuarters.ts`
- Modify: `src/eachQuarterOfInterval.ts`
- Modify: `src/isPlainDateBefore.ts`
- Modify: `src/isPlainDateAfter.ts`
- Modify: `src/isPlainDateEqual.ts`
- Modify: `src/isPlainTimeBefore.ts`
- Modify: `src/isPlainTimeAfter.ts`
- Modify: `src/isPlainTimeEqual.ts`

**Interfaces:**
- Produces: `normalizeInstant`, `normalizeZonedDateTime`, `normalizePlainDate`, and `normalizePlainTime`
- Guarantee: every public result is created by Tiempo's selected Temporal implementation, even when the caller supplies an object from another implementation

- [ ] **Step 1: Write the cross-implementation regression tests**

Create `src/shared/temporalInterop.test.ts`:

```ts
import { Temporal as PolyfillTemporal } from "@js-temporal/polyfill";
import { describe, expect, it } from "vitest";
import { addDays } from "../addDays";
import { addQuarters } from "../addQuarters";
import { isBefore } from "../isBefore";
import { isPlainDateBefore } from "../isPlainDateBefore";
import { isPlainTimeBefore } from "../isPlainTimeBefore";

const NativeTemporal = (
  globalThis as unknown as { Temporal?: typeof PolyfillTemporal }
).Temporal;

describe.skipIf(NativeTemporal === undefined)("Temporal implementation interop", () => {
  const foreign =
    process.env.TIEMPO_TEMPORAL === "native"
      ? PolyfillTemporal
      : NativeTemporal!;

  it("accepts foreign timeline objects", () => {
    const earlier = foreign.Instant.from("2025-01-01T00:00:00Z");
    const later = foreign.ZonedDateTime.from("2025-01-02T00:00:00Z[UTC]");

    expect(isBefore(earlier, later)).toBe(true);
    expect(addDays(earlier, 1).toString()).toBe("2025-01-02T00:00:00+00:00[UTC]");
  });

  it("accepts foreign PlainDate objects", () => {
    const earlier = foreign.PlainDate.from("2025-01-01");
    const later = foreign.PlainDate.from("2025-04-01");

    expect(isPlainDateBefore(earlier, later)).toBe(true);
    expect(addQuarters(earlier, 1).toString()).toBe("2025-04-01");
  });

  it("accepts foreign PlainTime objects", () => {
    const earlier = foreign.PlainTime.from("09:00");
    const later = foreign.PlainTime.from("10:00");

    expect(isPlainTimeBefore(earlier, later)).toBe(true);
  });
});
```

- [ ] **Step 2: Verify the regression on Node 26**

Run:

```bash
volta run --node 26 pnpm test --run src/shared/temporalInterop.test.ts
```

Expected: both Vitest projects execute and at least one interop case fails because a static Temporal method receives an object created by the other implementation.

- [ ] **Step 3: Add implementation-agnostic guards and canonicalizers**

Add to `src/shared/temporal.ts`:

```ts
export function isPlainTime(value: unknown): value is Temporal.PlainTime {
  return brand(value) === "Temporal.PlainTime";
}
```

Create `src/shared/normalizeTemporalValue.ts`:

```ts
import { Temporal } from "./temporal";

export function normalizeInstant(input: Temporal.Instant): Temporal.Instant {
  return Temporal.Instant.fromEpochNanoseconds(input.epochNanoseconds);
}

export function normalizeZonedDateTime(
  input: Temporal.ZonedDateTime,
): Temporal.ZonedDateTime {
  return Temporal.ZonedDateTime.from(input.toString());
}

export function normalizePlainDate(input: Temporal.PlainDate): Temporal.PlainDate {
  return Temporal.PlainDate.from(input.toString());
}

export function normalizePlainTime(input: Temporal.PlainTime): Temporal.PlainTime {
  return Temporal.PlainTime.from(input.toString());
}
```

- [ ] **Step 4: Canonicalize timeline inputs**

Replace the body of `normalizeTemporalInput` with:

```ts
return isInstant(input)
  ? normalizeInstant(input).toZonedDateTimeISO("UTC")
  : normalizeZonedDateTime(input);
```

Import `normalizeInstant` and `normalizeZonedDateTime` from `./normalizeTemporalValue`.

In `normalizeWithPlainDate`, replace the PlainDate branch with:

```ts
return isPlainDate(input)
  ? plainDateToZonedDateTime(normalizePlainDate(input), timezone!)
  : normalizeTemporalInput(input);
```

- [ ] **Step 5: Canonicalize calendar and time-only branches**

For each direct `PlainDate` operation in the quarter family, normalize before reading fields or calling instance methods. The resulting bodies must use these exact expressions:

| File | PlainDate expression |
|---|---|
| `addQuarters.ts` | `normalizePlainDate(input).add({ months: quarters * 3 })` |
| `subQuarters.ts` | `normalizePlainDate(input).subtract({ months: quarters * 3 })` |
| `startOfQuarter.ts` | `const date = normalizePlainDate(input); return date.with({ month: quarterStartMonth(date.month), day: 1 });` |
| `endOfQuarter.ts` | normalize first, then calculate `endMonth` from the normalized date |
| `getQuarter.ts` | `quarterOfMonth(normalizePlainDate(input).month)` |
| `isSameQuarter.ts` | normalize both PlainDates before comparing year and quarter |
| `differenceInQuarters.ts` | normalize both PlainDates before calling `until`/`total` |
| `eachQuarterOfInterval.ts` | normalize both PlainDate bounds before `eachQuarterStart` |

Replace static PlainDate/PlainTime comparisons with normalized inputs:

```ts
return Temporal.PlainDate.compare(
  normalizePlainDate(date1),
  normalizePlainDate(date2),
) < 0;
```

Use `> 0` for `After`, `=== 0` for `Equal`, and the equivalent `normalizePlainTime` call in the three PlainTime helpers.

- [ ] **Step 6: Verify interop and the full suite**

Run:

```bash
volta run --node 26 pnpm test --run src/shared/temporalInterop.test.ts
pnpm test --run
pnpm typecheck
pnpm build
```

Expected: the Node 26 command passes in both native and polyfill projects; the full suite, typecheck, browser smoke, and build all exit 0.

- [ ] **Step 7: Commit boundary normalization**

```bash
git add \
  src/shared/normalizeTemporalValue.ts \
  src/shared/temporalInterop.test.ts \
  src/shared/normalizeTemporalInput.ts \
  src/shared/normalizeWithPlainDate.ts \
  src/shared/temporal.ts \
  src/addQuarters.ts src/subQuarters.ts \
  src/startOfQuarter.ts src/endOfQuarter.ts \
  src/getQuarter.ts src/isSameQuarter.ts \
  src/differenceInQuarters.ts src/eachQuarterOfInterval.ts \
  src/isPlainDateBefore.ts src/isPlainDateAfter.ts src/isPlainDateEqual.ts \
  src/isPlainTimeBefore.ts src/isPlainTimeAfter.ts src/isPlainTimeEqual.ts
git commit -m "fix: normalize temporal values across implementations"
```

---

### Task 3: Codify the v2 Temporal type contract and semantic-gap rule

**Files:**
- Create: `docs/api-semantics.md`
- Review: `docs/superpowers/plans/2026-07-10-tiempo-core-maintainer-roadmap.md`

**Interfaces:**
- Produces: the maintainer policy used by Tasks 4-6
- Guarantees: no public input type is added solely to turn a matrix cell into a checkmark

- [ ] **Step 1: Write the semantic contract**

Create `docs/api-semantics.md` with this normative table:

```markdown
# Tiempo Temporal Type Semantics

| Input type | Meaning | Meaningful operations | v2 return rule |
|---|---|---|---|
| `Instant` | Exact point on the timeline | zoning, serialization, timeline comparison, and existing arithmetic/boundaries using UTC calendar context | Use the Instant directly for UTC storage; existing calendar helpers return `ZonedDateTime` in UTC |
| `ZonedDateTime` | Exact point plus timezone/calendar context | conversion, formatting, arithmetic, boundaries, comparison, difference, intervals | `ZonedDateTime`, preserving the input/interval-start timezone |
| `PlainDate` | Calendar date without time or timezone | years/quarters/months/weeks/days arithmetic, week/month/quarter/year boundaries, calendar comparison/difference/intervals | `PlainDate` or scalar |
| `PlainTime` | Wall-clock time without date or timezone | parsing and homogeneous comparison | `PlainTime` or scalar |

## Matrix interpretation

- A supported input must have a meaningful operation and documented result.
- An intentional non-operation is labeled with its reason instead of being treated as a missing overload.
- `toInstant(Instant)` is idempotent so conversion pipelines can normalize mixed timeline representations safely.
- An unaccepted input is not automatically a product gap. Review Temporal semantics before changing an API.

## Rejected combinations

- `PlainDate` is not accepted by sub-day arithmetic, sub-day rounding, or hour/minute interval functions.
- `PlainDate` and timeline types are not mixed in comparison, difference, or interval overloads.
- `PlainTime` is not converted to an `Instant` or `ZonedDateTime` without an explicit date and timezone.
- `startOfDay(PlainDate)` and `endOfDay(PlainDate)` continue to require a timezone because their documented result is a first/last moment, not a calendar date.

## Version boundary

Changing calendar operations from `Instant -> ZonedDateTime[UTC]` to `Instant -> Instant` is reserved for a v3 design and migration plan.
```

- [ ] **Step 2: Audit every planned type expansion for independent meaning**

Keep only these additions, for these reasons:

| Proposed addition | Keep? | Semantic reason |
|---|---:|---|
| Calendar add/subtract on `PlainDate` | Yes | Temporal performs these operations directly in calendar space. |
| Week/month/quarter/year boundaries on `PlainDate` | Yes | They transform one calendar date into another calendar date. |
| `startOfDay`/`endOfDay` on `PlainDate` without timezone | No | “First/last moment” requires a timezone; a PlainDate alone has no moment. |
| Homogeneous `isBefore`/`isAfter` for `PlainDate` and `PlainTime` | Yes | Both types have an intrinsic ordering within their own domain. |
| Same-period checks for `PlainDate` | Yes | They answer calendar questions without manufacturing a time or timezone. |
| Calendar differences and calendar intervals for `PlainDate` | Yes | Their result is defined entirely in calendar space. |
| Sub-day operations or rounding on `PlainDate` | No | A date has no hour, minute, second, or sub-second value. |
| `toInstant(Instant)` | Yes | Idempotence keeps generic normalization pipelines composable and returns the same value unchanged. |
| Same-type `Instant` returns from calendar helpers | Defer to v3 | Potentially useful, but changing existing return types is a versioned design decision rather than a matrix fix. |

- [ ] **Step 3: Verify the implementation contains the identity overload**

Run:

```bash
if ! rg -n "input:.*Temporal\.Instant" src/toInstant.ts; then
  exit 1
fi
```

Expected: the public input union includes `Temporal.Instant`.

- [ ] **Step 4: Commit the contract**

```bash
git add docs/api-semantics.md
git commit -m "docs: define temporal input semantics"
```

---

### Task 4: Add PlainDate to existing calendar arithmetic and boundaries

**Files:**
- Create: `src/plainDateCalendar.test.ts`
- Modify and test: `src/addYears.ts`, `src/addMonths.ts`, `src/addWeeks.ts`, `src/addDays.ts`
- Modify and test: `src/subYears.ts`, `src/subMonths.ts`, `src/subWeeks.ts`, `src/subDays.ts`
- Modify and test: `src/startOfWeek.ts`, `src/endOfWeek.ts`, `src/startOfMonth.ts`, `src/endOfMonth.ts`, `src/startOfYear.ts`, `src/endOfYear.ts`
- Modify corresponding MDX files under `www/content/docs/arithmetic/` and `www/content/docs/boundaries/`

**Interfaces:**
- Adds: `PlainDate -> PlainDate` overloads for calendar-unit arithmetic and week/month/year boundaries
- Preserves: `startOfDay(PlainDate, timezone) -> ZonedDateTime` and `endOfDay(PlainDate, timezone) -> ZonedDateTime`

- [ ] **Step 1: Write cross-family contract tests**

Create `src/plainDateCalendar.test.ts`:

```ts
import { Temporal } from "./shared/temporal";
import { describe, expect, expectTypeOf, it } from "vitest";
import { addDays } from "./addDays";
import { addMonths } from "./addMonths";
import { addWeeks } from "./addWeeks";
import { addYears } from "./addYears";
import { endOfMonth } from "./endOfMonth";
import { endOfWeek } from "./endOfWeek";
import { endOfYear } from "./endOfYear";
import { startOfMonth } from "./startOfMonth";
import { startOfWeek } from "./startOfWeek";
import { startOfYear } from "./startOfYear";
import { subDays } from "./subDays";
import { subMonths } from "./subMonths";
import { subWeeks } from "./subWeeks";
import { subYears } from "./subYears";

describe("PlainDate calendar contract", () => {
  const date = Temporal.PlainDate.from("2025-01-31");

  it("preserves PlainDate through calendar arithmetic", () => {
    expect(addYears(date, 1).toString()).toBe("2026-01-31");
    expect(addMonths(date, 1).toString()).toBe("2025-02-28");
    expect(addWeeks(date, 1).toString()).toBe("2025-02-07");
    expect(addDays(date, 1).toString()).toBe("2025-02-01");
    expect(subYears(date, 1).toString()).toBe("2024-01-31");
    expect(subMonths(date, 1).toString()).toBe("2024-12-31");
    expect(subWeeks(date, 1).toString()).toBe("2025-01-24");
    expect(subDays(date, 1).toString()).toBe("2025-01-30");

    expectTypeOf(addDays(date, 1)).toEqualTypeOf<Temporal.PlainDate>();
  });

  it("preserves PlainDate through calendar boundaries", () => {
    expect(startOfWeek(date).toString()).toBe("2025-01-27");
    expect(endOfWeek(date).toString()).toBe("2025-02-02");
    expect(startOfMonth(date).toString()).toBe("2025-01-01");
    expect(endOfMonth(date).toString()).toBe("2025-01-31");
    expect(startOfYear(date).toString()).toBe("2025-01-01");
    expect(endOfYear(date).toString()).toBe("2025-12-31");

    expectTypeOf(startOfMonth(date)).toEqualTypeOf<Temporal.PlainDate>();
  });
});
```

- [ ] **Step 2: Run tests and verify overload failures**

```bash
pnpm test --run src/plainDateCalendar.test.ts
pnpm typecheck
```

Expected: TypeScript and/or tests fail because the listed functions do not yet accept `PlainDate` without a timezone.

- [ ] **Step 3: Add explicit arithmetic overloads and branches**

Each arithmetic file gets these overload shapes:

```ts
export function addDays(
  input: Temporal.Instant | Temporal.ZonedDateTime,
  days: number,
): Temporal.ZonedDateTime;
export function addDays(input: Temporal.PlainDate, days: number): Temporal.PlainDate;
```

Use `normalizePlainDate(input)` and the exact operation in this table:

| Function | PlainDate branch |
|---|---|
| `addYears` | `.add({ years })` |
| `addMonths` | `.add({ months })` |
| `addWeeks` | `.add({ weeks })` |
| `addDays` | `.add({ days })` |
| `subYears` | `.subtract({ years })` |
| `subMonths` | `.subtract({ months })` |
| `subWeeks` | `.subtract({ weeks })` |
| `subDays` | `.subtract({ days })` |

The implementation return type in each file is `Temporal.ZonedDateTime | Temporal.PlainDate`; the existing timeline branch remains unchanged.

- [ ] **Step 4: Add explicit boundary overloads and branches**

Each boundary gets `PlainDate -> PlainDate` plus the existing timeline overload. Preserve the existing PlainDate-plus-timezone overload. The calendar-only branch must run only when `isPlainDate(input) && timezone === undefined`; otherwise keep the existing zoned normalization path. Use these exact PlainDate expressions:

| Function | PlainDate result |
|---|---|
| `startOfWeek` | `date.subtract({ days: date.dayOfWeek - 1 })` |
| `endOfWeek` | `date.add({ days: 7 - date.dayOfWeek })` |
| `startOfMonth` | `date.with({ day: 1 })` |
| `endOfMonth` | `date.with({ day: date.daysInMonth })` |
| `startOfYear` | `date.with({ month: 1, day: 1 })` |
| `endOfYear` | `date.with({ month: 12, day: 31 })` |

In every row, `date` is `normalizePlainDate(input)`.

- [ ] **Step 5: Update function-level docs**

For every touched MDX page, add one `PlainDate` example showing no timezone argument and a `PlainDate` return. Do not add PlainDate examples to sub-day or day-moment pages.

- [ ] **Step 6: Verify the family**

```bash
pnpm test --run src/plainDateCalendar.test.ts src/addDays.test.ts src/startOfMonth.test.ts
pnpm typecheck
pnpm generate:matrix
pnpm generate:docs
```

Expected: tests/typecheck pass; the matrix shows PlainDate for all listed calendar functions and no PlainDate support for sub-day functions.

- [ ] **Step 7: Commit calendar support**

```bash
git add \
  src/plainDateCalendar.test.ts \
  src/{addYears,addMonths,addWeeks,addDays,subYears,subMonths,subWeeks,subDays}.ts \
  src/{startOfWeek,endOfWeek,startOfMonth,endOfMonth,startOfYear,endOfYear}.ts \
  www/content/docs/arithmetic/{add-years,add-months,add-weeks,add-days,sub-years,sub-months,sub-weeks,sub-days}.mdx \
  www/content/docs/boundaries/{start-of-week,end-of-week,start-of-month,end-of-month,start-of-year,end-of-year}.mdx \
  skills/tiempo/references/arithmetic/{add-years,add-months,add-weeks,add-days,sub-years,sub-months,sub-weeks,sub-days}.md \
  skills/tiempo/references/boundaries/{start-of-week,end-of-week,start-of-month,end-of-month,start-of-year,end-of-year}.md \
  www/public/llms.txt skills/tiempo/SKILL.md
git commit -m "feat: extend calendar helpers to plain dates"
```

---

### Task 5: Route homogeneous PlainDate and PlainTime relations through smart functions

**Files:**
- Create: `src/plainDateRelations.test.ts`
- Modify: `src/isBefore.ts`, `src/isAfter.ts`, `src/isWithinInterval.ts`
- Modify: `src/isPlainDateBefore.ts`, `src/isPlainDateAfter.ts`, `src/isPlainTimeBefore.ts`, `src/isPlainTimeAfter.ts`
- Modify: `src/isSameDay.ts`, `src/isSameWeek.ts`, `src/isSameMonth.ts`, `src/isSameYear.ts`
- Modify: `src/differenceInDays.ts`, `src/differenceInWeeks.ts`, `src/differenceInMonths.ts`, `src/differenceInYears.ts`
- Modify: `src/eachDayOfInterval.ts`, `src/eachWeekOfInterval.ts`, `src/eachMonthOfInterval.ts`, `src/eachYearOfInterval.ts`
- Modify corresponding comparison, difference, and interval MDX pages

**Interfaces:**
- Adds homogeneous overloads for `PlainDate` and, where meaningful, `PlainTime`
- Rejects mixed `PlainDate`/timeline or `PlainTime`/timeline calls at compile time
- Keeps all existing specialized helper exports as compatibility aliases

- [ ] **Step 1: Write relation contract tests**

Create `src/plainDateRelations.test.ts` with these assertions:

```ts
import { Temporal } from "./shared/temporal";
import { describe, expect, expectTypeOf, it } from "vitest";
import { differenceInDays } from "./differenceInDays";
import { differenceInMonths } from "./differenceInMonths";
import { eachDayOfInterval } from "./eachDayOfInterval";
import { eachMonthOfInterval } from "./eachMonthOfInterval";
import { isAfter } from "./isAfter";
import { isBefore } from "./isBefore";
import { isSameDay } from "./isSameDay";
import { isSameMonth } from "./isSameMonth";
import { isWithinInterval } from "./isWithinInterval";

describe("homogeneous Temporal relations", () => {
  const jan1 = Temporal.PlainDate.from("2025-01-01");
  const mar1 = Temporal.PlainDate.from("2025-03-01");

  it("routes PlainDate comparison through general helpers", () => {
    expect(isBefore(jan1, mar1)).toBe(true);
    expect(isAfter(mar1, jan1)).toBe(true);
    expect(isWithinInterval(jan1, { start: jan1, end: mar1 })).toBe(true);
    expect(isSameDay(jan1, Temporal.PlainDate.from("2025-01-01"))).toBe(true);
    expect(isSameMonth(jan1, Temporal.PlainDate.from("2025-01-31"))).toBe(true);
  });

  it("supports calendar differences", () => {
    expect(differenceInDays(mar1, jan1)).toBe(59);
    expect(differenceInMonths(mar1, jan1)).toBe(2);
  });

  it("returns PlainDate interval members", () => {
    const days = eachDayOfInterval({ start: jan1, end: jan1.add({ days: 2 }) });
    const months = eachMonthOfInterval({ start: jan1, end: mar1 });

    expect(days.map(String)).toEqual(["2025-01-01", "2025-01-02", "2025-01-03"]);
    expect(months.map(String)).toEqual(["2025-01-01", "2025-02-01", "2025-03-01"]);
    expectTypeOf(days).toEqualTypeOf<Temporal.PlainDate[]>();
  });

  it("routes PlainTime comparison through general helpers", () => {
    const nine = Temporal.PlainTime.from("09:00");
    const ten = Temporal.PlainTime.from("10:00");

    expect(isBefore(nine, ten)).toBe(true);
    expect(isAfter(ten, nine)).toBe(true);
  });
});
```

- [ ] **Step 2: Verify the failing contract**

```bash
pnpm test --run src/plainDateRelations.test.ts
pnpm typecheck
```

Expected: overload/type errors for general comparison and interval helpers.

- [ ] **Step 3: Add smart comparison overloads**

`isBefore` and `isAfter` must expose three homogeneous overloads:

```ts
export function isBefore(
  date1: Temporal.Instant | Temporal.ZonedDateTime,
  date2: Temporal.Instant | Temporal.ZonedDateTime,
): boolean;
export function isBefore(date1: Temporal.PlainDate, date2: Temporal.PlainDate): boolean;
export function isBefore(date1: Temporal.PlainTime, date2: Temporal.PlainTime): boolean;
```

The implementation branches with `isPlainDate` and `isPlainTime`, normalizes both values, and uses the corresponding static `compare`. Otherwise it follows the existing timeline path.

Change specialized `isPlainDateBefore`, `isPlainDateAfter`, `isPlainTimeBefore`, and `isPlainTimeAfter` bodies to delegate to `isBefore`/`isAfter`. Keep their names and signatures exported.

Add a homogeneous `PlainDate` interval overload to `isWithinInterval`; compare with `Temporal.PlainDate.compare` after normalization. Do not accept PlainTime intervals in this task.

- [ ] **Step 4: Add PlainDate same-period overloads**

Add `PlainDate, PlainDate -> boolean` overloads and these exact comparisons:

| Function | PlainDate comparison |
|---|---|
| `isSameDay` | `date1.equals(date2)` |
| `isSameWeek` | `startOfWeek(date1).equals(startOfWeek(date2))` |
| `isSameMonth` | `date1.year === date2.year && date1.month === date2.month` |
| `isSameYear` | `date1.year === date2.year` |

Normalize both PlainDates before comparison. `isSameQuarter` already follows this contract.

- [ ] **Step 5: Add PlainDate difference overloads**

Add homogeneous `PlainDate` overloads to day/week/month/year differences. Calculate from normalized `earlierDate` to `laterDate`:

```ts
const duration = earlier.until(later, { largestUnit: unit });
const precise = duration.total({ unit, relativeTo: earlier });
return options?.fractional ? precise : Math.trunc(precise);
```

Use `unit: "days"`, `"weeks"`, `"months"`, or `"years"` for the corresponding function. Date-only fractional results are normally integral, but keep `DifferenceOptions` consistent. `differenceInQuarters` already covers PlainDate.

- [ ] **Step 6: Add PlainDate interval overloads**

Add homogeneous PlainDate overloads returning `Temporal.PlainDate[]` to:

| Function | First member | Step |
|---|---|---|
| `eachDayOfInterval` | normalized start | `{ days: 1 }` |
| `eachWeekOfInterval` | `startOfWeek(normalizedStart)` | `{ weeks: 1 }` |
| `eachMonthOfInterval` | normalized start with `{ day: 1 }` | `{ months: 1 }` |
| `eachYearOfInterval` | normalized start with `{ month: 1, day: 1 }` | `{ years: 1 }` |

Compare PlainDate loop bounds with `Temporal.PlainDate.compare`. Timeline overloads continue returning `ZonedDateTime[]` and using the interval start's timezone. `eachQuarterOfInterval` already covers PlainDate.

- [ ] **Step 7: Update docs and verify**

```bash
pnpm test --run src/plainDateRelations.test.ts src/isBefore.test.ts src/differenceInDays.test.ts src/eachDayOfInterval.test.ts
pnpm typecheck
pnpm generate:matrix
pnpm generate:docs
```

Expected: all commands pass; the matrix shows PlainDate on every calendar relation and PlainTime only on homogeneous general comparison.

- [ ] **Step 8: Commit smart relation routing**

```bash
git add \
  src/plainDateRelations.test.ts \
  src/{isBefore,isAfter,isWithinInterval,isPlainDateBefore,isPlainDateAfter,isPlainTimeBefore,isPlainTimeAfter}.ts \
  src/{isSameDay,isSameWeek,isSameMonth,isSameYear}.ts \
  src/{differenceInDays,differenceInWeeks,differenceInMonths,differenceInYears}.ts \
  src/{eachDayOfInterval,eachWeekOfInterval,eachMonthOfInterval,eachYearOfInterval}.ts \
  www/content/docs/comparison/{is-before,is-after,is-within-interval,is-same-day,is-same-week,is-same-month,is-same-year}.mdx \
  www/content/docs/difference/{difference-in-days,difference-in-weeks,difference-in-months,difference-in-years}.mdx \
  www/content/docs/intervals/{each-day-of-interval,each-week-of-interval,each-month-of-interval,each-year-of-interval}.mdx \
  skills/tiempo/references/comparison/{is-before,is-after,is-within-interval,is-same-day,is-same-week,is-same-month,is-same-year}.md \
  skills/tiempo/references/difference/{difference-in-days,difference-in-weeks,difference-in-months,difference-in-years}.md \
  skills/tiempo/references/intervals/{each-day-of-interval,each-week-of-interval,each-month-of-interval,each-year-of-interval}.md \
  www/public/llms.txt skills/tiempo/SKILL.md
git commit -m "feat: route calendar relations by temporal type"
```

---

### Task 6: Replace the flattened matrix with overload-aware mappings

**Files:**
- Create: `scripts/capability-matrix.ts`
- Create: `scripts/capability-matrix.test.ts`
- Modify: `scripts/capability-matrix-semantics.ts`
- Modify: `scripts/capability-matrix-semantics.test.ts`
- Modify: `scripts/generate-capability-matrix.ts`
- Regenerate: `www/content/docs/type-matrix.mdx`
- Modify: `scripts/generate-docs.ts`
- Regenerate: `www/public/llms.txt`
- Regenerate: `skills/tiempo/SKILL.md`

**Interfaces:**
- Produces: one mapping per public overload, retaining primary input, timezone requirement, ancillary parameters, and return type
- Produces: explicit non-operation entries that explain why an overload must not exist
- Corrects: false `string` inputs from format strings, omitted `number` inputs, and the inaccurate “published API” wording

- [ ] **Step 1: Write fixture tests for the matrix analyzer**

Create `scripts/capability-matrix.test.ts` with an in-memory TypeScript source fixture containing:

```ts
export function sample(input: Temporal.Instant): Temporal.ZonedDateTime;
export function sample(input: Temporal.PlainDate): Temporal.PlainDate;
export function sample(input: Temporal.PlainDate, timezone: Timezone): Temporal.ZonedDateTime;
export function format(input: Temporal.Instant, pattern: string): string;
export function parse(input: string | number | Date, timezone: Timezone): Temporal.ZonedDateTime;
export function compare(a: Temporal.PlainDate, b: Temporal.PlainDate): boolean;
```

Assert the pure analyzer returns these exact overload entries:

```ts
expect(analyzeSource(source)).toMatchObject([
  {
    name: "sample",
    entries: [
      { kind: "overload", input: "Instant", timezone: "implicit UTC", returns: "ZonedDateTime" },
      { kind: "overload", input: "PlainDate", timezone: "not required", returns: "PlainDate" },
      { kind: "overload", input: "PlainDate", timezone: "required", returns: "ZonedDateTime" },
    ],
  },
  {
    name: "format",
    entries: [
      { kind: "overload", input: "Instant", timezone: "not required", returns: "string" },
    ],
  },
  {
    name: "parse",
    entries: [
      { kind: "overload", input: "string", timezone: "required", returns: "ZonedDateTime" },
      { kind: "overload", input: "number", timezone: "required", returns: "ZonedDateTime" },
      { kind: "overload", input: "Date", timezone: "required", returns: "ZonedDateTime" },
    ],
  },
  {
    name: "compare",
    entries: [
      { kind: "overload", input: "PlainDate + PlainDate", timezone: "not required", returns: "boolean" },
    ],
  },
]);
```

- [ ] **Step 2: Run the test and verify it fails**

```bash
pnpm test --run scripts/capability-matrix.test.ts
```

Expected: FAIL because `analyzeSource` and the overload-aware data model do not exist.

- [ ] **Step 3: Extract pure analysis and rendering**

Move AST logic into `scripts/capability-matrix.ts` and export:

```ts
export type TimezoneRequirement =
  | "not required"
  | "required"
  | "implicit UTC"
  | "optional override"
  | "preserved";

export interface OverloadMapping {
  kind: "overload";
  input: string;
  timezone: TimezoneRequirement;
  returns: string;
}

export interface NonOperation {
  kind: "non-operation";
  input: string;
  reason: string;
}

export type CapabilityEntry = OverloadMapping | NonOperation;

export interface CapabilityRow {
  name: string;
  entries: CapabilityEntry[];
}

export function analyzeSource(source: string): CapabilityRow[];
export function collectCapabilityRows(program: ts.Program, indexPath: string): CapabilityRow[];
export function renderCapabilityMatrix(rows: CapabilityRow[]): string;
```

Analyze the first semantic parameter and any later parameter whose type contains a Temporal value. Thus a homogeneous comparator becomes `PlainDate + PlainDate`, while a formatting pattern, arithmetic amount, or `DifferenceOptions` parameter is excluded. Render `{ start; end }` parameters as `PlainDate interval` or `Instant | ZonedDateTime interval`. Treat an explicit required `Timezone` parameter as `required`; inspect an options type containing `timeZone?: Timezone` as `optional override`. For existing `Instant` calendar APIs, label timezone `implicit UTC`; for `ZonedDateTime`, use `preserved`. Merge `semanticInputNote` results as `kind: "non-operation"` entries; never synthesize a TypeScript overload from a semantic note.

- [ ] **Step 4: Render explicit mappings**

Use this table shape per category:

```markdown
| Function | Input | Timezone | Result |
|---|---|---|---|
| `startOfQuarter` | `Instant` | implicit UTC | `ZonedDateTime` |
|  | `ZonedDateTime` | preserved | `ZonedDateTime` |
|  | `PlainDate` | not required | `PlainDate` |
|  | `PlainDate` | required | `ZonedDateTime` |
| `toInstant` | `Instant` | — | `Instant` |
```

Change the introduction to:

```markdown
Generated from the current source TypeScript overloads. Release pages reflect the API shipped by that release; a local preview reflects the current working tree.
```

- [ ] **Step 5: Keep the CLI thin and regenerate**

`scripts/generate-capability-matrix.ts` should only create the program, call `collectCapabilityRows`, render, and write `www/content/docs/type-matrix.mdx`.

Run:

```bash
pnpm test --run scripts/capability-matrix.test.ts
pnpm generate:matrix
```

Expected: tests pass; `toInstant` and `toZonedTime` show `number`; `toInstant(Instant)` is accepted idempotently; `format` no longer claims its pattern string is a datetime input; PlainDate-with-timezone and PlainDate-without-timezone are separate mappings.

- [ ] **Step 6: Surface the matrix to LLM consumers**

In `scripts/generate-docs.ts`, add this entry to the top-level Docs section of `llms.txt`:

```ts
"- [Type Matrix](https://tiempo.gobrand.app/docs/type-matrix): Input, timezone, and return mappings for every public function",
```

Add this section near the top of generated `skills/tiempo/SKILL.md`:

```markdown
## Capability Matrix

Use [the Type Matrix](https://tiempo.gobrand.app/docs/type-matrix) to check accepted Temporal types, timezone requirements, and return types before choosing a helper.
```

Run `pnpm generate:docs` and verify both outputs contain `type-matrix`.

- [ ] **Step 7: Verify and commit matrix v2**

```bash
pnpm test --run scripts/capability-matrix.test.ts
pnpm generate:matrix
pnpm generate:docs
git add www/content/docs/type-matrix.mdx www/public/llms.txt skills/tiempo/SKILL.md
pnpm generate:matrix
pnpm generate:docs
git diff --exit-code -- www/content/docs/type-matrix.mdx www/public/llms.txt skills/tiempo/SKILL.md
```

Expected: all commands exit 0 and a second generation produces no diff.

```bash
git add \
  scripts/capability-matrix.ts \
  scripts/capability-matrix.test.ts \
  scripts/capability-matrix-semantics.ts \
  scripts/capability-matrix-semantics.test.ts \
  scripts/generate-capability-matrix.ts \
  scripts/generate-docs.ts \
  www/content/docs/type-matrix.mdx \
  www/public/llms.txt \
  skills/tiempo/SKILL.md
git commit -m "docs: generate overload-aware type matrix"
```

---

### Task 7: Restore website type safety and enforce it in CI

**Files:**
- Modify: `www/src/components/button.tsx`
- Modify: `.github/workflows/ci.yml`
- Modify: `package.json`

**Interfaces:**
- Produces: `pnpm check:www`
- CI guarantee: API tests/typecheck/build and website types are both required

- [ ] **Step 1: Confirm the existing website type failures**

```bash
pnpm --dir www types:check
```

Expected: FAIL on `fumadocs-ui/lib/cn` and the `LinkProps & ButtonProps` `color` collision.

- [ ] **Step 2: Replace the stale utility and conflicting prop type**

Replace `www/src/components/button.tsx` with:

```tsx
import { Link, type LinkProps } from "@tanstack/react-router";
import { buttonVariants, type ButtonProps } from "fumadocs-ui/components/ui/button";
import { twMerge } from "tailwind-merge";

type ButtonLinkProps = Omit<LinkProps, "children" | "className"> & {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = "primary",
  size,
  className,
  children,
  ...linkProps
}: ButtonLinkProps) {
  return (
    <Link
      className={twMerge(buttonVariants({ variant, size }), className)}
      {...linkProps}
    >
      {children}
    </Link>
  );
}
```

- [ ] **Step 3: Verify website types and build**

```bash
pnpm --dir www types:check
pnpm --dir www build
```

Expected: both commands exit 0. The existing Wrangler `serve_directly` warning may remain, but there must be no TypeScript or Vite build error.

- [ ] **Step 4: Add a root command and CI gate**

Add to root `package.json`:

```json
"check:www": "pnpm --dir www types:check"
```

Add after root typecheck in `.github/workflows/ci.yml`:

```yaml
- name: Install website dependencies
  run: pnpm --dir www install --frozen-lockfile

- name: Type check website
  run: pnpm check:www
```

- [ ] **Step 5: Verify and commit website health**

```bash
pnpm check:www
pnpm --dir www build
git add package.json www/src/components/button.tsx .github/workflows/ci.yml
git commit -m "fix: restore docs website type safety"
```

---

### Task 8: Final full-system verification and maintainer handoff

**Files:**
- Verify all touched files
- Update: `TODO.md` only if all preceding tasks are complete
- Do not modify: package version, git tags, npm registry, deployed website

**Interfaces:**
- Produces: a release-ready but unpublished working tree/branch

- [ ] **Step 1: Regenerate every derived artifact twice**

```bash
pnpm generate:timezones
pnpm generate:matrix
pnpm generate:docs
pnpm generate:timezones
pnpm generate:matrix
pnpm generate:docs
git diff --exit-code -- src/types/iana-timezones.ts www/content/docs/type-matrix.mdx skills/tiempo www/public/llms.txt
```

Expected: the second generation produces no diff beyond intentionally staged source changes.

- [ ] **Step 2: Run all package and website gates**

```bash
pnpm test --run
pnpm typecheck
pnpm build
pnpm check:www
pnpm --dir www build
volta run --node 26 pnpm test --run src/shared/temporalInterop.test.ts
```

Expected: 0 failures. Node 26 must report both `polyfill` and `native` projects for the interop test.

- [ ] **Step 3: Manually verify the matrix contract**

Start the docs server on an available port:

```bash
pnpm --dir www dev
```

Check these rows in the rendered Type Matrix:

- `toInstant`: accepted inputs are `string | number | Date | Instant | ZonedDateTime -> Instant`.
- `addDays`: `Instant -> ZonedDateTime[UTC]`, `ZonedDateTime -> ZonedDateTime`, `PlainDate -> PlainDate`.
- `startOfDay`: PlainDate requires a timezone and returns ZonedDateTime.
- `startOfMonth`: PlainDate without a timezone returns PlainDate; PlainDate plus timezone returns ZonedDateTime.
- `isBefore`: timeline pairs, PlainDate pairs, and PlainTime pairs are shown separately.
- Sub-day helpers have no PlainDate mapping.

- [ ] **Step 4: Review scope and generated changes**

```bash
git status --short
git diff --stat
git diff --check
```

Confirm there are no version bumps, tags, deploy changes, unrelated formatting rewrites, or dropped pre-existing edits.

- [ ] **Step 5: Commit only final generated or checklist changes**

If Task 8 produced tracked generated changes that were not already committed:

```bash
git add TODO.md src/types/iana-timezones.ts www/content/docs/type-matrix.mdx skills/tiempo www/public/llms.txt
git commit -m "chore: finalize temporal capability artifacts"
```

If there are no remaining changes, do not create an empty commit.

- [ ] **Step 6: Hand off without releasing**

Report:

- exact test counts and which Temporal implementations ran;
- browser bundle smoke result;
- website typecheck/build result;
- matrix preview URL;
- commits created;
- remaining v3 decision: whether `Instant` operations should preserve `Instant` return type.

Do not run `pnpm release`, `npm publish`, `wrangler deploy`, or create a git tag.

---

## Deferred v3 Design Question

After the non-breaking plan is complete, write a separate v3 proposal comparing:

1. **Preserve input type:** `Instant -> Instant`, `ZonedDateTime -> ZonedDateTime`, `PlainDate -> PlainDate`.
2. **Expose calendar context:** keep `Instant -> ZonedDateTime[UTC]` for calendar operations.

The proposal must enumerate every affected overload, migration examples, and whether sub-day and calendar arithmetic should follow different return rules. Do not mix this breaking decision into the v2 implementation above.

## Post-roadmap feature order

Once Tasks 0-8 pass and the v2 contract is stable, create a separate implementation plan for the business-day family already listed in `TODO.md`: `isWeekend`, `isBusinessDay`, `addBusinessDays`, `subBusinessDays`, `differenceInBusinessDays`, `nextBusinessDay`, and `previousBusinessDay`. That plan must use the completed PlainDate calendar contract, keep holiday calendars out of scope unless explicitly requested, and must not begin before the runtime and capability gates in this roadmap are green.
