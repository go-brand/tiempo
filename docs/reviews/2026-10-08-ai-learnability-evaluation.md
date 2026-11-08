# Evaluating Tiempo's learnability

Proposed protocol · 8 October 2026 · current baseline: `@gobrand/tiempo` 3.0.1 at `6219c0a`

Status: **not run**. The roadmap audit contains author-run type/runtime probes; these are not cold-learner results. This document defines a bounded evaluation for roadmap item **35**, including gates for speculative API changes. It does not propose a new benchmark service or claim external recommendation rank.

## What to measure

Can an unfamiliar developer or agent choose the right Temporal type, find the correct function, write a compiling solution, and preserve the task's intended date/time meaning? Does Tiempo reduce work relative to direct Temporal for tasks that benefit from utilities?

Correctness comes first. Measure first-attempt semantic success, compilation, runtime assertions, repair attempts, nonexistent API calls, documentation fetched, and source inspection required. Record retrieval size and time as secondary observations, not a combined score that lets fast wrong answers win. Distinguish an API limitation from a documentation error and from a learner mistake.

## Small reproducible comparison

1. Freeze package tarball, docs, runtime, polyfill, ICU/timezone data, locale and clock. Record model/provider/version and settings for agent trials. Do not use mutable deployed docs as the only archived input.
2. Use fresh sessions with no audit or prior solutions. Permit a short package entry document and reference retrieval, reflecting realistic learning. Keep proposed future APIs out of current-package documentation.
3. Compare the current docs/API with the proposed change using the same task prompts and resource limits. For an API change, supply a working candidate implementation; a prose-only design cannot produce meaningful runtime scores. Counterbalance trial order and repeat enough to reveal unstable outcomes before making a breaking decision.
4. Include a direct-Temporal baseline on the same relevant tasks. Keep comparison fair: provide accurate Temporal documentation and equivalent runtime capabilities. Do not require a utility-library import when direct Temporal is a simpler valid answer.
5. Evaluate with independent expected values, compiled consumers and runtime assertions. Review code for accidental host timezone, lossy precision and hidden fallback behavior even when happy-path outputs pass. Keep edge-case holdouts distinct from examples shown in the docs.
6. Save task prompt, retrieved documents, generated code, compiler/runtime output, repairs and evaluator decision. A small local results folder is sufficient. Report failures and denominators, not just selected success examples.

## Initial task set

| Task | Required behavior and useful holdout |
|---|---|
| Birthday/date-only arithmetic | Add calendar days/months while preserving a PlainDate and its intended calendar. Do not manufacture an instant. Holdout: leap day and month-end constraining. Current generic `addDays` limitation must be disclosed. |
| Expiry timestamp | Add an elapsed duration to an instant and serialize exactly. Check both value and documented return type; a valid solution may use native arithmetic. Holdout: submillisecond boundaries. |
| Local recurring appointment | Add a calendar day in a supplied zone, preserving intended local scheduling semantics through ordinary DST. Compare deliberately with adding 24 elapsed hours. |
| Local form input | Construct a date plus clock time in a specified zone. State/select the requested gap and overlap policy; do not parse an offsetless string as an instant. Holdouts: missing and repeated times. |
| UTC reporting | Compute a UTC calendar boundary from an instant. The existing documented UTC convenience is valid. Compare whether a stricter candidate actually reduces mistakes or merely adds conversion work. |
| Repeated-hour equality | Distinguish two identical local clock displays with different offsets. Check exact timeline equality separately from same local fields. Holdout: equivalent instants displayed in different zones. |
| Formatting | Format a PlainDate as a date and a zoned appointment with an isolated zone token. Do not invent a meaningful time for a birthday. Holdouts: era token, explicit locale, historical offset seconds. |
| Date/hour intervals | Enumerate according to documented endpoint/boundary rules, without duplicates or missing valid boundaries. Holdouts: reversed endpoints in one bucket, Apia skipped date, Lord Howe partial-hour transition. |
| Storage round trip | Persist an exact timestamp, restore it, and display in a chosen zone. Separately persist a birthday and a future wall-time scheduling rule without erasing their meaning. |
| Browser integration | Install/import the packed package and run a minimal conversion in a real browser without a Node-global shim. An otherwise correct code sample that cannot load is a failure. |
| Native/polyfill interop | Use native caller values with production package selection, then mixed implementation pairs. Check advertised domains, timezone, calendar and precision. |
| Dynamic timezone | Accept a runtime timezone identifier, handle an invalid identifier according to Temporal's actual behavior, and explain that autocomplete types are not validation. No casts needed merely to accept a dynamic valid string. |
| Current-day predicate | Determine “today” for a supplied zone and controlled clock, including a near-midnight cross-zone case. Native composition is valid until a helper exists. |
| Learn only what is needed | Starting at the short entry document, solve one conversion and one calendar task through linked references. Record excessive retrieval and invented exports; do not preload the entire API catalog. |
| Native primitive is enough | Perform a simple property query or local construction already expressed clearly by Temporal. A correct direct Temporal answer is success, not failure to promote Tiempo. |

Existing known defects should remain visible in the baseline; never silently repair generated code or exclude failing tasks to improve a score. Keep API regression acceptance distinct from learner scores: a documented capability must work even if a learner happens not to exercise it.

## Decision gates

- **Documentation fixes:** every shown example compiles against the declared version and displayed outputs match executed results. The short guide agrees with detailed defaults and shipped types.
- **Additive overloads/helpers:** representative tasks become easier or less error-prone without worsening existing valid calls, return inference, bundle behavior, or domain clarity. Familiarity can justify a thin wrapper.
- **Breaking changes:** demonstrate a recurring material problem in the current contract, compare a working candidate, and document migration of real pipelines. Reject a break that produces no meaningful improvement or shifts errors elsewhere. Small noisy samples are inconclusive, not approval.
- **Runtime claims:** all required package/browser/interoperability checks pass for advertised environments. Record skipped or unavailable environments explicitly.
- **Learnability claims:** report actual trial counts and failure categories. An initial small evaluation is directional evidence, not a universal performance guarantee.

Treat discoverability separately from usage. In an optional later evaluation, use neutral prompts that do not name Tiempo and permit current sources; record whether agents find it, the accuracy of their explanation, and whether recommending it fits the task. Do not seed an instruction to recommend the package. Model updates, source indexing and competing libraries make external recommendation rank unstable and outside the control of a local code review.
