# tiempo

date-fns-style functions for the Temporal API, published as `@gobrand/tiempo`. TypeScript, Vitest, tsup. The library uses Temporal only: no `Date` (except the `toDate`/`Date`-input interop boundary), no date-fns, no moment.

## Layout

- `src/<name>.ts` — one public function per file, with `src/<name>.test.ts` beside it. `src/index.ts` exports them all.
- `src/shared/` — internal helpers. `temporal.ts` is the only place `Temporal` is imported from; `compare.ts` owns ordering and domain checks; `normalizeTemporalInput.ts` turns an Instant into a UTC ZonedDateTime.
- `www/content/docs/<category>/<slug>.mdx` — the API reference, hand-written. Category order lives in `www/content/docs/meta.json` and both generators in `scripts/`.
- Generated, never edit by hand: `www/content/docs/type-matrix.mdx`, `www/public/llms.txt`, `www/public/.well-known/**`, `skills/tiempo/SKILL.md`, and `skills/tiempo/references/**` except `best-practices/`. Change `scripts/generate-docs.ts` or the MDX instead.

## API rules

Every function follows these, so agents and people can predict it:

- Instant inputs are read in UTC; datetime results are UTC ZonedDateTimes. ZonedDateTime inputs keep their timezone. PlainDate inputs stay dates.
- PlainDate, PlainTime, and timeline values (Instant/ZonedDateTime) are separate domains. Mixing them is rejected by overloads and throws a `TypeError` at runtime (`shared/compare.ts`).
- Differences take `(laterDate, earlierDate)`. Intervals take `{ start, end }`. Anything that depends on "today" takes an explicit timezone.
- Selection functions (`min`, `max`, `clamp`, `closestTo`) return the value they were given, unconverted.
- Caller objects may come from native Temporal or the polyfill. Use the `is*` guards from `shared/temporal.ts`, never `instanceof`; bridge PlainDates across implementations with `toString()`.

## Adding a function

1. `src/<name>.ts` with JSDoc whose examples run and end lines with `// result`.
2. `src/<name>.test.ts`; include `@ts-expect-error` cases for rejected domains.
3. Export it from `src/index.ts`.
4. `www/content/docs/<category>/<slug>.mdx` plus its `meta.json` entry. Give every example block its own import so it runs alone, and add the page to `EXECUTABLE_PAGES` in `scripts/reference-examples.test.ts`.
5. `pnpm build` regenerates the type matrix, llms.txt, and the skill.

## Commands

- `pnpm test --run` — runs every test against the polyfill, and against native Temporal on Node 26+.
- `pnpm typecheck`, `pnpm build`, `pnpm smoke:tarball` (installs the packed package into a scratch project).
- `pnpm release <patch|minor|major>` — needs a clean tree on `main`; tests, builds, bumps, tags, and pushes. CI publishes to npm on the tag through npm trusted publishing (GitHub OIDC, no npm token; setup in `PUBLISHING.md`).
- Website: `cd www && pnpm deploy` (Cloudflare Workers).

## Style

- Rob Pike's principles: simple, clear, direct. No speculative abstractions or configuration objects; parameters are explicit.
- Signatures say what they take and return. Trust Temporal primitives; don't guard impossible states.
- Code and docs should read plainly. No marketing claims in docs; state what is guaranteed and tested.
- Formatting follows `.oxfmtrc.json` (single quotes, no trailing commas). Run `pnpm format`; CI runs `pnpm format:check`. The website, skills, docs, and generated files are not formatted.
