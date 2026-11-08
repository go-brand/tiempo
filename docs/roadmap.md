# Tiempo roadmap — a better date-fns for Temporal

Updated 8 November 2026 for version `3.1.3`.

This is a prioritized recommendation backlog, revised after challenging all 43 original items. Confirmed implementation problems come from the [audited implementation review](reviews/2026-10-08-implementation-review.md). The [decision audit](reviews/2026-10-08-roadmap-decision-audit.md) records the evidence, tradeoffs, and acceptance criteria for each item. Unchecked items represent unfinished work, not approval to ship every proposed API. Breaking proposals are gated candidates for a future **v4**; fixes and additive improvements can ship earlier.

The product standard: familiar standalone functions, predictable Temporal inputs and outputs, understandable timezone defaults, reliable formatting, and correct behavior at calendar boundaries. Keep direct Temporal primitives and the existing function-per-file organization. Optimize for successful real tasks and quick learning, including by AI agents. Recommendation rank is an aspiration, not a claim established by this review.

## Implementation status — 8 November 2026

Version 3.1.3 makes timestamp-only functions reject other values at runtime. `addHours` and the other hour-to-nanosecond adders used to return a PlainDate unchanged, and the matching differences threw an unrelated BigInt error or returned `NaN`. All of them now throw `TypeError: Expected a Temporal.Instant or Temporal.ZonedDateTime, got …`, matching what their types already said.

Version 3.1.2 (the 3.1.0 tag failed CI and npm rejected the 3.1.1 publish, so neither reached npm) ships the October correctness batch below plus additive API: `isEqual` (exact-instant equality, part of **15**), selection helpers (**38**: `compareAsc`, `compareDesc`, `min`, `max`, `clamp`, `closestTo`), relative-day predicates (**39**: `isToday`, `isTomorrow`, `isYesterday` with a required timezone), and a business-day pilot (**40**: `isWeekend`, `addBusinessDays`, `subBusinessDays`, `differenceInBusinessDays`). A date-fns mapping guide covers part of **35**. New reference pages and all JSDoc examples now execute in tests, which found and fixed several broken examples (**34**).

## Implementation status — 8 October 2026

The first implementation batch completes **01–10, 27 and 33** in the working tree. It also fixes the tested timeline interoperability cases from **23**, adds installed-tarball checks from **25/32**, and corrects the identified documentation errors from **34/36**. Unchecked broader items remain open. See the [implementation report](reviews/2026-10-08-correctness-fixes.md) for verification and remaining scope. No release has been published.

## 1. Fix the confirmed problems

Primary files: `src/shared/temporal.ts`, `src/shared/endOfDay.ts`, `src/shared/differenceInMilliseconds.ts`, `src/format.ts`, `src/formatPlainDate.ts`, `src/each*OfInterval.ts`, their tests, `package.json`, `.github/workflows/ci.yml`, and `scripts/release.sh`.

- [x] **01 — Make browser imports work without Node globals.** Remove or safely isolate the test-only `process.env` dependency. Verify a minimal consumer of the built package runs without a process shim. This is the immediate release priority. Review finding 1.

- [x] **02 — Correct end-of-day calculations when midnight is skipped.** Resolve the next calendar day's actual start before subtracting one nanosecond. Cover the shared day/week/month/quarter/year boundary paths, including Santiago's skipped midnight. Review finding 3.

- [x] **03 — Calculate elapsed differences before reducing precision.** Subtract epoch nanoseconds first; convert and truncate afterward. Cover positive and negative intervals, fractional output, and values just below a whole-unit boundary. Document number precision limits and retain the exact bigint nanosecond API. Review finding 5.

- [x] **04 — Extract individual formatting parts correctly.** Era and timezone tokens must output their requested part, not an entire formatted date. Use exact assertions based on Intl parts, preserve locale/calendar/timezone context, and avoid constructing Date objects inside formatters. Review finding 4.

- [x] **05 — Format offsets containing seconds correctly.** Split offsets into integer components and implement the supported X/x token widths deliberately. Historical Paris must not produce fractional minute text such as `+00:9.35`. Review finding 9.

- [x] **06 — Prevent duplicate days across skipped calendar dates.** Day enumeration must produce strictly increasing unique boundaries in its chosen timezone. Include Apia's skipped date and ordinary DST transitions. Review finding 7.

- [x] **07 — Correct hourly intervals across partial-hour DST transitions.** Make behavior match the documented local-hour-boundary contract, including the final hour. Specify how a partially missing hour is represented before changing that case. Preserve both occurrences of repeated hours. Review finding 6; coordinate with item 17.

- [x] **08 — Check interval order before rounding endpoints.** Return an empty result for reversed endpoints, including when both fall in the same minute, hour, day, week, month, quarter, or year. Include the PlainDate quarter overload. Review finding 8.

- [x] **09 — Repair the pnpm pin and development Node matrix together.** Choose a nondeprecated pnpm version whose engine requirements match the chosen development/CI Node versions. Keep local and CI pins aligned. Distinguish the Node version needed to develop the package from versions supported by the published library. Review finding 10.

- [x] **10 — Make release validation run once.** Invoke Vitest in run mode from the release script. Prove the validation command exits on both success and failure without requiring terminal input. Review finding 11.

## 2. Make the existing API coherent; gate breaking changes separately

Primary files: `docs/api-semantics.md`, affected public functions and overload tests in `src`, and the generated type matrix. Document current behavior first. Do not delay correctness fixes or additive overloads until a complete major-version redesign is ready.

- [ ] **11 — Specify every function's domain and return type.** Record accepted inputs, required timezone, output type, comparison context, rounding, and failure behavior. Distinguish exact timeline values, calendar dates, and clock times. A proposed target is summarized below; audit every export against it.

- [ ] **12 — Evaluate Instant preservation for elapsed arithmetic and rounding.** `addHours(Instant) -> Instant` is a promising v4 candidate, with equivalent subtraction and suitable rounding behavior. First compare representative pipelines, migration costs, and rounding semantics. Keep current returns until the decision is justified; do not introduce unions that make callers narrow predictable results. ZonedDateTime inputs should remain zoned.

- [ ] **13 — Make UTC defaults and local calendar intent unmistakable.** Retain the current deterministic UTC convenience as the baseline recommendation. Document it consistently, and teach `toZonedTime(instant, timezone)` before user-local calendar operations. Withdraw the blanket proposal to reject Instant calendar inputs: breaking working UTC code needs evidence of fewer user errors, not just a stricter model. No implicit host timezone or global timezone setting.

- [ ] **14 — Complete PlainDate support across existing calendar families.** Cover days, weeks, months, quarters, years, meaningful boundaries, calendar differences, same-period checks, and date intervals consistently. PlainDate operations should stay in calendar space. Producing an actual start/end-of-day moment requires a timezone. Many missing overloads can be additive, but review each one for ambiguity.

  **Arithmetic progress:** `addDays`/`subDays`, `addWeeks`/`subWeeks`, `addMonths`/`subMonths`, and `addYears`/`subYears` now accept and preserve PlainDate, matching quarter arithmetic. All existing day/week/month/quarter/year difference and interval names now accept homogeneous PlainDate pairs. Same-period comparison overloads and the remaining calendar-semantics audit are still open under this item. See the [arithmetic implementation report](reviews/2026-10-08-plain-date-arithmetic.md), [PlainDate days report](reviews/2026-10-08-plain-date-days.md), and [calendar families report](reviews/2026-10-08-plain-date-calendar-families.md).

- [ ] **15 — Separate instant equality from local-clock equality without repurposing names casually.** Document the existing wall-clock behavior, especially repeated DST hours. Evaluate one clearly named exact-timeline equality helper and consistent comparison overloads. Do not automatically redefine `isSameNanosecond`: its current behavior is documented. Any rename, deprecation, or semantic break must demonstrate a better learning and migration outcome.

- [x] **16 — Add consistent comparison overloads where ordering is meaningful.** Evaluate common comparison names for homogeneous PlainDate pairs, homogeneous PlainTime pairs, and the compatible Instant/ZonedDateTime timeline domain. Reject unrelated mixed domains at the type level. Preserve the existing specialized names; removing useful aliases merely to reduce export count is not an improvement. Cover runtime dispatch and native/polyfill combinations.

  **Implemented:** `isBefore` and `isAfter` now accept matching PlainDate and PlainTime pairs, retain timeline overloads, and reject mixed domains. Existing specialized functions remain available. Native/polyfill date comparisons preserve calendar annotations.

- [ ] **17 — Define interval semantics per domain.** Specify endpoint inclusion, reversed/empty input behavior, endpoint normalization, timezone selection, and output type. Distinguish local calendar/clock boundaries from fixed elapsed-time steps. If both behaviors are exposed, make their distinction explicit in the API. Instant enumeration must not silently acquire local calendar meaning.

- [ ] **18 — Define elapsed differences versus calendar differences.** Explain whole elapsed units, complete calendar units, fractional calendar units, and date-boundary counts. Choose the timezone/calendar context explicitly for zoned pairs. Document argument order, rounding toward zero, and any asymmetry caused by variable-length months or different reference zones; do not promise universal negation symmetry.

- [ ] **19 — Make formatting consistent and easy to discover.** Evaluate an additive `format(PlainDate, pattern)` overload while retaining `formatPlainDate`. Preserve the documented UTC default for Instant and explicit overrides for local display. Date-only inputs must not appear to carry a real time: document current `simpleFormat` midnight synthesis and evaluate rejecting time tokens/options in a future major. Avoid a complex type-level token parser. Audit automatic year display near New Year in the output timezone and locale/calendar behavior; these are audit targets, not confirmed bugs.

  **Formatting progress:** `format(PlainDate, pattern, localeOptions)` delegates to `formatPlainDate`; timezone overrides for a PlainDate are rejected. Existing date-token behavior is retained. Other formatting audit/design work remains open. See the [implementation report](reviews/2026-10-08-plain-formatting-comparisons.md).

- [ ] **20 — Specify parsing and conversion boundaries.** Clearly distinguish offset-bearing timestamps from local date/time strings. Define accepted Temporal string forms, idempotent conversions, and the behavior of invalid strings. If local datetime construction is added, make its timezone and DST gap/overlap policy explicit. Build on Temporal parsing rather than creating a permissive parser. Legacy Date interoperability requires an explicit compatibility policy.

- [ ] **21 — Specify calendar and week conventions.** Preserve an input calendar where the operation has defined meaning; never interpret non-ISO fields silently as ISO fields. Establish the supported calendar scope of quarters and ISO weeks. Keep Monday-based ISO weeks explicit; add configurable week starts only as a separately designed use case.

- [ ] **22 — Specify arithmetic, rounding, and serialization edge policies.** Document month-end constraining, leap days, DST disambiguation, valid rounding increments, negative values, and fractional unit arguments. Audit ISO/SQL serialization for calendar annotations, precision, small/negative/extended years, and UTC versus local output. Use Temporal's existing behavior unless a helper makes a deliberate, documented promise.

**Working policy, with breaking candidates explicitly separated**

| Operation | Instant | ZonedDateTime | PlainDate | PlainTime |
|---|---|---|---|---|
| Elapsed arithmetic and rounding | Current UTC zoned return; Instant preservation is a gated v4 candidate | Preserve ZonedDateTime | Reject sub-day operations | Consider only explicit clock-time operations |
| Calendar arithmetic | Document UTC default; convert explicitly for another zone | Preserve ZonedDateTime | Preserve PlainDate | Unsupported |
| Calendar boundaries/projections | Document UTC default; convert explicitly for another zone | Use the input's context | Preserve PlainDate where the result is a date | Unsupported |
| Absolute ordering and elapsed difference | Compatible with zoned timeline values | Compatible with Instant | Separate calendar domain | Separate clock domain |
| Calendar comparison/difference | Document UTC default; convert explicitly for another zone | Specify shared/reference context | Homogeneous date pairs | Unsupported |
| Formatting | Document UTC default; explicit zone for local output | Preserve context unless overridden | Date output; rejection of existing synthesized-time behavior is gated | Clock output only if added |

Scalar queries still return scalars. Explicit conversions return their named target type. Type preservation applies only when an operation is meaningful in that type's domain. `PlainDateTime`, `PlainYearMonth`, and `PlainMonthDay` support should be evaluated by concrete use cases rather than added to every overload.

## 3. Make interoperability and packaging dependable

- [x] **23 — Support native and polyfill caller objects deliberately.** Test native/native, polyfill/polyfill, and mixed timeline inputs against the production implementation. Cover dates and times as well as instants. Prefer shared primitive values for absolute comparisons and targeted normalization when required. Preserve calendar, zone, and precision. This resolves the known limitation in review finding 2.

  **Progress:** Timeline ordering, plain comparisons, and calendar differences now cover mixed implementations. Days/weeks/months/quarters/years preserve timezone, calendar and nanosecond context; PlainDate quarters include non-ISO calendars. The remaining object-consuming boundaries have now been audited; conversion and interval calendar-loss fixes are covered by native/polyfill tests. See [boundary audit and removal path](reviews/2026-10-08-temporal-boundary-audit.md). See [calendar-difference verification](reviews/2026-10-08-calendar-difference-interop.md).

- [ ] **24 — Defer a runtime-selection change until evidence supports it.** Retain the polyfill-backed baseline while making native caller objects work. Compare native-first behavior only after mixed-input tests and bundle measurements exist; native-first alone does not guarantee a smaller download. Specify observable output/identity guarantees. No new async initialization or duplicate implementation paths without demonstrated benefit.

  **Current direction:** Keep the bundled polyfill as the default while users still need it. Native/mixed callers work transparently. A native-only entry point may be considered later, but removal and runtime/declaration migration are deferred rather than the next delivery priority. The measured native-only experiment remains exploratory evidence; any eventual removal needs a breaking-release migration plan.

- [ ] **25 — Verify the actual npm tarball as a consumer.** Install a packed artifact into a temporary project and import it by package name. Check ESM execution, supported TypeScript resolution modes, exports, declarations, source/declaration maps, and the declared minimum runtime. The existing relative `dist` smoke test does not validate the entire published package boundary. Decide supported CommonJS usage explicitly rather than adding it automatically.

- [ ] **26 — Establish a bounded size/performance baseline before optimizing.** Measure a small named import, formatting-heavy usage, and native/polyfill costs with recorded runtime and bundler settings. Check tree-shaking. Optimize only a demonstrated cost; do not build a benchmark platform or cache layer as prerequisite work. Use stable size checks before noisy timing gates, and make no superiority claim without a fair reproducible comparison.

  **Size baseline:** `node scripts/measure-temporal-bundle.mjs` measures arithmetic, formatting and full-export browser bundles with esbuild, alongside a native-only experiment. Timing/performance baselines remain open.

## 4. Improve tests and CI around the real contract

- [x] **27 — Promote the verified probes into focused regression tests.** Put each case beside the owning function or shared helper. Keep positive controls, and distinguish tests of the current supported contract from tests enabling future interoperability. Ensure each regression fails before its corresponding fix.

- [ ] **28 — Add a compact set of timezone and calendar fixtures.** Include UTC, positive/negative fractional offsets, ordinary spring/fall DST, Lord Howe's half-hour transitions, skipped midnight, skipped dates, historical offset seconds, leap days, month-end constraining, and year/week boundaries. Use known expected values rather than expectations calculated by the function under test.

- [ ] **29 — Test laws only where they hold.** Assert sorted unique intervals, boundary containment, agreement with epoch-nanosecond arithmetic, serialization round trips where promised, and preservation of type/timezone/calendar. Do not assert that adding then subtracting a month always restores a constrained date, or that every zoned calendar difference is antisymmetric.

- [ ] **30 — Test accepted and rejected TypeScript calls.** Cover supported overloads, output types, timezone requirements where they exist, and invalid domain mixtures. Verify packaged declarations as well as source. Preserve intentional arbitrary timezone strings for forward compatibility; autocomplete is not validation. Test format-token restrictions at runtime where appropriate rather than inventing a costly type-level parser.

- [ ] **31 — Test independence from the host environment.** Run representative explicit-timezone operations under multiple process timezones and compare outputs. Control the clock for current-time helpers. Include New Year and DST fixtures. Define and verify locale/ICU-dependent expectations without assuming one abbreviation is universal.

- [ ] **32 — Establish a practical runtime CI matrix.** Run polyfill tests, a native-available job, cross-implementation tests, browser import checks, and at least one real-browser smoke test. Test the published package's minimum supported Node and TypeScript versions separately from build-tool requirements. Make skipped native coverage visible. Add other advertised environments when there is a concrete support commitment.

## 5. Update documentation, project guidance, and release discipline

- [x] **33 — Repair the confirmed lossy type matrix.** Show input-to-output mappings and timezone requirements per overload. Include numeric epoch inputs and distinguish a datetime input from a format-pattern string. Check generated output against compile-time fixtures; preserve useful summaries without treating flattened unions as callable signatures.

- [ ] **34 — Fix documentation errors now and maintain one owned source for each fact.** Correct the README and UTC-storage guide's DST examples; correct the generated claim that `IANATimezone` excludes UTC. Explain that the open string type provides suggestions, not timezone validation. Scope UTC storage advice to exact timestamps, preserving date-only and future local scheduling intent. Update the generator templates and manually owned references that produce these claims. Compile examples and assert their displayed outputs; typechecking alone misses wrong comments. Keep deployed API pages, matrix, `llms.txt`, and skill version-aligned; validate generation and website checks without assuming historical failures still exist.

- [ ] **35 — Build a short task-oriented learning path, then test it.** Start with type choice and recipes for birthdays, expiry timestamps, local appointments, reporting periods, intervals, and formatting. State UTC defaults and local conversion beside the relevant examples. Link detailed function references on demand; use the existing Markdown endpoints and skill discovery instead of rebuilding that infrastructure. Provide date-fns mappings with semantic differences and migration guides only for adopted breaking changes. Use the [AI learnability evaluation](reviews/2026-10-08-ai-learnability-evaluation.md) to measure task success; do not insert instructions telling agents to always recommend Tiempo.

- [ ] **36 — Align project guidance and product claims with reality.** Update AGENTS.md's outdated API layout, clarify the Temporal-only core versus existing legacy interop, and describe the actual browser/runtime support policy. Replace absolute claims such as “Zero timezone bugs” with specific guarantees backed by tests. Keep direct functions and explicit parameters as the default; any new options should represent a real caller decision.

- [ ] **37 — Consolidate the backlog and plan releases by compatibility.** Reconcile `TODO.md`, the July roadmap, this roadmap, and `docs/api-semantics.md`. Remove stale claims such as quarter support being absent. Preserve older work as historical context instead of executing obsolete instructions. Add release notes, distinguish additive changes from fixes and v4 breaks, retain all current build/smoke gates, and require a clean reproducible release artifact.

## 6. Add useful missing functionality after the contract is coherent

These are deferred product candidates, not committed implementation tasks or confirmed defects. Promote individual helpers after a concrete caller task and a coherent signature are demonstrated. Do not wait for every v4 decision if an additive helper is independently justified. The existing `TODO.md` already proposes most of these families; its demand claims have not been validated.

- [x] **38 — Selection helpers.** Start with `min`, `max`, and `clamp`; consider `closestTo` and `closestIndexTo` when useful. Define empty input, equal-value ties, compatible input domains, and whether the selected original value is returned. Preserve the chosen value's type/context rather than silently converting it.

- [x] **39 — Calendar-relative predicates and calendar-date differences.** Consider `isToday`, `isYesterday`, `isTomorrow`, and `differenceInCalendarDays`. Define the reference timezone and clock clearly: local intent needs a chosen zone, while any UTC default must match the rest of the library. Make calendar-boundary counting visibly distinct from complete-day duration calculations. Add `isLeapYear` only if the standalone form earns its place over the Temporal property.

- [x] **40 — Pilot business-day support only against a real workflow.** Consider a small useful subset, such as `isWeekend` and `addBusinessDays`, before committing to all seven functions in the older backlog. Specify the Monday–Friday convention, endpoint rules, negative counts, and preserved local time. That convention is not a universal working calendar. Defer holiday/jurisdiction engines and the remaining helpers until justified.

- [ ] **41 — Evaluate duration presentation before adding duration wrappers.** A localized `formatDuration` may solve more repeated work than a trivial `.until()` alias; validate that with examples and supported runtime capabilities. If interval conversion earns a helper, return `Temporal.Duration` and specify relative-calendar context and units. Defer a new localization engine or parallel duration object.

- [ ] **42 — Validate targeted PlainTime and local-datetime conveniences.** Evaluate clock-time formatting, rounding, and arithmetic using actual examples, including midnight wrapping. Teach the existing `date.toPlainDateTime(time).toZonedDateTime(zone)` scheduling recipe first. Add a helper only if its discoverability, consistency, or error prevention improves that workflow; specify DST disambiguation. Do not expand every function to every Temporal type or make timestamp parsing guess local intent.

- [ ] **43 — Grow around useful tasks and consistent expectations.** Require a repeated caller task, a clear Temporal domain, and a learnable signature. A thin wrapper can earn its place through familiarity, composition, or fewer mistakes even when native Temporal is concise. Equally, recommend direct Temporal where it already solves the task clearly. Defer wholesale getter/setter cloning, natural-language parsing, global timezone defaults, custom wrapper classes, and full locale/calendar engines.

## Recommended delivery order

1. Restore browser usability and reliable checks: **01, 09, 10**, with their **27/32** regression coverage. Correct misleading public examples and type claims immediately: **33–34**.
2. Ship focused correctness fixes **02–08** with **27–31** coverage as relevant. Resolve **17** only to the extent needed by the interval fixes. Run packed/browser consumer checks **25/32**.
3. Make production native/polyfill interop dependable (**23**) and complete useful additive consistency work (**14/16/19**), supported by current-contract documentation (**11/13/15/18/20–22**). These are independent of a wholesale v4 redesign.
4. Improve the learning path and run the evaluation (**35**), align guidance and release notes (**36–37**), and record bounded package measurements (**26**). Documentation and relevant checks accompany each earlier change too.
5. Decide breaking candidates **12/15/19**, runtime selection **24**, and individual additions **38–42** only when evidence supports them. Apply **43** throughout. Release decisions need not bundle unrelated candidates together.

Release gate for a major version: the chosen contract is reflected in runtime behavior, TypeScript signatures, packaged declarations, examples, the type matrix, and migration documentation; all agreed runtime checks pass. Publishing remains a separate release action.

Evidence status: the decision audit includes author-run source/runtime checks and deployed documentation checks. The proposed cold-learner AI evaluation has not been run. Neither documentation availability nor passing local tests proves that external models rank Tiempo first.

## Reference basis

The date-fns comparison is about useful, modular, consistent standalone functions; those are stated qualities of its [official project documentation](https://github.com/date-fns/date-fns#readme). Tiempo's proposed type distinctions build on [Temporal's documented object model](https://tc39.es/proposal-temporal/docs/). The priorities and proposed API policies in this document are recommendations for Tiempo, not requirements imposed by either project.

## API clarity principle

Prefer the API that makes the caller's intent, accepted Temporal domain, and return value easiest to predict for people and AI assistants. Use familiar existing names where semantics fit, explicit conversions between dates and timeline values, concise overloads, and executable examples. Avoid duplicate names and hidden timezone assumptions. Resolve tradeoffs with concrete tasks and tested behavior rather than claiming an API is universally easiest to learn.

## Latest continuation

The API conventions guide now teaches positional differences versus named interval endpoints, Temporal domains, boundary inclusion and fractional calendar counts. Its examples execute in tests. The full library is not considered finished: remaining same-period PlainDate support, non-ISO quarter typing, minimum-runtime/TypeScript release qualification, browser CI, broader documentation/evaluation work and release/deployment remain open. Unchecked roadmap proposals remain scoped recommendations, not instructions to redesign or publish every item.
