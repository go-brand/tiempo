# Plan 003: Fix `format()` `x`/`X` offset tokens dropping the minutes of the offset

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**:
> `git diff --stat 9f5bc98..HEAD -- src/format.ts src/format.test.ts`
> If either changed since this plan was written, compare the "Current state"
> excerpts against the live code; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `9f5bc98`, 2026-06-25

## Why this matters

`format()`'s single-letter timezone-offset tokens `x` and `X` **discard the
minutes** of the offset. They split the offset string on `:` and return only
the hours part, so any timezone whose offset is not a whole hour renders wrong:

- `Asia/Kolkata` (+05:30) → `+05` (should be `+0530`)
- `Asia/Kathmandu` (+05:45) → `+05`
- `America/St_Johns` (−03:30 / −02:30) → `-03`
- `Australia/Adelaide`, `Australia/Eucla`, Chatham Islands, Iran, etc.

That is wrong offset data for well over a billion people's zones. The
multi-letter variants (`xx`/`xxx`/`XX`/`XXX`) already handle minutes correctly;
only the single-letter forms are broken.

Correct behavior (matching the de-facto `x`/`X` convention used by date-fns):
show hours only when the offset minutes are zero, otherwise show hours+minutes
with no separator. `X` additionally emits `Z` for a zero offset.

| Token | +05:30        | +00:00 | −08:00 |
|-------|---------------|--------|--------|
| `x`   | `+0530`       | `+00`  | `-08`  |
| `X`   | `+0530`       | `Z`    | `-08`  |

## Current state

`src/format.ts` builds the base offset via `getTimezoneOffset`, which always
returns a colon form like `+05:30` / `+00:00` (`src/format.ts:406-414`):

```ts
function getTimezoneOffset(zonedDateTime: Temporal.ZonedDateTime): string {
  const offsetNs = zonedDateTime.offsetNanoseconds;
  const offsetMinutes = offsetNs / (60 * 1e9);
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const absMinutes = Math.abs(offsetMinutes);
  const hours = Math.floor(absMinutes / 60);
  const minutes = absMinutes % 60;
  return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
```

The two broken cases (`src/format.ts:333-338` and `347-351`):

```ts
    case 'X': {
      const offset = getTimezoneOffset(zonedDateTime);
      if (offset === '+00:00') return 'Z';
      const [hours] = offset.split(':');
      return hours || '+00';
    }
    // ...
    case 'x': {
      const offset = getTimezoneOffset(zonedDateTime);
      const [hours] = offset.split(':');
      return hours || '+00';
    }
```

`const [hours] = offset.split(':')` takes `'+05'` from `'+05:30'` and throws the
`'30'` away. The correct, already-working siblings for reference:

```ts
    case 'XXX': {                                   // line 325
      const offset = getTimezoneOffset(zonedDateTime);
      return offset === '+00:00' ? 'Z' : offset;    // "+05:30" or "Z"
    }
    case 'XX': {                                     // line 329
      const offset = getTimezoneOffset(zonedDateTime).replace(':', '');
      return offset === '+0000' ? 'Z' : offset;      // "+0530" or "Z"
    }
    case 'xxx':                                       // line 343
      return getTimezoneOffset(zonedDateTime);
    case 'xx':                                        // line 345
      return getTimezoneOffset(zonedDateTime).replace(':', '');
```

### Repo conventions to match
- `format()` token logic lives entirely in `src/format.ts` in the
  `formatToken` switch; keep the fix inside the two `case` blocks.
- Tests are in `src/format.test.ts` (Vitest), constructing
  `Temporal.ZonedDateTime` fixtures. Match that structure.

## Commands you will need

| Purpose   | Command                                  | Expected            |
|-----------|------------------------------------------|---------------------|
| Typecheck | `pnpm typecheck`                         | exit 0              |
| Tests     | `pnpm exec vitest run src/format.test.ts`| all pass            |

## Scope

**In scope**:
- `src/format.ts` — only the `case 'x'` and `case 'X'` blocks.
- `src/format.test.ts` — add regression tests.

**Out of scope** (do NOT touch):
- `getTimezoneOffset` — it is correct; do not change its colon output.
- The `xx`/`xxx`/`XX`/`XXX`/`xxxx`/`xxxxx`/`XXXX`/`XXXXX` cases — already
  correct.
- The `z`/`zz`/`zzzz` timezone-name tokens.
- Any other token or function.

## Git workflow

- Branch: `advisor/003-format-offset-minutes`
- Conventional commit, e.g.
  `fix: include offset minutes in format() x and X tokens`.
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Fix the `X` case

Replace the `case 'X'` block (`src/format.ts:333-338`) with:

```ts
    case 'X': {
      const offset = getTimezoneOffset(zonedDateTime); // "+05:30" / "+00:00"
      if (offset === '+00:00') return 'Z';
      const [hours, minutes] = offset.split(':');
      return minutes === '00' ? hours! : `${hours}${minutes}`;
    }
```

### Step 2: Fix the `x` case

Replace the `case 'x'` block (`src/format.ts:347-351`) with:

```ts
    case 'x': {
      const offset = getTimezoneOffset(zonedDateTime); // "+05:30" / "+00:00"
      const [hours, minutes] = offset.split(':');
      return minutes === '00' ? hours! : `${hours}${minutes}`;
    }
```

Note on the `!`: `tsconfig.json` has `noUncheckedIndexedAccess`, so
`offset.split(':')` yields `(string | undefined)[]`. `getTimezoneOffset` always
returns a `±HH:MM` string, so both parts exist; the non-null assertion is safe
and matches how the surrounding code already trusts this shape. If the assertion
style trips a lint rule, instead destructure with a fallback:
`const [hours = '+00', minutes = '00'] = offset.split(':');`.

**Verify**: `pnpm typecheck` → exit 0.

### Step 3: Add regression tests

In `src/format.test.ts`, add a `describe('offset tokens with non-zero minutes')`
block. Use a half-hour and a quarter-hour zone and UTC:

```ts
it('x includes offset minutes (India +05:30)', () => {
  const zdt = Temporal.ZonedDateTime.from('2025-01-20T12:00:00+05:30[Asia/Kolkata]');
  expect(format(zdt, 'x')).toBe('+0530');
  expect(format(zdt, 'X')).toBe('+0530');
});

it('x for Nepal +05:45', () => {
  const zdt = Temporal.ZonedDateTime.from('2025-01-20T12:00:00+05:45[Asia/Kathmandu]');
  expect(format(zdt, 'x')).toBe('+0545');
  expect(format(zdt, 'X')).toBe('+0545');
});

it('x/X for whole-hour and UTC offsets unchanged', () => {
  const ny = Temporal.ZonedDateTime.from('2025-01-20T12:00:00-05:00[America/New_York]');
  expect(format(ny, 'x')).toBe('-05');
  expect(format(ny, 'X')).toBe('-05');
  const utc = Temporal.ZonedDateTime.from('2025-01-20T12:00:00+00:00[UTC]');
  expect(format(utc, 'x')).toBe('+00');
  expect(format(utc, 'X')).toBe('Z');
});
```

If `src/format.test.ts` imports `Temporal` and `format` already at the top
(it does), reuse those imports — do not duplicate them.

**Verify**: `pnpm exec vitest run src/format.test.ts` → all pass, including the
3 new tests.

## Test plan

- New tests cover: half-hour zone (India), quarter-hour zone (Nepal),
  whole-hour zone (New York, regression for the unchanged path), and UTC
  (`x` → `+00`, `X` → `Z`).
- Pattern to follow: existing cases in `src/format.test.ts`.
- Verification: `pnpm exec vitest run src/format.test.ts` → all pass.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `pnpm typecheck` exits 0.
- [ ] `pnpm exec vitest run src/format.test.ts` exits 0 with the new tests
      present and passing.
- [ ] `pnpm exec vitest run` (full suite) exits 0 — no other token regressed.
- [ ] Only `src/format.ts` and `src/format.test.ts` modified (`git status`).
- [ ] `plans/README.md` status row for 003 updated.

## STOP conditions

Stop and report if:
- The drift check shows `src/format.ts` changed since `9f5bc98` and the
  `case 'x'`/`case 'X'` excerpts no longer match.
- The full suite shows a regression in a token you did not touch — that means
  these cases shared state you didn't expect; report before forcing a fix.

## Maintenance notes

- date-fns reserves `O`/`OO`/`OOO` ("GMT+5:30") and `zzzz` (long zone name)
  tokens; tiempo does not implement `O*`. If those are added later, mirror this
  minutes-aware logic.
- Reviewer focus: confirm whole-hour and UTC outputs are unchanged (the bug fix
  must be a pure superset — only non-zero-minute zones change).
