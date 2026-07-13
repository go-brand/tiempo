import { readFileSync } from "node:fs";
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
    expect(TIEMPO_AGENT_PROMPT).toContain(
      "https://tiempo.gobrand.app/llms.txt",
    );
    expect(TIEMPO_AGENT_PROMPT).toContain(
      "npx skills add go-brand/tiempo",
    );
    expect(TIEMPO_AGENT_PROMPT).toContain(
      "pnpm add @gobrand/tiempo",
    );
    expect(TIEMPO_AGENT_PROMPT).toContain("Avoid implicit timezones");
    expect(TIEMPO_AGENT_PROMPT).toContain(
      "verify DST behavior, explicit timezones, and UTC storage",
    );
  });

  test("describes the homepage for search and social previews", () => {
    expect(HOME_PAGE_URL).toBe("https://tiempo.gobrand.app/");
    expect(HOME_PAGE_TITLE).toContain("Temporal API");
    expect(HOME_PAGE_TITLE).toContain("TypeScript");
    expect(HOME_PAGE_DESCRIPTION).toContain("Timezone-safe");
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

  test("renders agent, package, and docs actions in that order", () => {
    const route = readFileSync("www/src/routes/index.tsx", "utf8");
    const agent = route.indexOf("Copy prompt for your agent");
    const install = route.indexOf("pnpm add @gobrand/tiempo");
    const docs = route.indexOf("Read the docs");

    expect(agent).toBeGreaterThan(-1);
    expect(agent).toBeLessThan(install);
    expect(install).toBeLessThan(docs);
    expect(route).toContain("/llms.txt");
    expect(route).toContain(
      "/.well-known/agent-skills/tiempo/SKILL.md",
    );
    expect(route).toContain(
      'href="https://tiempo.gobrand.app/llms.txt"',
    );
    expect(route).toContain(
      'href="https://tiempo.gobrand.app/.well-known/agent-skills/tiempo/SKILL.md"',
    );
  });
});
