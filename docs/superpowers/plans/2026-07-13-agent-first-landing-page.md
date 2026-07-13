# Agent-first Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lead Tiempo's landing-page actions with a copyable, high-quality agent prompt while preserving package installation and docs access, and make the same agent resources discoverable in HTML metadata and negotiated Markdown.

**Architecture:** Put the exact prompt, canonical URLs, homepage metadata, and structured-data object in a small framework-independent homepage contract. The existing route consumes that contract for its route head and two clipboard interactions. The docs introduction remains the source for generated Markdown assets, so human HTML and agent-readable Markdown expose the same resources.

**Tech Stack:** TypeScript 5.9, React 19, TanStack Router/Start 1.157, Tailwind CSS 4, Vitest 3, existing docs generator.

## Global Constraints

- Keep the hero order exact: agent prompt first, `pnpm add @gobrand/tiempo` second, docs third.
- Copy the exact approved prompt from the design spec.
- Keep existing clock, typography, navigation, feature sections, footer, crawler policy, sitemap, Markdown negotiation, and Agent Skill discovery behavior.
- Add no dependencies, tabs, modal, toast system, MCP surface, unsupported capability, package API change, or npm release.
- Preserve unrelated worktree changes, including the untracked root `AGENTS.md` and maintainer roadmap plan.
- Use the canonical origin `https://tiempo.gobrand.app`.

---

### Task 1: Define and test the homepage agent contract

**Files:**
- Create: `www/src/lib/homepage.ts`
- Create: `www/src/lib/homepage.test.ts`

**Interfaces:**
- Produces: `TIEMPO_AGENT_PROMPT: string`, `HOME_PAGE_TITLE: string`, `HOME_PAGE_DESCRIPTION: string`, `HOME_PAGE_URL: string`, `HOME_PAGE_META`, and `HOME_PAGE_STRUCTURED_DATA`.
- Consumed by: `www/src/routes/index.tsx` in Task 2.

- [ ] **Step 1: Write the failing contract test**

Create `www/src/lib/homepage.test.ts`:

```ts
import { describe, expect, test } from "vitest";
import {
  HOME_PAGE_DESCRIPTION,
  HOME_PAGE_META,
  HOME_PAGE_STRUCTURED_DATA,
  HOME_PAGE_TITLE,
  HOME_PAGE_URL,
  TIEMPO_AGENT_PROMPT,
} from "./homepage";

describe("homepage contract", () => {
  test("copies the complete agent onboarding prompt", () => {
    expect(TIEMPO_AGENT_PROMPT).toContain("https://tiempo.gobrand.app/llms.txt");
    expect(TIEMPO_AGENT_PROMPT).toContain("npx skills add go-brand/tiempo");
    expect(TIEMPO_AGENT_PROMPT).toContain("pnpm add @gobrand/tiempo");
    expect(TIEMPO_AGENT_PROMPT).toContain("Avoid implicit timezones");
    expect(TIEMPO_AGENT_PROMPT).toContain("verify DST behavior, explicit timezones, and UTC storage");
  });

  test("describes the homepage for search and social previews", () => {
    expect(HOME_PAGE_URL).toBe("https://tiempo.gobrand.app/");
    expect(HOME_PAGE_TITLE).toContain("Temporal API");
    expect(HOME_PAGE_TITLE).toContain("TypeScript");
    expect(HOME_PAGE_DESCRIPTION).toContain("timezone-safe");
    expect(HOME_PAGE_DESCRIPTION).toContain("AI agents");
    expect(HOME_PAGE_META).toEqual(
      expect.arrayContaining([
        { property: "og:url", content: HOME_PAGE_URL },
        { name: "twitter:card", content: "summary" },
      ]),
    );
  });

  test("publishes truthful website and source-code structured data", () => {
    expect(HOME_PAGE_STRUCTURED_DATA).toMatchObject({
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "WebSite", name: "Tiempo", url: HOME_PAGE_URL },
        {
          "@type": "SoftwareSourceCode",
          name: "Tiempo",
          codeRepository: "https://github.com/go-brand/tiempo",
          programmingLanguage: "TypeScript",
        },
      ],
    });
  });
});
```

- [ ] **Step 2: Run the test and verify the missing module failure**

Run: `pnpm vitest --run www/src/lib/homepage.test.ts`

Expected: FAIL because `./homepage` does not exist.

- [ ] **Step 3: Add the homepage contract**

Create `www/src/lib/homepage.ts` with the exact approved prompt and route metadata:

```ts
export const HOME_PAGE_URL = "https://tiempo.gobrand.app/";
export const HOME_PAGE_TITLE =
  "Tiempo — Temporal API date and time utilities for TypeScript";
export const HOME_PAGE_DESCRIPTION =
  "Timezone-safe Temporal API utilities for TypeScript, with agent-ready llms.txt documentation and an installable skill for AI agents.";

export const TIEMPO_AGENT_PROMPT =
  "Use @gobrand/tiempo for date, time, timezone, and datetime work in this TypeScript/JavaScript project. Before coding, read https://tiempo.gobrand.app/llms.txt for the current API and examples. If your environment supports Agent Skills, install Tiempo's skill with `npx skills add go-brand/tiempo` and follow its guidance. Prefer Temporal types and Tiempo utilities for datetime logic. Avoid implicit timezones and JavaScript Date except at integration boundaries that require it. Inspect the existing code before changing it, choose the smallest appropriate Tiempo API, and verify DST behavior, explicit timezones, and UTC storage. Package installation: `pnpm add @gobrand/tiempo`. Documentation: https://tiempo.gobrand.app/docs.";

export const HOME_PAGE_META = [
  { title: HOME_PAGE_TITLE },
  { name: "description", content: HOME_PAGE_DESCRIPTION },
  { property: "og:title", content: HOME_PAGE_TITLE },
  { property: "og:description", content: HOME_PAGE_DESCRIPTION },
  { property: "og:type", content: "website" },
  { property: "og:url", content: HOME_PAGE_URL },
  { property: "og:site_name", content: "Tiempo" },
  { name: "twitter:card", content: "summary" },
  { name: "twitter:title", content: HOME_PAGE_TITLE },
  { name: "twitter:description", content: HOME_PAGE_DESCRIPTION },
] as const;

export const HOME_PAGE_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Tiempo",
      url: HOME_PAGE_URL,
      description: HOME_PAGE_DESCRIPTION,
    },
    {
      "@type": "SoftwareSourceCode",
      name: "Tiempo",
      description: HOME_PAGE_DESCRIPTION,
      url: HOME_PAGE_URL,
      codeRepository: "https://github.com/go-brand/tiempo",
      programmingLanguage: "TypeScript",
      license: "https://opensource.org/license/mit",
      runtimePlatform: ["Node.js", "Web browser"],
      targetProduct: {
        "@type": "SoftwareApplication",
        name: "@gobrand/tiempo",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Cross-platform",
      },
    },
  ],
} as const;
```

- [ ] **Step 4: Run the focused test**

Run: `pnpm vitest --run www/src/lib/homepage.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the contract**

```bash
git add www/src/lib/homepage.ts www/src/lib/homepage.test.ts
git commit -m "feat(www): define agent-first homepage contract"
```

---

### Task 2: Build the ordered hero actions and homepage head

**Files:**
- Modify: `www/src/routes/index.tsx:1-12,343-409`
- Test: `www/src/lib/homepage.test.ts`

**Interfaces:**
- Consumes: all exports from `www/src/lib/homepage.ts`.
- Produces: route-managed homepage metadata and structured data; agent, package, and docs actions rendered in exact source order.

- [ ] **Step 1: Add a failing source-order assertion**

Append to `www/src/lib/homepage.test.ts`:

```ts
import { readFileSync } from "node:fs";

test("renders agent, package, and docs actions in that order", () => {
  const route = readFileSync("www/src/routes/index.tsx", "utf8");
  const agent = route.indexOf("Copy prompt for your agent");
  const install = route.indexOf("pnpm add @gobrand/tiempo");
  const docs = route.indexOf("Read the docs");

  expect(agent).toBeGreaterThan(-1);
  expect(agent).toBeLessThan(install);
  expect(install).toBeLessThan(docs);
  expect(route).toContain("/llms.txt");
  expect(route).toContain("/.well-known/agent-skills/tiempo/SKILL.md");
});
```

- [ ] **Step 2: Run the test and verify the missing agent action failure**

Run: `pnpm vitest --run www/src/lib/homepage.test.ts`

Expected: FAIL because the route does not contain `Copy prompt for your agent` or the agent-resource links.

- [ ] **Step 3: Add route head metadata**

Import the homepage contract and extend the route:

```tsx
import {
  HOME_PAGE_META,
  HOME_PAGE_STRUCTURED_DATA,
  HOME_PAGE_URL,
  TIEMPO_AGENT_PROMPT,
} from "@/lib/homepage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      ...HOME_PAGE_META,
      { "script:ld+json": HOME_PAGE_STRUCTURED_DATA },
    ],
    links: [{ rel: "canonical", href: HOME_PAGE_URL }],
  }),
  component: Home,
});
```

- [ ] **Step 4: Add independent clipboard state and the three ordered actions**

Inside `Home`, add state and a safe copy helper:

```tsx
const [copied, setCopied] = useState<"agent" | "install" | null>(null);

async function copyToClipboard(value: string, target: "agent" | "install") {
  try {
    await navigator.clipboard.writeText(value);
    setCopied(target);
    window.setTimeout(() => {
      setCopied((current) => (current === target ? null : current));
    }, 2000);
  } catch {
    setCopied(null);
  }
}
```

Replace only the hero action block with:

```tsx
<div className="flex flex-wrap items-center gap-3">
  <button
    type="button"
    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
    onClick={() => copyToClipboard(TIEMPO_AGENT_PROMPT, "agent")}
    aria-live="polite"
  >
    {copied === "agent" ? "Prompt copied" : "Copy prompt for your agent"}
  </button>

  <code className="flex min-h-11 items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900/80 px-4 py-2.5 font-mono text-sm text-neutral-300">
    <span className="text-neutral-500">$</span> pnpm add @gobrand/tiempo
    <button
      type="button"
      className="rounded p-1 transition-colors hover:bg-neutral-700/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
      onClick={() => copyToClipboard("pnpm add @gobrand/tiempo", "install")}
      aria-label={copied === "install" ? "Package command copied" : "Copy package command"}
    >
      <svg
        className="h-4 w-4 text-neutral-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    </button>
  </code>

  <Link
    to="/docs/$"
    params={{ _splat: "" }}
    className="min-h-11 px-2 inline-flex items-center text-sm font-medium text-amber-400 transition-colors hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
  >
    Read the docs
  </Link>
</div>

<p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-500">
  The prompt points your coding agent to Tiempo&apos;s{" "}
  <a className="text-neutral-300 underline decoration-neutral-700 underline-offset-4 hover:text-amber-300" href="/llms.txt">
    llms.txt
  </a>{" "}
  and installable{" "}
  <a className="text-neutral-300 underline decoration-neutral-700 underline-offset-4 hover:text-amber-300" href="/.well-known/agent-skills/tiempo/SKILL.md">
    Agent Skill
  </a>.
</p>
```

- [ ] **Step 5: Run focused tests and website type checking**

Run:

```bash
pnpm vitest --run www/src/lib/homepage.test.ts
pnpm --dir www types:check
```

Expected: both commands PASS.

- [ ] **Step 6: Commit the landing route**

```bash
git add www/src/routes/index.tsx www/src/lib/homepage.test.ts
git commit -m "feat(www): lead homepage with agent prompt"
```

---

### Task 3: Expose agent onboarding in negotiated Markdown

**Files:**
- Modify: `scripts/agent-site.test.ts`
- Modify: `www/content/docs/index.mdx`
- Regenerate: `www/public/.well-known/markdown/index.md`
- Regenerate: `www/public/.well-known/markdown/docs/index.md`
- Regenerate only if content changes: `www/public/llms.txt`, `skills/tiempo/SKILL.md`, `www/public/.well-known/agent-skills/**`

**Interfaces:**
- Consumes: the existing `pnpm generate:docs` pipeline.
- Produces: agent onboarding links and commands in both homepage and docs negotiated Markdown assets.

- [ ] **Step 1: Add a failing generated-homepage test**

Add to `scripts/agent-site.test.ts`:

```ts
import { readFileSync } from "node:fs";

test("publishes agent onboarding on the negotiated homepage", () => {
  const source = readFileSync("www/content/docs/index.mdx", "utf8");
  const homepage = readFileSync(
    "www/public/.well-known/markdown/index.md",
    "utf8",
  );

  for (const content of [source, homepage]) {
    expect(content).toContain("https://tiempo.gobrand.app/llms.txt");
    expect(content).toContain("npx skills add go-brand/tiempo");
    expect(content).toContain(
      "https://tiempo.gobrand.app/.well-known/agent-skills/tiempo/SKILL.md",
    );
    expect(content).toContain("pnpm add @gobrand/tiempo");
  }
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `pnpm vitest --run scripts/agent-site.test.ts`

Expected: FAIL because the introduction and negotiated homepage do not yet contain the four onboarding resources.

- [ ] **Step 3: Add the agent-resources section to the docs introduction**

Add this section before `## Documentation` in `www/content/docs/index.mdx`:

````mdx
## Using tiempo with an AI coding agent

Give your agent the current API from [llms.txt](https://tiempo.gobrand.app/llms.txt). If it supports Agent Skills, install Tiempo's skill:

```bash
npx skills add go-brand/tiempo
```

The skill is also available through [Tiempo's Agent Skill discovery URL](https://tiempo.gobrand.app/.well-known/agent-skills/tiempo/SKILL.md). Install the package with `pnpm add @gobrand/tiempo`, then use the [documentation](https://tiempo.gobrand.app/docs) for human-readable examples.
````

- [ ] **Step 4: Regenerate all documentation and agent outputs**

Run: `pnpm generate:docs`

Expected: the generator succeeds and updates both negotiated homepage Markdown assets. Generated skill and `llms.txt` files remain byte-stable unless the source-driven generator legitimately changes them.

- [ ] **Step 5: Run generator and agent-readiness tests**

Run:

```bash
pnpm vitest --run scripts/agent-site.test.ts www/src/lib/agent-readiness.test.ts
git diff --check
```

Expected: PASS with no whitespace errors.

- [ ] **Step 6: Commit source and generated outputs**

```bash
git add scripts/agent-site.test.ts www/content/docs/index.mdx www/public/.well-known/markdown/index.md www/public/.well-known/markdown/docs/index.md
git add -u skills/tiempo www/public/llms.txt www/public/.well-known/agent-skills
git commit -m "docs: surface Tiempo resources for coding agents"
```

Before committing, inspect the staged diff and unstage any unrelated generated churn.

---

### Task 4: Verify behavior, rendering, and scope

**Files:**
- Verify only; modify Task 1–3 files only if verification exposes a defect.

**Interfaces:**
- Consumes: the completed landing page and generated agent assets.
- Produces: evidence that the page builds, remains agent-readable, and renders correctly on desktop and mobile.

- [ ] **Step 1: Run the complete relevant automated checks**

Run:

```bash
pnpm vitest --run www/src/lib/homepage.test.ts scripts/agent-site.test.ts www/src/lib/agent-readiness.test.ts
pnpm --dir www types:check
pnpm --dir www build
pnpm typecheck
pnpm build
```

Expected: every command exits 0. `pnpm build` may regenerate docs; the worktree must remain clean for tracked implementation files afterward.

- [ ] **Step 2: Inspect server-rendered metadata**

Start the built site or local dev server and request `/`. Confirm the returned HTML contains:

```text
Tiempo — Temporal API date and time utilities for TypeScript
https://tiempo.gobrand.app/
application/ld+json
SoftwareSourceCode
Copy prompt for your agent
/.well-known/agent-skills/tiempo/SKILL.md
```

Expected: all strings exist in the initial HTML response.

- [ ] **Step 3: Verify negotiated Markdown**

Request the homepage with `Accept: text/markdown` and confirm it returns `content-type: text/markdown; charset=utf-8` with `llms.txt`, `npx skills add go-brand/tiempo`, the skill discovery URL, and `pnpm add @gobrand/tiempo`.

- [ ] **Step 4: Inspect desktop and mobile rendering**

Use the local browser at desktop and mobile widths. Confirm:

- The order is agent prompt, package install, docs.
- The row wraps without overlap or horizontal scrolling.
- Both copy actions work and expose independent copied feedback.
- Keyboard focus is visible.
- The resource explanation is readable and both links resolve.
- The existing clock and subsequent sections are unchanged.

- [ ] **Step 5: Run final scope checks**

Run:

```bash
git diff --check
git status --short
git log --oneline -5
```

Expected: only the known untracked user files remain; all implementation commits are present. Do not deploy, push, publish, or alter the unrelated files.
