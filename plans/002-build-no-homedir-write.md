# Plan 002: Stop `pnpm build` from writing into the user's home directory

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**:
> `git diff --stat 9f5bc98..HEAD -- scripts/generate-docs.ts package.json`
> If either file changed since this plan was written, compare the "Current
> state" excerpts against the live code before proceeding; on a mismatch, treat
> it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx / safety
- **Planned at**: commit `9f5bc98`, 2026-06-25

## Why this matters

`scripts/generate-docs.ts` writes files **into the user's home directory** —
`~/.claude/skills/tiempo` — unconditionally, with no opt-in and no CI guard. It
is wired into `pnpm build` (`package.json`: `"build": "pnpm generate:timezones
&& pnpm generate:docs && tsup && tsc --emitDeclarationOnly"`), and
`CONTRIBUTING.md` instructs every contributor to run `pnpm build`. So merely
building the library silently creates and **overwrites** files in a directory
that belongs to the user's global tooling — it can clobber a contributor's
customized `~/.claude/skills/tiempo` skill. A build step should only write
inside the repo.

After this plan: `pnpm build` (and CI, and the publish action) writes only
inside the repo. The home-directory sync still exists but is **opt-in** behind
an environment variable, so a maintainer who wants it runs it deliberately.

## Current state

`scripts/generate-docs.ts` defines home-directory paths and writes to them in
two functions:

- Path definitions (`scripts/generate-docs.ts:23-26`):
  ```ts
  // Global skill directory (synced alongside repo skills)
  const GLOBAL_SKILL_DIR = path.join(os.homedir(), ".claude/skills/tiempo");
  const GLOBAL_SKILL_REFS_DIR = path.join(GLOBAL_SKILL_DIR, "references");
  const GLOBAL_SKILL_MD_PATH = path.join(GLOBAL_SKILL_DIR, "SKILL.md");
  ```
- In `generateSkillRefs` (`scripts/generate-docs.ts:187-194`):
  ```ts
    // Write to global skill directory
    const globalOutDir = path.join(GLOBAL_SKILL_REFS_DIR, doc.category);
    fs.mkdirSync(globalOutDir, { recursive: true });
    const globalOutPath = path.join(globalOutDir, `${doc.slug}.md`);
    fs.writeFileSync(globalOutPath, markdown);
  }

  console.log(`  ✓ Synced to ${GLOBAL_SKILL_REFS_DIR}`);
  ```
- In `generateSkillMd` (`scripts/generate-docs.ts:346-349`):
  ```ts
    // Write to global skill directory
    fs.mkdirSync(GLOBAL_SKILL_DIR, { recursive: true });
    fs.writeFileSync(GLOBAL_SKILL_MD_PATH, content);
    console.log(`  ✓ ${GLOBAL_SKILL_MD_PATH}`);
  ```

The repo-local writes in the same functions (`SKILL_REFS_DIR`,
`LLMS_TXT_PATH`, `SKILL_MD_PATH`, all relative paths under the repo) are
legitimate and must keep running every build. Only the **global / homedir**
writes change.

### Repo conventions to match
- Scripts are TypeScript run via `tsx` (`package.json` scripts). Plain
  `node:fs`/`node:path`/`node:os`, no extra deps. Match that.

## Commands you will need

| Purpose            | Command                              | Expected on success            |
|--------------------|--------------------------------------|--------------------------------|
| Run the generator  | `pnpm generate:docs`                 | exit 0, prints "✅ Done!"       |
| Typecheck          | `pnpm typecheck`                     | exit 0                         |
| Isolated-HOME run  | see Step 2 verify                    | home dir untouched             |

## Scope

**In scope** (modify only these):
- `scripts/generate-docs.ts`

**Out of scope** (do NOT touch):
- The repo-local writes (`SKILL_REFS_DIR`, `LLMS_TXT_PATH`, `SKILL_MD_PATH`) —
  they must keep working unconditionally.
- `package.json` — the `build` script stays as-is; the fix is inside the
  generator, so `build` simply stops writing home without a pipeline change.
- Any `src/` file, any docs content under `www/`.

## Git workflow

- Branch: `advisor/002-build-no-homedir-write`
- Conventional commit, e.g.
  `fix: gate global skill sync behind SYNC_GLOBAL_SKILL env var`.
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Gate the home-directory writes behind an opt-in env var

In `scripts/generate-docs.ts`, just after the `GLOBAL_*` path constants
(after line 26), add:

```ts
// Writing into the user's home directory (~/.claude/skills/tiempo) only
// happens when explicitly opted in, so `pnpm build` / CI never mutate global
// state. Run `SYNC_GLOBAL_SKILL=1 pnpm generate:docs` to sync.
const SYNC_GLOBAL_SKILL =
  process.env.SYNC_GLOBAL_SKILL === "1" ||
  process.env.SYNC_GLOBAL_SKILL === "true";
```

In `generateSkillRefs`, wrap the global write block (current lines 187-194) so
it only runs when opted in:

```ts
    // Write to global skill directory (opt-in)
    if (SYNC_GLOBAL_SKILL) {
      const globalOutDir = path.join(GLOBAL_SKILL_REFS_DIR, doc.category);
      fs.mkdirSync(globalOutDir, { recursive: true });
      const globalOutPath = path.join(globalOutDir, `${doc.slug}.md`);
      fs.writeFileSync(globalOutPath, markdown);
    }
  }

  if (SYNC_GLOBAL_SKILL) {
    console.log(`  ✓ Synced to ${GLOBAL_SKILL_REFS_DIR}`);
  }
```

In `generateSkillMd`, wrap the global write block (current lines 346-349):

```ts
  // Write to global skill directory (opt-in)
  if (SYNC_GLOBAL_SKILL) {
    fs.mkdirSync(GLOBAL_SKILL_DIR, { recursive: true });
    fs.writeFileSync(GLOBAL_SKILL_MD_PATH, content);
    console.log(`  ✓ ${GLOBAL_SKILL_MD_PATH}`);
  }
```

Also update the file's top JSDoc (lines 1-11) to mention the flag, e.g. add a
line under "Usage": `* Set SYNC_GLOBAL_SKILL=1 to also sync to ~/.claude/skills/tiempo`.

**Verify**: `pnpm typecheck` → exit 0.

### Step 2: Confirm a plain run does not touch home

Run the generator with an isolated HOME and assert nothing is written there:

```bash
TMP_HOME="$(mktemp -d)"
HOME="$TMP_HOME" pnpm generate:docs
test ! -e "$TMP_HOME/.claude/skills/tiempo" && echo "OK: home untouched" || echo "FAIL: wrote to home"
```

**Verify**: prints `OK: home untouched`, and the run still printed
`✓ <repo>/skills/tiempo/SKILL.md` and `✅ Done!`.

Then confirm the opt-in path still works:

```bash
TMP_HOME="$(mktemp -d)"
SYNC_GLOBAL_SKILL=1 HOME="$TMP_HOME" pnpm generate:docs
test -e "$TMP_HOME/.claude/skills/tiempo/SKILL.md" && echo "OK: opt-in synced" || echo "FAIL: opt-in did not sync"
```

**Verify**: prints `OK: opt-in synced`.

### Step 3: Confirm repo-local generation is unchanged

`git status` should show the repo-local generated files (under
`skills/tiempo/`, `www/public/llms.txt`) as the only changes from running the
generator — and those should be unchanged content (the generator is
idempotent). The home directory must not appear anywhere.

**Verify**: `git status --porcelain` shows no path outside the repo (it can't),
and `git diff --stat skills/ www/public/llms.txt` shows either no changes or
only regeneration noise — not an error.

## Test plan

This is a build-script change; the repo has no test harness for scripts. The
verification is the isolated-HOME runs in Step 2 (negative: plain run leaves
home untouched; positive: opt-in run writes home). No new `*.test.ts` file.

## Done criteria

Machine-checkable. ALL must hold:

- [ ] `pnpm typecheck` exits 0.
- [ ] `HOME=$(mktemp -d) pnpm generate:docs` leaves no
      `$HOME/.claude/skills/tiempo` (Step 2 negative check prints OK).
- [ ] `SYNC_GLOBAL_SKILL=1 HOME=$(mktemp -d) pnpm generate:docs` creates
      `$HOME/.claude/skills/tiempo/SKILL.md` (Step 2 positive check prints OK).
- [ ] `grep -n "SYNC_GLOBAL_SKILL" scripts/generate-docs.ts` → at least the
      definition plus the two guards.
- [ ] Only `scripts/generate-docs.ts` modified in `src`/scripts terms
      (`git status` shows no other source/script file changed).
- [ ] `plans/README.md` status row for 002 updated.

## STOP conditions

Stop and report back if:
- The drift check shows `scripts/generate-docs.ts` changed since `9f5bc98` and
  the excerpts no longer match.
- `pnpm generate:docs` fails for a reason unrelated to this change (e.g.
  missing `www/content/docs` — the generator reads MDX from there). Report the
  error; do not stub out inputs.

## Maintenance notes

- If the team later wants global sync automated for a specific person's machine,
  do it via their own shell/CI invoking `SYNC_GLOBAL_SKILL=1`, never by
  re-enabling it in `build`.
- Separately worth considering (out of scope here): `pnpm build` runs
  `generate:docs`, which mutates tracked repo files; in CI this can leave a
  dirty tree. Not addressed by this plan — flag only.
- Reviewer focus: confirm the repo-local writes were NOT wrapped in the guard
  (they must stay unconditional).
