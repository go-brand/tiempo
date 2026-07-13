# Agent-Ready Tiempo Website Design

## Goal

Make `https://tiempo.gobrand.app` the canonical Tiempo documentation site and expose every agent-readiness feature that accurately represents a static TypeScript library documentation site.

## Scope

Tiempo will support content discovery, machine-readable documentation, Markdown delivery, explicit crawler policy, and its existing Agent Skill. It will not advertise protocols for capabilities it does not provide.

Included:

- A Cloudflare Worker custom domain at `tiempo.gobrand.app`.
- Removal of the legacy engineering-host Worker routes.
- Replacement of every legacy Tiempo website URL in repository metadata, source documentation, generated documentation, examples, and public resources.
- Root-level `robots.txt`, `sitemap.xml`, and `llms.txt` resources.
- HTTP `Link` discovery headers for the sitemap, `llms.txt`, and Agent Skills index.
- Markdown content negotiation for documentation pages when the request prefers `text/markdown`, including `Vary: Accept`.
- A `/.well-known/agent-skills/index.json` discovery document.
- Public access to Tiempo's generated `SKILL.md` and its generated reference files.
- Live verification with the Cloudflare agent-readiness scanner after deployment.

Excluded:

- DNS-AID because Tiempo does not expose a network agent or agent service.
- MCP and A2A server cards because Tiempo has no remote agent tools.
- OAuth, protected-resource metadata, or `auth.md` because the documentation site is public and has no delegated authorization flow.
- WebMCP because the site has no browser actions for agents to invoke.
- x402, MPP, UCP, or ACP because the site has no agentic commerce surface.

## Architecture

The existing `tiempo-docs` Worker becomes the origin for the `tiempo.gobrand.app` custom domain. The application base path changes to `/`, and generated documentation URLs use the new canonical origin. This is a clean cutover: the legacy hostname and path are not preserved as a mirror or redirect.

A small Worker entry point handles representation-level concerns before delegating ordinary HTML requests to TanStack Start:

1. Root discovery endpoints return deterministic generated or static resources with explicit content types.
2. Documentation requests preferring `text/markdown` return the corresponding source-derived Markdown representation and add `Vary: Accept`.
3. Ordinary requests continue through the existing TanStack Start server entry.
4. Successful public responses include discovery `Link` headers without replacing existing headers.

The Wrangler configuration remains the routing source of truth. It declares only `tiempo.gobrand.app` as a Custom Domain and removes the two legacy route patterns.

## Generated Content

Documentation remains source-driven. The existing docs generator will use one canonical base URL and continue producing `www/public/llms.txt`, `skills/tiempo/SKILL.md`, and skill references. A website packaging step copies the generated skill and references into a public `/.well-known/agent-skills/tiempo/` tree and generates its index.

The sitemap is generated from the same documentation inventory used by the website. It must not rely on a hand-maintained duplicate route list.

Markdown negotiation must serve content derived from the MDX documentation source, not HTML converted by brittle string manipulation. Pages without a meaningful Markdown representation may continue returning HTML.

## Crawler Policy

`robots.txt` allows public crawling, points to the canonical sitemap, and states explicit Content Signals. Tiempo permits search and agent inference/grounding. It declines model training unless the repository owner later chooses otherwise. The policy must remain human-readable and must not claim technical enforcement beyond the declared signals.

## Testing and Verification

Automated tests will cover:

- Absence of legacy website references in maintained source and generated output.
- Discovery endpoint status, content type, and canonical URLs.
- Agent Skills index validity and referenced-resource availability.
- `Accept` negotiation, quality values, fallback behavior, and `Vary: Accept`.
- Additive `Link` response headers.
- Generated sitemap coverage for representative documentation routes.

Before deployment, the library tests, website typecheck, website build, and Wrangler dry run must pass. After deployment, live HTTP checks must verify the custom-domain certificate, removal of the legacy routes, discovery files, headers, Markdown negotiation, and Agent Skill resources. The Cloudflare scanner will then run in Content Site mode, followed by a customized Agent Skills check. Any remaining failure will be fixed only when the corresponding feature is truthful and useful for Tiempo.

## Success Criteria

- `https://tiempo.gobrand.app/` is the canonical, reachable documentation site.
- The deployed Worker no longer owns the legacy routes.
- Maintained source, generated output, package metadata, and public documentation contain no legacy Tiempo website URLs.
- All included discovery and Markdown behaviors work on the live hostname.
- Cloudflare's Content Site scan passes every applicable check except DNS-AID if the scanner treats that non-applicable protocol as a failure.
- The Agent Skills custom check discovers and validates Tiempo's published skill.
- No unsupported API, authentication, agent-service, browser-action, or commerce capability is advertised merely to increase a score.
