# PlainDate day differences and intervals

User-approved scope: add PlainDate support to the existing `differenceInDays` and `eachDayOfInterval` names. Prioritize clear, consistent APIs for people and AI callers. No new function names, automatic parsing, timezone synthesis, or public configuration.

## Contract

- `differenceInDays(laterDate, earlierDate, options?)` accepts either two PlainDates or the existing Instant/ZonedDateTime pair. PlainDate results are signed whole calendar days; `{ fractional: true }` has no effect because dates have no clock component. Retain the shared options shape for consistency with the difference family. Temporal's matching-calendar requirement applies, as it does for existing calendar differences.
- `eachDayOfInterval({ start, end })` accepts two PlainDates and returns PlainDate[]. It includes both endpoints, returns one value for equal dates and an empty array for reversed dates, and uses the start calendar. Every date is included; no timezone exists to skip dates for DST or political changes.
- Mixed PlainDate/timeline pairs are rejected at compile time and runtime. Callers explicitly project timestamps with `toPlainDate` if they want date-only operations.
- Preserve existing timeline signatures, UTC defaults, return types and behavior. Place the new date overload before the existing timeline overload to preserve TypeScript utility-type extraction.
- Support native, polyfill and mixed implementations; bridge PlainDate.until with a canonical string. Do not mutate inputs or advance past the maximum supported end date.

## Choices

Extending existing names is consistent with PlainDate arithmetic and quarter helpers. Adding separate date-only names would require learning duplicate operations; converting dates to midnight would invent timezone semantics. Shared difference options remain accepted rather than making generic callers strip an otherwise harmless fractional option.

## Implementation and verification plan

1. Write runtime/type regressions and verify failures before implementation.
2. Add explicit overloads and narrow domain checks. Delegate date differences to Temporal; enumerate date offsets through the inclusive day count in the start calendar.
3. Verify leap days, equal/reversed bounds, maximum date, non-ISO calendars, mixed implementations, domain errors and unchanged timeline inference/behavior.
4. Extend packed-consumer checks and update both owning MDX pages, generated references, API semantics and roadmap.
5. Run typecheck, focused/full tests, build, installed-package checks and website checks. Keep bundled polyfill and current runtime support. No release or deployment.

Self-review: scope is restricted to the two approved functions; return types and inclusive/reversed behavior are explicit; no placeholders or unresolved API decisions. Existing approval authorizes implementation without a further approval round.
