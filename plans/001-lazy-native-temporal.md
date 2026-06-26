# Plan 001: Load the Temporal polyfill only when the runtime lacks native Temporal

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**:
> `git diff --stat 9f5bc98..HEAD -- src/ tsup.config.ts package.json`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: none
- **Category**: perf / migration / tech-debt
- **Planned at**: commit `9f5bc98`, 2026-06-25

## Why this matters

`tiempo` markets itself as "lightweight," but **53 source files statically
`import { Temporal } from '@js-temporal/polyfill'`**, so every consumer ships
and executes the entire polyfill — even on runtimes that now have Temporal
natively. As of June 2026 native Temporal is unflagged in **Node 26**, **Chrome
144+**, **Firefox 139+**, **Edge**, and **Deno** (TC39 Stage 4 / ES2026). Only
**Safari** (stable, ~late-2026 ETA) and **Node ≤ 25** still lack it, so the
polyfill cannot be dropped outright — but it *can* be loaded lazily, only when
`globalThis.Temporal` is absent.

After this plan: native runtimes load and run **zero** polyfill code; Safari and
old Node transparently fall back to it; the public API is unchanged. The
polyfill becomes a single, swappable chokepoint so it can be dropped entirely
later (when Safari ships + Node 26 is LTS) by editing one file.

A second, load-bearing reason this is a real migration and not a find-replace:
the code routes inputs with `instanceof Temporal.Instant` etc. (17 sites).
`instanceof` is **identity-based** — a polyfill-created object fails
`instanceof` against a *native* `Temporal.Instant` and vice versa. Once tiempo
can resolve a different implementation than the one a caller used, every
`instanceof` is a silent-misrouting bug. They must be replaced with
**brand checks** (`Symbol.toStringTag`), which the spec requires every
implementation to set identically.

## Current state

Today every file pulls the polyfill directly and routes by `instanceof`:

- `src/toUtc.ts:1` — `import { Temporal } from '@js-temporal/polyfill';`
- `src/toUtc.ts:30,38` — `if (input instanceof Temporal.Instant)` style routing
- `src/shared/normalizeTemporalInput.ts:1,11`:
  ```ts
  import { Temporal } from '@js-temporal/polyfill';
  // ...
  return input instanceof Temporal.Instant
    ? input.toZonedDateTimeISO('UTC')
    : input;
  ```
- `src/toZonedTime.ts:1,57` — value import + `input instanceof Temporal.Instant`

Two kinds of imports exist; **only the value imports change**:

- **Value imports** `import { Temporal } from '@js-temporal/polyfill'` — used at
  runtime (`Temporal.Instant.from`, `new Temporal.PlainTime()`, `instanceof`).
  These must move to the new accessor.
- **Type-only imports** `import type { Temporal } from '@js-temporal/polyfill'`
  (30 files, e.g. `src/addDays.ts:1`) — erased at compile time, **zero runtime
  cost**. Leave these exactly as they are.

Verified facts (commit `9f5bc98`):
- Brand tags are present on polyfill objects:
  `Temporal.Instant.from('2025-01-01T00:00:00Z')[Symbol.toStringTag]`
  === `'Temporal.Instant'`; ZonedDateTime → `'Temporal.ZonedDateTime'`;
  PlainDate → `'Temporal.PlainDate'`. Native Temporal sets the same tags (spec).
- `await import('@js-temporal/polyfill')` resolves to the module namespace with
  a `.Temporal` export — top-level await + dynamic import both work under the
  current `tsup` ESM build.
- The polyfill is a regular `dependencies` entry in `package.json` and **must
  stay there** (the dynamic import still needs it installed).

### Repo conventions to match
- One named function per file, named after the file; heavy JSDoc with
  `@param`/`@returns`/`@example`. Match the surrounding style — see
  `src/toUtc.ts` as the exemplar for a conversion function.
- Tests are co-located `*.test.ts` using Vitest, importing the polyfill
  directly to build fixtures (e.g. `src/toUtc.test.ts`). That stays unchanged.
- TS config is strict with `noUncheckedIndexedAccess` and
  `verbatimModuleSyntax` (`tsconfig.json`) — value vs `import type` is enforced,
  so keep value imports as `import {` (not `import type {`).

## Commands you will need

| Purpose   | Command            | Expected on success          |
|-----------|--------------------|------------------------------|
| Install   | `pnpm install`     | exit 0                       |
| Typecheck | `pnpm typecheck`   | exit 0, no errors            |
| Tests     | `pnpm test`        | all pass (run non-watch, see below) |
| Build     | `pnpm build`       | exit 0, emits `dist/`        |

`pnpm test` runs Vitest in watch mode by default. Run it once and exit with:
`pnpm exec vitest run`.

> **Do not run `pnpm build` casually**: per plan 002 it has a side effect
> (writes to `~/.claude/skills/tiempo`). For this plan, prefer
> `pnpm exec tsup` to check the bundle and `pnpm typecheck` for types. Only run
> the full `pnpm build` in the final done-criteria check if plan 002 has already
> neutralized that side effect; otherwise note it and skip.

## Scope

**In scope** (modify only these):
- `src/shared/temporal.ts` — **create** (the accessor + brand helpers).
- `src/shared/temporal.test.ts` — **create** (unit tests for the helpers).
- The **46 value-import files in `src/` root** listed in Step 2.
- The **7 value-import files in `src/shared/`** listed in Step 2.
- The **12 files containing `instanceof Temporal.`** listed in Step 3.
- `tsup.config.ts` — only if Step 5 shows the dynamic import is not preserved.

**Out of scope** (do NOT touch):
- The **30 `import type { Temporal }` files** — they have no runtime cost.
- All **`*.test.ts` files except the new `temporal.test.ts`** — existing tests
  build fixtures from the polyfill directly; brand checks make that safe, and
  rewriting 82 test files is unnecessary churn and risk.
- `package.json` dependencies — the polyfill stays a normal dependency.
- `src/index.ts` — no public export changes; the accessor is internal.
- Any function's behavior, signature, or JSDoc semantics.

## Git workflow

- Branch: `advisor/001-lazy-native-temporal`
- Commit per step or logical unit; conventional commits (repo uses them — see
  `git log`: `feat: add Unix timestamp support to toUtc and toZonedTime`).
  Suggested: `refactor: route Temporal access through lazy native-first accessor`.
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Create the accessor + brand helpers

Create `src/shared/temporal.ts`:

```ts
import type { Temporal as TemporalNamespace } from '@js-temporal/polyfill';

/**
 * @internal
 * Single source of the Temporal implementation.
 *
 * Prefers the runtime's native `globalThis.Temporal` (Node 26+, Chrome 144+,
 * Firefox 139+, Edge, Deno) and dynamically loads `@js-temporal/polyfill` only
 * when native Temporal is absent (Safari, Node <= 25). On native runtimes the
 * polyfill is never imported or executed.
 *
 * Do not import the polyfill directly anywhere else in src/ — import `Temporal`
 * from this module so the runtime choice stays in one place.
 */
export const Temporal: typeof TemporalNamespace =
  (globalThis as { Temporal?: typeof TemporalNamespace }).Temporal ??
  (await import('@js-temporal/polyfill')).Temporal;

/**
 * @internal
 * Implementation-agnostic type guards.
 *
 * `instanceof` is identity-based and fails across implementations (a
 * polyfill-created object is not `instanceof` a native class). The Temporal
 * spec requires every implementation to set `Symbol.toStringTag`, so brand
 * checks work regardless of which implementation produced the object.
 */
function brand(value: unknown): string | undefined {
  return typeof value === 'object' && value !== null
    ? (value as { [Symbol.toStringTag]?: string })[Symbol.toStringTag]
    : undefined;
}

export function isInstant(value: unknown): value is TemporalNamespace.Instant {
  return brand(value) === 'Temporal.Instant';
}

export function isZonedDateTime(
  value: unknown
): value is TemporalNamespace.ZonedDateTime {
  return brand(value) === 'Temporal.ZonedDateTime';
}

export function isPlainDate(
  value: unknown
): value is TemporalNamespace.PlainDate {
  return brand(value) === 'Temporal.PlainDate';
}
```

**Verify**: `pnpm typecheck` → exit 0.

If typecheck fails because `globalThis.Temporal` is untyped or the
`typeof TemporalNamespace` assignment is rejected, this is expected friction —
fix the typing only (e.g. the inline `globalThis as {...}` cast already handles
the global; if the assignment to `typeof TemporalNamespace` is rejected, change
the export's annotation to `: typeof import('@js-temporal/polyfill').Temporal`).
Do NOT change the runtime expression. If it still won't typecheck after two
attempts, STOP and report.

### Step 2: Repoint every value import to the accessor

For each file below, replace the line
`import { Temporal } from '@js-temporal/polyfill';`
with an import of the accessor at the correct relative path. **Leave any
`import type { Temporal } from '@js-temporal/polyfill';` lines untouched** —
those files are not in this list.

**46 files in `src/` root** → `import { Temporal } from './shared/temporal';`

```
differenceInDays.ts        differenceInHours.ts       differenceInMicroseconds.ts
differenceInMilliseconds.ts differenceInMinutes.ts    differenceInMonths.ts
differenceInNanoseconds.ts differenceInSeconds.ts     differenceInWeeks.ts
differenceInYears.ts       eachDayOfInterval.ts       eachHourOfInterval.ts
eachMinuteOfInterval.ts    eachMonthOfInterval.ts     eachWeekOfInterval.ts
eachYearOfInterval.ts      endOfDay.ts                endOfMonth.ts
endOfWeek.ts               endOfYear.ts               format.ts
formatPlainDate.ts         isAfter.ts                 isBefore.ts
isPlainDateAfter.ts        isPlainDateBefore.ts       isPlainDateEqual.ts
isPlainTimeAfter.ts        isPlainTimeBefore.ts       isPlainTimeEqual.ts
isSameDay.ts               isWithinInterval.ts        now.ts
simpleFormat.ts            startOfDay.ts              startOfMonth.ts
startOfWeek.ts             startOfYear.ts             toDate.ts
toIso.ts                   toIso9075.ts               toPlainDate.ts
toPlainTime.ts             toUtc.ts                   toZonedTime.ts
today.ts
```

**7 files in `src/shared/`** → `import { Temporal } from './temporal';`

```
differenceInMilliseconds.ts  isAfter.ts  isBefore.ts  normalizeTemporalInput.ts
normalizeWithPlainDate.ts     nowZoned.ts  plainDateToZonedDateTime.ts
```

Some files import both a value and types from the polyfill on separate lines —
only change the **value** line (`import { Temporal }`), keep the
`import type { ... }` line.

**Verify**:
- `grep -rl "import { Temporal } from '@js-temporal/polyfill'" src --exclude="*.test.ts"`
  → returns **nothing** (no non-test value imports of the polyfill remain).
- `pnpm typecheck` → exit 0.

### Step 3: Replace `instanceof Temporal.*` with brand helpers

12 files use `instanceof Temporal.{Instant,PlainDate,ZonedDateTime}` (17 sites
total):

```
src/toDate.ts        src/toIso.ts        src/toPlainTime.ts
src/simpleFormat.ts  src/toIso9075.ts    src/format.ts
src/endOfWeek.ts     src/toPlainDate.ts  src/toZonedTime.ts
src/startOfWeek.ts   src/shared/normalizeWithPlainDate.ts
src/shared/normalizeTemporalInput.ts
```

In each, replace the guard with the matching imported helper:

| Replace                                | With                       |
|----------------------------------------|----------------------------|
| `x instanceof Temporal.Instant`        | `isInstant(x)`             |
| `x instanceof Temporal.ZonedDateTime`  | `isZonedDateTime(x)`       |
| `x instanceof Temporal.PlainDate`      | `isPlainDate(x)`           |

Add the helpers to each file's accessor import, e.g. in `src/toUtc.ts`-style
root files:
`import { Temporal, isInstant } from './shared/temporal';`
and in `src/shared/` files:
`import { Temporal, isInstant } from './temporal';`
Import only the helpers a file actually uses (strict unused-import rules apply).

Worked example — `src/shared/normalizeTemporalInput.ts` becomes:

```ts
import { isInstant } from './temporal';
import type { Temporal } from '@js-temporal/polyfill';

export function normalizeTemporalInput(
  input: Temporal.Instant | Temporal.ZonedDateTime
): Temporal.ZonedDateTime {
  return isInstant(input) ? input.toZonedDateTimeISO('UTC') : input;
}
```

Note this file no longer needs the *value* `Temporal` (only types) — switch its
polyfill import to `import type` here. Apply the same judgment per file: if after
the swap a file uses `Temporal` only in type positions, make it `import type`;
if it still constructs values (`Temporal.Instant.from`, `new Temporal.*`), keep
the value import from the accessor.

**Verify**:
- `grep -rn "instanceof Temporal\." src --exclude="*.test.ts"` → **no matches**.
- `pnpm typecheck` → exit 0.

### Step 4: Add unit tests for the accessor and brand helpers

Create `src/shared/temporal.test.ts`, modeled structurally on
`src/toUtc.test.ts` (Vitest `describe`/`it`/`expect`):

```ts
import { describe, it, expect } from 'vitest';
import { Temporal as Poly } from '@js-temporal/polyfill';
import {
  Temporal,
  isInstant,
  isZonedDateTime,
  isPlainDate,
} from './temporal';

describe('temporal accessor', () => {
  it('resolves a usable Temporal implementation', () => {
    expect(typeof Temporal.Instant.from).toBe('function');
    expect(Temporal.Instant.from('2025-01-01T00:00:00Z').epochMilliseconds)
      .toBe(Date.parse('2025-01-01T00:00:00Z'));
  });
});

describe('brand guards (implementation-agnostic)', () => {
  const instant = Poly.Instant.from('2025-01-01T00:00:00Z');
  const zoned = instant.toZonedDateTimeISO('UTC');
  const plain = Poly.PlainDate.from('2025-01-01');

  it('isInstant', () => {
    expect(isInstant(instant)).toBe(true);
    expect(isInstant(zoned)).toBe(false);
    expect(isInstant(plain)).toBe(false);
    expect(isInstant(null)).toBe(false);
    expect(isInstant('2025-01-01T00:00:00Z')).toBe(false);
    expect(isInstant(123)).toBe(false);
  });

  it('isZonedDateTime', () => {
    expect(isZonedDateTime(zoned)).toBe(true);
    expect(isZonedDateTime(instant)).toBe(false);
    expect(isZonedDateTime(plain)).toBe(false);
  });

  it('isPlainDate', () => {
    expect(isPlainDate(plain)).toBe(true);
    expect(isPlainDate(instant)).toBe(false);
    expect(isPlainDate(zoned)).toBe(false);
  });
});
```

**Verify**: `pnpm exec vitest run src/shared/temporal.test.ts` → all pass.

### Step 5: Confirm the dynamic import survives the build

Run `pnpm exec tsup` (this does not trigger the plan-002 home-dir side effect;
only `generate:docs` does).

**Verify**:
- exit 0, `dist/shared/temporal.js` exists.
- `grep -rn "import(" dist/shared/temporal.js` → shows a preserved dynamic
  `import('@js-temporal/polyfill')` (the lazy load), **and**
  `grep -n "globalThis" dist/shared/temporal.js` → shows the native-first check.

If tsup has **inlined or eagerly hoisted** the polyfill (no dynamic `import(` in
the output, or the polyfill appears statically required at top of file), the
lazy behavior is lost. Fix by marking the polyfill external in `tsup.config.ts`:
add `external: ['@js-temporal/polyfill']` to the `defineConfig` object, rebuild,
and re-check. If it still inlines after that, STOP and report — do not ship an
eager polyfill.

### Step 6: Full verification

Run the whole suite: `pnpm exec vitest run` → all pass (existing tests +
the new `temporal.test.ts`).
Run `pnpm typecheck` → exit 0.

## Test plan

- New file `src/shared/temporal.test.ts` (Step 4): accessor resolves a working
  implementation; each brand guard returns true only for its own type and false
  for the other two types, `null`, strings, and numbers.
- Existing `*.test.ts` files are the regression net for behavior: they build
  polyfill fixtures and call the public functions, which now route via brand
  checks. If any previously-passing test fails, the brand routing is wrong —
  that is the signal to catch a mistake in Step 3.
- Structural pattern to follow: `src/toUtc.test.ts`.
- Verification: `pnpm exec vitest run` → all pass.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `src/shared/temporal.ts` exists, exporting `Temporal`, `isInstant`,
      `isZonedDateTime`, `isPlainDate`.
- [ ] `grep -rl "import { Temporal } from '@js-temporal/polyfill'" src --exclude="*.test.ts"`
      → no matches.
- [ ] `grep -rn "instanceof Temporal\." src --exclude="*.test.ts"` → no matches.
- [ ] `pnpm typecheck` exits 0.
- [ ] `pnpm exec vitest run` exits 0; `src/shared/temporal.test.ts` runs and passes.
- [ ] `pnpm exec tsup` exits 0 and `dist/shared/temporal.js` contains a dynamic
      `import('@js-temporal/polyfill')` and a `globalThis` native check.
- [ ] Only in-scope files modified (`git status` shows no `*.test.ts` changes
      except the new `temporal.test.ts`, no `package.json` dependency change,
      no `src/index.ts` change).
- [ ] `plans/README.md` status row for 001 updated.

## STOP conditions

Stop and report back (do not improvise) if:

- The drift check shows in-scope files changed since `9f5bc98` and the
  "Current state" excerpts no longer match the live code.
- `globalThis.Temporal` typing cannot be satisfied after two attempts without
  changing the *runtime* expression (Step 1).
- tsup keeps eagerly bundling the polyfill even after `external` is set (Step 5).
- Any previously-passing test fails and the cause is not an obvious brand-check
  typo you can fix in one edit (this means the migration changed behavior).
- You find a runtime construction the brand helpers don't cover (e.g. an
  `instanceof Temporal.PlainTime` or `PlainDateTime` appears that this plan
  didn't enumerate) — add the analogous guard only if trivially parallel,
  otherwise STOP.

## Maintenance notes

For whoever owns this next:
- **CI exercises only the polyfill path.** CI runs Node 20.x/22.x, where
  `globalThis.Temporal` is absent (Node ≤ 25 needs `--harmony-temporal`), so the
  accessor always takes the polyfill branch in CI. The native branch is covered
  indirectly by the impl-agnostic brand tests. To exercise native end-to-end,
  add a Node 26 entry to the CI matrix in `.github/workflows/ci.yml` (follow-up,
  deliberately out of scope here).
- **Top-level await propagates.** `src/shared/temporal.ts` uses TLA, so every
  module importing it becomes async-resolved. tiempo is ESM-only (`package.json`
  `"type": "module"`, tsup `format: ['esm']`), so this is fine; but it is one
  more reason a CJS/`require` build is not viable without rework. If a dual
  CJS build is ever added, this accessor must be revisited.
- **Dropping the polyfill entirely** (when Safari ships stable + Node 26 is LTS)
  is now a one-file change: delete the `?? (await import(...))` fallback in
  `temporal.ts` and move the polyfill to an optional `peerDependency`. No other
  source file references the polyfill at runtime.
- **Reviewer focus**: confirm no `instanceof Temporal.*` slipped back in, and
  that no file was downgraded to `import type` while still constructing Temporal
  values at runtime (that would throw at runtime but may pass typecheck if the
  value is only used in a way TS can't catch).
