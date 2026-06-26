# Plan 004: Make `format()` AM/PM tokens locale-aware instead of English-only

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. If a
> "STOP conditions" item occurs, stop and report — do not improvise. When done,
> update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**:
> `git diff --stat 9f5bc98..HEAD -- src/format.ts src/format.test.ts`
> If either changed since this plan was written, compare the "Current state"
> excerpts against the live code; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P3
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none (independent of plan 003, which edits different tokens in
  the same file — see "Coordination")
- **Category**: bug / i18n
- **Planned at**: commit `9f5bc98`, 2026-06-25

## Why this matters

`format()` accepts a `locale` option, but the AM/PM day-period tokens
(`a`, `aa`, `aaa`, `aaaa`, `aaaaa`) are hard-wired to English and misbehave in
every other locale:

1. The day-period is extracted with an English-only regex
   (`/\b(AM|PM|am|pm|a\.m\.|p\.m\.)\b/`). Spanish renders the period as
   `"p. m."` (with a space), which the regex does not match, so it falls back to
   `formatted.split(' ').pop()` — fragile and locale-dependent.
2. The `aaaa` token returns `period === 'AM' ? 'a.m.' : 'p.m.'`. For any
   non-English locale `period` is never the string `'AM'`, so `aaaa`
   **always returns `'p.m.'`** — even at 9 in the morning.

Verified at commit `9f5bc98`: with `Intl` `formatToParts`, the day-period for a
PM time is `"PM"` (en-US), `"p. m."` (es-ES), `"午後"` (ja-JP) — i.e. the
correct, locale-specific value is readily available. This plan switches the
day-period extraction to `formatToParts` so the locale value is used directly,
and keeps the English typographic widths (`a.m.`/`p.m.`, narrow `a`/`p`) as a
best-effort transform applied only when the locale value is recognizably ASCII
AM/PM.

## Current state

`src/format.ts`, the five day-period cases (`src/format.ts:263-276`):

```ts
    // AM/PM
    case 'aaaaa': {
      const period = formatPart(zonedDateTime, 'dayPeriod', 'narrow', locale).toLowerCase();
      return period.charAt(0);
    }
    case 'aaaa': {
      const period = formatPart(zonedDateTime, 'dayPeriod', 'short', locale);
      return period === 'AM' ? 'a.m.' : 'p.m.';
    }
    case 'aaa':
      return formatPart(zonedDateTime, 'dayPeriod', 'short', locale).toLowerCase();
    case 'aa':
    case 'a':
      return formatPart(zonedDateTime, 'dayPeriod', 'short', locale);
```

`formatPart`'s day-period branch (`src/format.ts:370-395`):

```ts
function formatPart(
  zonedDateTime: Temporal.ZonedDateTime,
  part: 'era' | 'year' | 'month' | 'weekday' | 'day' | 'dayPeriod' | 'hour' | 'minute' | 'second' | 'timeZoneName',
  style: 'narrow' | 'short' | 'long' | 'numeric' | '2-digit',
  locale: string
): string {
  const options: Intl.DateTimeFormatOptions = {};

  if (part === 'dayPeriod') {
    // dayPeriod needs hour to be present
    options.hour = 'numeric';
    options.hour12 = true;
  } else {
    options[part] = style as any;
  }

  const formatted = zonedDateTime.toLocaleString(locale, options);

  if (part === 'dayPeriod') {
    // Extract just the AM/PM part
    const match = formatted.match(/\b(AM|PM|am|pm|a\.m\.|p\.m\.)\b/);
    return match ? match[0] : formatted.split(' ').pop() || '';
  }

  return formatted;
}
```

`ZonedDateTime` exposes `.epochMilliseconds` and `.timeZoneId`, which is what the
new helper uses with `Intl.DateTimeFormat(...).formatToParts(new Date(...))`.

### Repo conventions to match
- All `format()` logic stays in `src/format.ts`. Helpers are module-scoped
  functions below `format` (see `getOrdinalSuffix`, `getTimezoneOffset`).
- Tests in `src/format.test.ts` (Vitest) build `Temporal.ZonedDateTime`
  fixtures and assert exact strings.

## Commands you will need

| Purpose   | Command                                   | Expected  |
|-----------|-------------------------------------------|-----------|
| Typecheck | `pnpm typecheck`                          | exit 0    |
| Tests     | `pnpm exec vitest run src/format.test.ts` | all pass  |

## Scope

**In scope**:
- `src/format.ts` — the five `a*` cases, plus a new `getDayPeriod` helper; and
  removal of the now-dead day-period branch in `formatPart`.
- `src/format.test.ts` — add locale regression tests.

**Out of scope** (do NOT touch):
- Any non-`a*` token (`y`, `M`, `d`, `E`, `h`, `H`, `x`, `X`, `z`, …).
- `getTimezoneOffset`, `getOrdinalSuffix`.
- The `format()` main loop and `consumeToken`.

### Coordination
Plan 003 also edits `src/format.ts` (the `x`/`X` cases at lines 333-351), which
do not overlap with the `a*` cases (263-276) or `formatPart` (370-395). If both
plans run, run them on separate branches and expect a trivial,
non-conflicting merge. If you are executing both, do 003 first, then re-run this
plan's drift check.

## Git workflow

- Branch: `advisor/004-format-locale-ampm`
- Conventional commit, e.g.
  `fix: make format() AM/PM tokens locale-aware via Intl formatToParts`.
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Add a locale-aware day-period helper

Add these module-scoped helpers to `src/format.ts` (place them next to
`getTimezoneOffset`, near the bottom of the file):

```ts
/**
 * Locale-correct day period (AM/PM equivalent) via Intl.formatToParts.
 * Returns the locale's own value, e.g. "AM"/"PM" (en), "p. m." (es), "午後" (ja).
 */
function getDayPeriod(zonedDateTime: Temporal.ZonedDateTime, locale: string): string {
  const parts = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    hour12: true,
    timeZone: zonedDateTime.timeZoneId,
  }).formatToParts(new Date(zonedDateTime.epochMilliseconds));
  return parts.find((p) => p.type === 'dayPeriod')?.value ?? '';
}

/** True when the day-period is recognizably ASCII AM/PM (so English widths apply). */
function isAsciiAmPm(period: string): boolean {
  const normalized = period.toUpperCase().replace(/[.\s]/g, '');
  return normalized === 'AM' || normalized === 'PM';
}

/** True for the AM half (only meaningful when isAsciiAmPm is true). */
function isAm(period: string): boolean {
  return period.toUpperCase().replace(/[.\s]/g, '').startsWith('A');
}
```

**Verify**: `pnpm typecheck` → exit 0.

### Step 2: Reroute the five `a*` cases through the helper

Replace the block at `src/format.ts:263-276` with:

```ts
    // AM/PM (locale-aware; English widths applied only for ASCII AM/PM)
    case 'aaaaa': {
      const period = getDayPeriod(zonedDateTime, locale);
      if (isAsciiAmPm(period)) return isAm(period) ? 'a' : 'p';
      return period.charAt(0).toLowerCase();
    }
    case 'aaaa': {
      const period = getDayPeriod(zonedDateTime, locale);
      if (isAsciiAmPm(period)) return isAm(period) ? 'a.m.' : 'p.m.';
      return period;
    }
    case 'aaa':
      return getDayPeriod(zonedDateTime, locale).toLowerCase();
    case 'aa':
    case 'a':
      return getDayPeriod(zonedDateTime, locale);
```

**Verify**: `pnpm typecheck` → exit 0.

### Step 3: Remove the now-dead day-period code in `formatPart`

`formatPart` is no longer called with `'dayPeriod'`. Remove the `'dayPeriod'`
member from its `part` union and delete the two `if (part === 'dayPeriod')`
blocks, leaving:

```ts
function formatPart(
  zonedDateTime: Temporal.ZonedDateTime,
  part: 'era' | 'year' | 'month' | 'weekday' | 'day' | 'hour' | 'minute' | 'second' | 'timeZoneName',
  style: 'narrow' | 'short' | 'long' | 'numeric' | '2-digit',
  locale: string
): string {
  const options: Intl.DateTimeFormatOptions = {};
  options[part] = style as any;
  return zonedDateTime.toLocaleString(locale, options);
}
```

**Verify**:
- `grep -n "dayPeriod" src/format.ts` → matches only inside `getDayPeriod`
  (the `p.type === 'dayPeriod'` find), not in `formatPart`.
- `pnpm typecheck` → exit 0.

### Step 4: Add regression tests

In `src/format.test.ts`, add a `describe('AM/PM tokens are locale-aware')`
block:

```ts
const morning = Temporal.ZonedDateTime.from('2025-01-20T09:00:00-05:00[America/New_York]');
const evening = Temporal.ZonedDateTime.from('2025-01-20T21:00:00-05:00[America/New_York]');

it('English widths unchanged', () => {
  expect(format(morning, 'a')).toBe('AM');
  expect(format(evening, 'a')).toBe('PM');
  expect(format(morning, 'aaa')).toBe('am');
  expect(format(morning, 'aaaa')).toBe('a.m.');
  expect(format(evening, 'aaaa')).toBe('p.m.');
  expect(format(morning, 'aaaaa')).toBe('a');
  expect(format(evening, 'aaaaa')).toBe('p');
});

it('non-English locale no longer always returns PM/p.m.', () => {
  // The core bug: a morning time in es-ES previously rendered as 'p. m.'
  const amEs = format(morning, 'a', { locale: 'es-ES' });
  const pmEs = format(evening, 'a', { locale: 'es-ES' });
  expect(amEs).not.toBe(pmEs);          // morning and evening differ
  expect(amEs.toLowerCase()).toContain('a'); // "a. m."
  expect(pmEs.toLowerCase()).toContain('p'); // "p. m."
  // aaaa must reflect the actual half, not hard-coded p.m.
  expect(format(morning, 'aaaa', { locale: 'es-ES' })).not.toBe(
    format(evening, 'aaaa', { locale: 'es-ES' })
  );
});
```

Rationale for the looser `es-ES` assertions: exact day-period strings (`"a. m."`
vs `"a.m."`) vary by ICU/runtime version, so the tests assert the **morning ≠
evening** invariant and the leading letter rather than a brittle exact string —
that is what proves the bug (always-PM) is fixed without coupling to an ICU
version.

**Verify**: `pnpm exec vitest run src/format.test.ts` → all pass.

## Test plan

- English-width regression: `a/aa/aaa/aaaa/aaaaa` for a morning and an evening
  time produce the existing English outputs (no behavior change for the default
  locale).
- i18n fix: `es-ES` morning vs evening differ, and `aaaa` is no longer
  hard-coded to `p.m.`.
- Pattern to follow: existing `src/format.test.ts` cases.
- Verification: full suite `pnpm exec vitest run` → all pass.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `pnpm typecheck` exits 0.
- [ ] `grep -n "/\\\\b(AM|PM" src/format.ts` → no matches (English regex gone).
- [ ] `grep -n "=== 'AM'" src/format.ts` → no matches (hard-coded AM check gone).
- [ ] `pnpm exec vitest run src/format.test.ts` exits 0 with the new tests
      passing.
- [ ] `pnpm exec vitest run` (full suite) exits 0.
- [ ] Only `src/format.ts` and `src/format.test.ts` modified (`git status`).
- [ ] `plans/README.md` status row for 004 updated.

## STOP conditions

Stop and report if:
- The drift check shows `src/format.ts` changed since `9f5bc98` and the `a*`
  case excerpts or `formatPart` no longer match.
- An English-width test fails after the change — that means `getDayPeriod`
  returns something other than `"AM"`/`"PM"` for en-US on this runtime; report
  the actual value rather than loosening the English assertions.
- Removing the `'dayPeriod'` union member breaks a caller you didn't expect
  (search `formatPart(` usages first; all should pass a concrete part literal).

## Maintenance notes

- **Known residual limitation** (acceptable, document only): for non-English
  locales, the width tokens `aaaa`/`aaaaa` return the locale's full day-period
  value (or its first character), not a locale-specific abbreviated/narrow form,
  because `Intl` exposes no per-width AM/PM variant and tiempo intentionally
  keeps no locale tables (it delegates i18n to `Intl`). The `a`/`aa`/`aaa`
  tokens are fully locale-correct. This is a deliberate trade-off, not a bug to
  re-file.
- Reviewer focus: confirm default-locale (en-US) output is byte-for-byte
  unchanged — this fix must not regress the common path.
- If a dependency on exact day-period strings appears elsewhere, route it
  through `getDayPeriod` too rather than re-introducing a regex.
