import { describe, expect, test } from "vitest";
import {
  buildAgentSkillsIndex,
  buildMarkdownDocument,
  buildRobotsTxt,
  buildSitemapXml,
  markdownAssetPath,
  SITE_URL,
} from "./generate-docs";

describe("agent site generation", () => {
  test("uses the dedicated canonical origin", () => {
    expect(SITE_URL).toBe("https://tiempo.gobrand.app");
  });

  test("declares crawl policy, content signals, and sitemap", () => {
    expect(buildRobotsTxt()).toBe(
      [
        "User-agent: *",
        "Allow: /",
        "Content-Signal: ai-train=no, search=yes, ai-input=yes",
        "",
        "Sitemap: https://tiempo.gobrand.app/sitemap.xml",
        "",
      ].join("\n"),
    );
  });

  test("builds canonical sitemap entries", () => {
    const xml = buildSitemapXml(["/docs", "/docs/conversion/to-instant"]);

    expect(xml).toContain("<loc>https://tiempo.gobrand.app/docs</loc>");
    expect(xml).toContain(
      "<loc>https://tiempo.gobrand.app/docs/conversion/to-instant</loc>",
    );
  });

  test("maps the homepage and docs URLs to hidden markdown assets", () => {
    expect(markdownAssetPath("/")).toBe("/.well-known/markdown/index.md");
    expect(markdownAssetPath("/docs")).toBe(
      "/.well-known/markdown/docs/index.md",
    );
    expect(markdownAssetPath("/docs/conversion/to-instant")).toBe(
      "/.well-known/markdown/docs/conversion/to-instant.md",
    );
  });

  test("publishes a schema-valid skill index entry", () => {
    const index = buildAgentSkillsIndex("abc123");

    expect(index.skills).toEqual([
      expect.objectContaining({
        name: "tiempo",
        type: "skill-md",
        url: "/.well-known/agent-skills/tiempo/SKILL.md",
        digest: "sha256:abc123",
      }),
    ]);
  });

  test("converts documentation-only MDX components to useful Markdown", () => {
    expect(
      buildMarkdownDocument({
        title: "Introduction",
        body: [
          "import { Cards, Card } from 'fumadocs-ui/components/card';",
          "",
          "<Cards>",
          '  <Card title="Installation" href="/docs/installation" description="Get started" />',
          "</Cards>",
        ].join("\n"),
      }),
    ).toBe(
      [
        "# Introduction",
        "",
        "- [Installation](https://tiempo.gobrand.app/docs/installation): Get started",
        "",
      ].join("\n"),
    );
  });

  test("preserves imports inside code fences", () => {
    expect(
      buildMarkdownDocument({
        title: "Example",
        body: [
          "```ts",
          "import { toInstant } from '@gobrand/tiempo';",
          "```",
        ].join("\n"),
      }),
    ).toContain("import { toInstant } from '@gobrand/tiempo';");
  });
});
