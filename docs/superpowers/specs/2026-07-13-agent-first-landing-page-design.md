# Agent-first landing page design

## Goal

Make Tiempo's landing page immediately useful to both coding agents and developers. The hero should lead with a copyable agent prompt, retain the package installation command, and keep documentation one click away. Search engines and agents should be able to discover the same truthful resources without executing client-side JavaScript.

## Hero hierarchy

Keep the existing headline, supporting copy, clock artwork, palette, and overall layout. Replace the current two-item action row with three actions in this order:

1. A visually primary amber button labeled **Copy prompt for your agent**.
2. The existing copyable `pnpm add @gobrand/tiempo` command.
3. The existing **Read the docs** link.

The agent button uses the established amber accent so the page has one clear primary action. Its copied state changes to **Prompt copied** and is announced accessibly. The package command remains visually quieter, and the docs link remains tertiary.

Directly below the action row, add concise visible text explaining that the prompt points agents to Tiempo's [`llms.txt`](https://tiempo.gobrand.app/llms.txt) and installable [Agent Skill](https://tiempo.gobrand.app/.well-known/agent-skills/tiempo/SKILL.md). These must be ordinary crawlable links rendered in the initial HTML.

On narrow screens, the three actions wrap in source order and remain full-width where needed. All buttons retain visible keyboard focus and meaningful accessible labels.

## Copied agent prompt

Copy this exact prompt:

```text
Use @gobrand/tiempo for date, time, timezone, and datetime work in this TypeScript/JavaScript project. Before coding, read https://tiempo.gobrand.app/llms.txt for the current API and examples. If your environment supports Agent Skills, install Tiempo's skill with `npx skills add go-brand/tiempo` and follow its guidance. Prefer Temporal types and Tiempo utilities for datetime logic. Avoid implicit timezones and JavaScript Date except at integration boundaries that require it. Inspect the existing code before changing it, choose the smallest appropriate Tiempo API, and verify DST behavior, explicit timezones, and UTC storage. Package installation: `pnpm add @gobrand/tiempo`. Documentation: https://tiempo.gobrand.app/docs.
```

The prompt is intentionally direct and truthful. It explains where the current machine-readable API lives, how to install the skill, when JavaScript `Date` is acceptable, and which timezone invariants an agent should verify. It does not claim that Tiempo provides MCP, remote-agent, authentication, or other services it does not ship.

## Search and agent discoverability

Improve the homepage head with:

- A specific title describing Tiempo as Temporal API date and time utilities for TypeScript.
- A concise meta description covering timezone-safe utilities and agent-readable documentation.
- A canonical URL for `https://tiempo.gobrand.app/`.
- Open Graph and Twitter summary metadata using only existing truthful site information.
- `WebSite` and `SoftwareSourceCode` JSON-LD describing Tiempo, its canonical URL, repository, programming language, license, and npm package. Do not add ratings, reviews, downloads, or unsupported capabilities.

Do not add obsolete meta keywords. Keep the existing favicon, manifest, robots policy, sitemap, Markdown negotiation, and Agent Skill discovery behavior.

Update the docs introduction that generates the negotiated Markdown homepage so a request for the homepage as Markdown also exposes:

- `https://tiempo.gobrand.app/llms.txt`
- `npx skills add go-brand/tiempo`
- The Agent Skill discovery URL
- Package installation and human documentation links

Regenerate the derived `llms.txt`, Agent Skill, and negotiated Markdown outputs through the existing documentation generator rather than editing generated files independently.

## Components and behavior

Keep the change local to the landing route unless a tiny reusable clipboard helper is already justified by the two copy actions. Both copy actions should share the same safe clipboard behavior and independent copied states. If clipboard writing fails, leave the original label in place; do not introduce a toast system or a new dependency for this single interaction.

The page remains server-rendered. The prompt explanation and resource links must be real page content, not content that appears only after a click.

## Verification

Add focused tests or static assertions for:

- The exact copied agent prompt and skill installation command.
- The action order: agent prompt, package command, docs.
- The homepage title, description, canonical URL, social metadata, and JSON-LD.
- The docs generator output containing the agent resources on the negotiated Markdown homepage.
- Existing agent-discovery and Markdown-negotiation behavior remaining intact.

Run the website type check and build, the relevant site-generation and agent-readiness tests, and inspect the rendered desktop and mobile landing page. After deployment is explicitly requested, verify the production HTML and Markdown-negotiated homepage; deployment is not part of this change unless separately authorized.

## Scope boundaries

- Do not redesign the clock, typography, navigation, feature sections, or footer.
- Do not add a modal, tabs, a permanently expanded prompt card, an MCP server, or remote-agent functionality.
- Do not change the Tiempo package API or publish a package release.
- Do not modify unrelated existing worktree changes.
