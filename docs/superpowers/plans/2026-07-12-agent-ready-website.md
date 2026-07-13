# Agent-Ready Tiempo Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move Tiempo's documentation to `https://tiempo.gobrand.app` and publish the truthful discovery, Markdown, crawler-policy, and Agent Skill surfaces appropriate for a public TypeScript library.

**Architecture:** The existing TanStack Start application moves from the `/tiempo` base path to the root of a Cloudflare Worker Custom Domain. Build-time generation creates all machine-readable files from the existing MDX and Agent Skill sources. A custom server entry handles Markdown negotiation and additive discovery headers before delegating HTML requests to TanStack Start.

**Tech Stack:** TypeScript, Vitest, TanStack Start 1.157.1, Vite 7, Cloudflare Workers, Wrangler 4.

## Global Constraints

- Use `https://tiempo.gobrand.app` as the only Tiempo website origin in maintained source and generated output.
- Remove the legacy Worker routes; do not preserve a mirror or redirect.
- Keep MDX under `www/content/docs` as the documentation source of truth.
- Keep the API surface and runtime library code unchanged.
- Do not advertise DNS-AID, MCP, A2A, OAuth, WebMCP, or commerce capabilities.
- Preserve the user's existing untracked `AGENTS.md` and maintainer roadmap except for replacing stale website URLs required by this cutover.

---

### Task 1: Canonical root-host cutover

**Files:**
- Modify: `package.json`
- Modify: `README.md`
- Modify: `CLAUDE.md`
- Modify: `AGENTS.md`
- Modify: `docs/superpowers/specs/2026-07-12-agent-ready-website-design.md`
- Modify: `docs/superpowers/plans/2026-07-10-tiempo-core-maintainer-roadmap.md`
- Modify: `www/vite.config.ts`
- Modify: `www/src/router.tsx`
- Modify: `www/src/routes/__root.tsx`
- Modify: `www/public/site.webmanifest`
- Modify: `www/wrangler.jsonc`
- Delete: `www/scripts/restructure-assets.js`
- Modify: `www/package.json`

**Interfaces:**
- Consumes: the existing root-relative TanStack routes and Cloudflare Vite build output.
- Produces: a root-mounted site whose only deployment route is the `tiempo.gobrand.app` Custom Domain.

- [ ] **Step 1: Capture the failing legacy-reference and base-path checks**

Run:

```bash
LEGACY_ORIGIN='https://eng.gobrand.app'
LEGACY_SITE="${LEGACY_ORIGIN}/tiempo"
rg -n "$LEGACY_SITE" package.json README.md CLAUDE.md AGENTS.md docs www \
  --glob '!www/node_modules/**' --glob '!www/dist/**'
rg -n "'/tiempo|\"/tiempo" \
  www/vite.config.ts www/src/router.tsx www/src/routes/__root.tsx \
  www/public/site.webmanifest www/wrangler.jsonc www/package.json
```

Expected: FAIL condition demonstrated by matches in package metadata, docs, generated output, application base paths, and Wrangler routes.

- [ ] **Step 2: Change the application to root-relative paths**

Apply these exact semantic changes:

```ts
// www/vite.config.ts
export default defineConfig({
  base: '/',
  // existing server and plugins remain unchanged
});

// www/src/router.tsx
return createTanStackRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultNotFoundComponent: NotFound,
});
```

In `www/src/routes/__root.tsx`, make favicon, manifest, and search paths root-relative. In `www/public/site.webmanifest`, make `start_url` and icon paths root-relative.

- [ ] **Step 3: Make Wrangler own the dedicated hostname**

Replace the route configuration with:

```jsonc
"compatibility_date": "2026-07-12",
"assets": {
  "directory": "dist/client",
  "binding": "ASSETS",
  "run_worker_first": ["/", "/docs", "/docs/*"]
},
"routes": [
  {
    "pattern": "tiempo.gobrand.app",
    "custom_domain": true
  }
]
```

Remove `www/scripts/restructure-assets.js` and change `www/package.json` so `build` is exactly `vite build`.

- [ ] **Step 4: Replace canonical website references**

Use `https://tiempo.gobrand.app` in `package.json`, `README.md`, `CLAUDE.md`, `AGENTS.md`, the approved spec, the maintainer roadmap, `www/content/docs/ai-resources.mdx`, and generator source. Do not change GitHub URLs.

- [ ] **Step 5: Verify the cutover configuration**

Run:

```bash
LEGACY_ORIGIN='https://eng.gobrand.app'
LEGACY_SITE="${LEGACY_ORIGIN}/tiempo"
rg -n "$LEGACY_SITE" package.json README.md CLAUDE.md AGENTS.md docs www \
  --glob '!www/node_modules/**' --glob '!www/dist/**'
rg -n "'/tiempo|\"/tiempo" \
  www/vite.config.ts www/src/router.tsx www/src/routes/__root.tsx \
  www/public/site.webmanifest www/wrangler.jsonc www/package.json
```

Expected: no matches.

- [ ] **Step 6: Commit the canonical cutover**

```bash
git add package.json README.md CLAUDE.md \
  docs/superpowers/specs/2026-07-12-agent-ready-website-design.md \
  www/vite.config.ts www/src/router.tsx www/src/routes/__root.tsx \
  www/public/site.webmanifest www/wrangler.jsonc www/package.json \
  www/scripts/restructure-assets.js
git commit -m "feat(www): move Tiempo docs to dedicated hostname"
```

Keep pre-existing untracked files un-staged; their URL edits remain in the working tree unless the user explicitly asks to add them.

---

### Task 2: Generate truthful discovery and Agent Skill resources

**Files:**
- Create: `scripts/agent-site.test.ts`
- Modify: `scripts/generate-docs.ts`
- Regenerate: `www/public/llms.txt`
- Create: `www/public/robots.txt`
- Create: `www/public/sitemap.xml`
- Create: `www/public/.well-known/agent-skills/index.json`
- Create: `www/public/.well-known/agent-skills/tiempo/SKILL.md`
- Create: `www/public/.well-known/agent-skills/tiempo/references/**/*.md`
- Create: `www/public/.well-known/markdown/docs/**/*.md`

**Interfaces:**
- Consumes: `www/content/docs/**/*.mdx`, category `meta.json` files, `skills/tiempo/SKILL.md`, and `skills/tiempo/references`.
- Produces: exported pure generator helpers plus deterministic public assets used by the Worker and external agents.

- [ ] **Step 1: Write failing generator tests**

Add tests that import pure functions from `scripts/generate-docs.ts` without executing `main()` on import:

```ts
import { describe, expect, test } from 'vitest';
import {
  buildAgentSkillsIndex,
  buildRobotsTxt,
  buildSitemapXml,
  markdownAssetPath,
  SITE_URL,
} from './generate-docs';

describe('agent site generation', () => {
  test('uses the dedicated canonical origin', () => {
    expect(SITE_URL).toBe('https://tiempo.gobrand.app');
  });

  test('declares crawl policy, content signals, and sitemap', () => {
    expect(buildRobotsTxt()).toBe([
      'User-agent: *',
      'Allow: /',
      'Content-Signal: ai-train=no, search=yes, ai-input=yes',
      '',
      'Sitemap: https://tiempo.gobrand.app/sitemap.xml',
      '',
    ].join('\n'));
  });

  test('builds canonical sitemap entries', () => {
    const xml = buildSitemapXml(['/docs', '/docs/conversion/to-instant']);
    expect(xml).toContain('<loc>https://tiempo.gobrand.app/docs</loc>');
    expect(xml).toContain('<loc>https://tiempo.gobrand.app/docs/conversion/to-instant</loc>');
  });

  test('maps docs URLs to hidden markdown assets', () => {
    expect(markdownAssetPath('/docs')).toBe('/.well-known/markdown/docs/index.md');
    expect(markdownAssetPath('/docs/conversion/to-instant')).toBe(
      '/.well-known/markdown/docs/conversion/to-instant.md',
    );
  });

  test('publishes a schema-valid skill index entry', () => {
    const index = buildAgentSkillsIndex('abc123');
    expect(index.skills).toEqual([
      expect.objectContaining({
        name: 'tiempo',
        type: 'skill-md',
        url: '/.well-known/agent-skills/tiempo/SKILL.md',
        digest: 'sha256:abc123',
      }),
    ]);
  });
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run:

```bash
pnpm vitest run scripts/agent-site.test.ts --project polyfill
```

Expected: FAIL because the exported generator helpers do not exist.

- [ ] **Step 3: Implement deterministic generation**

Refactor `scripts/generate-docs.ts` so `main()` runs only when invoked as the entry module, and export:

```ts
export const SITE_URL = 'https://tiempo.gobrand.app';
export const DOCS_URL = `${SITE_URL}/docs`;

export function buildRobotsTxt(): string;
export function buildSitemapXml(paths: string[]): string;
export function markdownAssetPath(pathname: string): string;
export function buildAgentSkillsIndex(skillDigest: string): {
  $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json';
  skills: Array<{
    name: 'tiempo';
    type: 'skill-md';
    description: string;
    url: '/.well-known/agent-skills/tiempo/SKILL.md';
    digest: string;
  }>;
};
```

Load all top-level MDX pages listed in `www/content/docs/meta.json` plus every category page listed by category metadata. Generate Markdown with its title and frontmatter-free body. Generate the sitemap from `/`, every `/docs` page path, `/llms.txt`, and `/.well-known/agent-skills/index.json`. Before regenerating each category under `skills/tiempo/references`, remove that category directory so obsolete generated files cannot survive; preserve the separately maintained `best-practices` directory. Copy the freshly generated Tiempo skill tree into the public well-known directory and calculate the index digest with `createHash('sha256')` over the published `SKILL.md` bytes.

Before copying the skill tree, remove the public destination so deleted references cannot remain stale. Do the same for the hidden Markdown destination.

- [ ] **Step 4: Run tests and generation to verify GREEN**

Run:

```bash
pnpm vitest run scripts/agent-site.test.ts --project polyfill
pnpm generate:docs
```

Expected: tests PASS; generation completes and creates the discovery, skill, sitemap, crawler-policy, Markdown, and `llms.txt` outputs.

- [ ] **Step 5: Verify generated output and determinism**

Run:

```bash
test "$(find www/public/.well-known/markdown/docs -name '*.md' | wc -l | tr -d ' ')" -eq \
  "$(find www/content/docs -name '*.mdx' | wc -l | tr -d ' ')"
test -f www/public/.well-known/agent-skills/tiempo/references/conversion/to-instant.md
rg -n 'https://tiempo\.gobrand\.app' \
  www/public/llms.txt www/public/robots.txt www/public/sitemap.xml
find www/public skills/tiempo -type f -exec shasum -a 256 {} \; | sort | shasum -a 256 > /tmp/tiempo-generated.before
pnpm generate:docs
find www/public skills/tiempo -type f -exec shasum -a 256 {} \; | sort | shasum -a 256 > /tmp/tiempo-generated.after
diff -u /tmp/tiempo-generated.before /tmp/tiempo-generated.after
```

Expected: the source/output counts match, representative skill content exists, canonical URLs are present, and the two generated-tree hashes are identical.

- [ ] **Step 6: Commit generated discovery resources**

```bash
git add scripts/generate-docs.ts scripts/agent-site.test.ts \
  www/content/docs/ai-resources.mdx www/public skills/tiempo
git commit -m "feat(www): publish agent discovery resources"
```

---

### Task 3: Add Markdown negotiation and discovery headers

**Files:**
- Create: `www/src/lib/agent-readiness.ts`
- Create: `www/src/lib/agent-readiness.test.ts`
- Create: `www/src/server.ts`
- Modify: `www/wrangler.jsonc`
- Create: `www/worker-configuration.d.ts`
- Modify: `www/package.json`

**Interfaces:**
- Consumes: hidden Markdown assets produced by Task 2 and the Cloudflare `ASSETS.fetch` binding.
- Produces: `prefersMarkdown(accept: string | null): boolean`, `markdownAssetPath(pathname: string): string | null`, `addAgentHeaders(response: Response): Response`, and the custom Worker server entry.

- [ ] **Step 1: Write failing negotiation and header tests**

```ts
import { describe, expect, test } from 'vitest';
import {
  addAgentHeaders,
  markdownAssetPath,
  prefersMarkdown,
} from './agent-readiness';

describe('agent readiness HTTP behavior', () => {
  test.each([
    ['text/markdown', true],
    ['text/html, text/markdown;q=0.9', false],
    ['text/html;q=0.5, text/markdown;q=1', true],
    ['text/markdown;q=0', false],
    [null, false],
  ])('negotiates %s', (accept, expected) => {
    expect(prefersMarkdown(accept)).toBe(expected);
  });

  test('maps only documentation pages', () => {
    expect(markdownAssetPath('/docs')).toBe('/.well-known/markdown/docs/index.md');
    expect(markdownAssetPath('/docs/conversion/to-instant')).toBe(
      '/.well-known/markdown/docs/conversion/to-instant.md',
    );
    expect(markdownAssetPath('/')).toBeNull();
  });

  test('adds discovery links without removing existing headers', () => {
    const response = addAgentHeaders(
      new Response('ok', { headers: { 'cache-control': 'public' } }),
    );
    expect(response.headers.get('cache-control')).toBe('public');
    expect(response.headers.get('link')).toContain('</sitemap.xml>; rel="sitemap"');
    expect(response.headers.get('link')).toContain('</llms.txt>; rel="describedby"');
    expect(response.headers.get('link')).toContain(
      '</.well-known/agent-skills/index.json>; rel="describedby"',
    );
  });
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run:

```bash
pnpm vitest run www/src/lib/agent-readiness.test.ts --project polyfill
```

Expected: FAIL because `agent-readiness.ts` does not exist.

- [ ] **Step 3: Implement the pure HTTP helpers**

Implement RFC-style media-range parsing sufficient to rank `text/markdown`, `text/html`, and wildcards by quality and original order. Return Markdown only when it is acceptable and has higher preference than HTML. `addAgentHeaders` must clone the response status, body, and headers, then append the three discovery links.

- [ ] **Step 4: Implement the custom server entry**

Use TanStack Start's documented custom server entry and the generated Cloudflare binding:

```ts
import handler, { createServerEntry } from '@tanstack/react-start/server-entry';
import { env } from 'cloudflare:workers';
import {
  addAgentHeaders,
  markdownAssetPath,
  prefersMarkdown,
} from './lib/agent-readiness';

export default createServerEntry({
  async fetch(request) {
    const assetPath = markdownAssetPath(new URL(request.url).pathname);
    if ((request.method === 'GET' || request.method === 'HEAD') &&
        assetPath && prefersMarkdown(request.headers.get('accept'))) {
      const assetUrl = new URL(assetPath, request.url);
      const assetResponse = await env.ASSETS.fetch(new Request(assetUrl, request));
      if (assetResponse.ok) {
        const headers = new Headers(assetResponse.headers);
        headers.set('content-type', 'text/markdown; charset=utf-8');
        headers.append('vary', 'Accept');
        return addAgentHeaders(new Response(assetResponse.body, {
          status: assetResponse.status,
          headers,
        }));
      }
    }

    return addAgentHeaders(await handler.fetch(request));
  },
});
```

Set Wrangler `main` to `src/server.ts`; the Cloudflare Vite plugin otherwise bundles the package default entry before TanStack Start can substitute the custom application server. Keep `run_worker_first` limited to `/`, `/docs`, and `/docs/*`.

Add `"cf-typegen": "wrangler types"` to `www/package.json`, run `pnpm --dir www cf-typegen`, and keep the generated `www/worker-configuration.d.ts` so `cloudflare:workers` and `env.ASSETS` are typed from `www/wrangler.jsonc`.

- [ ] **Step 5: Run focused and website checks**

Run:

```bash
pnpm vitest run www/src/lib/agent-readiness.test.ts --project polyfill
pnpm --dir www types:check
pnpm --dir www build
```

Expected: tests PASS, typecheck exits 0, and build exits 0 with root-level client assets and a custom server bundle.

- [ ] **Step 6: Exercise the built Worker locally**

Start `pnpm --dir www exec wrangler dev --local`, then verify:

```bash
curl -fsSI http://localhost:8787/
curl -fsS -H 'Accept: text/markdown' -D - http://localhost:8787/docs/conversion/to-instant
curl -fsS http://localhost:8787/robots.txt
curl -fsS http://localhost:8787/.well-known/agent-skills/index.json
```

Expected: homepage `200` with discovery `Link`; docs request `200` with `Content-Type: text/markdown` and `Vary: Accept`; crawler policy and skills index return their expected bodies.

- [ ] **Step 7: Commit runtime negotiation**

```bash
git add www/src/lib/agent-readiness.ts www/src/lib/agent-readiness.test.ts \
  www/src/server.ts www/wrangler.jsonc www/worker-configuration.d.ts www/package.json
git commit -m "feat(www): negotiate agent-friendly responses"
```

---

### Task 4: Full verification, deployment, and iterative live scanning

**Files:**
- Modify only if live evidence exposes a truthful, in-scope defect.

**Interfaces:**
- Consumes: the completed root site, generated resources, Worker entry, and authenticated Wrangler session.
- Produces: a deployed custom domain and evidence-backed agent-readiness results.

- [ ] **Step 1: Run the complete pre-deploy verification gate**

```bash
pnpm test -- --run
pnpm typecheck
pnpm build
pnpm --dir www types:check
pnpm --dir www build
pnpm --dir www exec wrangler deploy --dry-run
LEGACY_ORIGIN='https://eng.gobrand.app'
LEGACY_SITE="${LEGACY_ORIGIN}/tiempo"
rg -n "$LEGACY_SITE" package.json README.md CLAUDE.md AGENTS.md docs www \
  --glob '!www/node_modules/**' --glob '!www/dist/**'
rg -n "'/tiempo|\"/tiempo" \
  www/vite.config.ts www/src/router.tsx www/src/routes/__root.tsx \
  www/public/site.webmanifest www/wrangler.jsonc www/package.json
```

Expected: every command exits 0 and the final search returns no matches.

- [ ] **Step 2: Deploy the Worker Custom Domain**

Run:

```bash
pnpm --dir www deploy
```

Expected: Wrangler deploys `tiempo-docs`, attaches `tiempo.gobrand.app` as a Custom Domain, and removes the old configured routes.

- [ ] **Step 3: Verify the live contract directly**

```bash
curl -fsSI https://tiempo.gobrand.app/
curl -fsS https://tiempo.gobrand.app/robots.txt
curl -fsS https://tiempo.gobrand.app/sitemap.xml
curl -fsS https://tiempo.gobrand.app/llms.txt
curl -fsS https://tiempo.gobrand.app/.well-known/agent-skills/index.json
curl -fsS https://tiempo.gobrand.app/.well-known/agent-skills/tiempo/SKILL.md
curl -fsS -H 'Accept: text/markdown' -D - \
  https://tiempo.gobrand.app/docs/conversion/to-instant
```

Expected: all requests return `200`; homepage exposes discovery links; Markdown negotiation returns Markdown and `Vary: Accept`; skills index digest matches the published `SKILL.md`.

- [ ] **Step 4: Run Cloudflare's Content Site scan**

Use `https://isitagentready.com/` with `https://tiempo.gobrand.app`, choose Content Site, and scan. Record each pass/fail result. DNS-AID may remain failed because it is intentionally not applicable.

- [ ] **Step 5: Run a customized Agent Skills scan**

Enable Agent Skills in the checker and verify the index passes. If it fails, compare the live document to the scanner's published `/.well-known/agent-skills/agent-skills/SKILL.md` requirements and correct the concrete mismatch.

- [ ] **Step 6: Iterate only on meaningful failures**

For each failed included feature, reproduce it with a direct request, add or tighten an automated test, implement the minimal fix, rerun the full relevant verification, redeploy, and rescan. Stop when every remaining scanner failure corresponds to an excluded capability in the approved design.

- [ ] **Step 7: Report the deployed outcome**

Report the live URL, exact scan result, intentionally excluded checks, verification commands, commits, and any unrelated pre-existing untracked files left untouched.
