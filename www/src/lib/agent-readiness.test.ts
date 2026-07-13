import { describe, expect, test } from "vitest";
import {
  addAgentHeaders,
  handleAgentRequest,
  markdownAssetPath,
  prefersMarkdown,
} from "./agent-readiness";

describe("agent readiness HTTP behavior", () => {
  test.each([
    ["text/markdown", true],
    ["text/html, text/markdown;q=0.9", false],
    ["text/html;q=0.5, text/markdown;q=1", true],
    ["text/markdown;q=0", false],
    ["text/markdown;q=0.8, */*;q=0.9", false],
    [null, false],
  ])("negotiates %s", (accept, expected) => {
    expect(prefersMarkdown(accept)).toBe(expected);
  });

  test("maps the homepage and documentation pages", () => {
    expect(markdownAssetPath("/")).toBe("/.well-known/markdown/index.md");
    expect(markdownAssetPath("/docs")).toBe(
      "/.well-known/markdown/docs/index.md",
    );
    expect(markdownAssetPath("/docs/conversion/to-instant")).toBe(
      "/.well-known/markdown/docs/conversion/to-instant.md",
    );
    expect(markdownAssetPath("/docs/conversion/to-instant/")).toBe(
      "/.well-known/markdown/docs/conversion/to-instant.md",
    );
    expect(markdownAssetPath("/installation")).toBeNull();
  });

  test("adds discovery links without removing existing headers", () => {
    const response = addAgentHeaders(
      new Response("ok", { headers: { "cache-control": "public" } }),
    );

    expect(response.headers.get("cache-control")).toBe("public");
    expect(response.headers.get("link")).toContain(
      '</sitemap.xml>; rel="sitemap"',
    );
    expect(response.headers.get("link")).toContain(
      '</llms.txt>; rel="describedby"',
    );
    expect(response.headers.get("link")).toContain(
      '</.well-known/agent-skills/index.json>; rel="describedby"',
    );
  });

  test("serves the generated Markdown representation", async () => {
    const response = await handleAgentRequest(
      new Request("https://tiempo.gobrand.app/docs/conversion/to-instant", {
        headers: { accept: "text/markdown" },
      }),
      async () => new Response("<html>fallback</html>"),
      async () => new Response("# toInstant"),
    );

    expect(await response.text()).toBe("# toInstant");
    expect(response.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8",
    );
    expect(response.headers.get("vary")).toContain("Accept");
    expect(response.headers.get("link")).toContain("</llms.txt>");
  });

  test("serves the homepage Markdown representation", async () => {
    const response = await handleAgentRequest(
      new Request("https://tiempo.gobrand.app/", {
        headers: { accept: "text/markdown" },
      }),
      async () => new Response("<html>fallback</html>"),
      async (request) => {
        const exists =
          new URL(request.url).pathname === "/.well-known/markdown/index.md";
        return new Response(exists ? "# Tiempo" : "missing", {
          status: exists ? 200 : 404,
        });
      },
    );

    expect(await response.text()).toBe("# Tiempo");
    expect(response.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8",
    );
  });

  test("falls back to HTML when a Markdown asset is unavailable", async () => {
    const response = await handleAgentRequest(
      new Request("https://tiempo.gobrand.app/docs/missing", {
        headers: { accept: "text/markdown" },
      }),
      async () =>
        new Response("<html>not found</html>", {
          status: 404,
          headers: { "content-type": "text/html" },
        }),
      async () => new Response("missing", { status: 404 }),
    );

    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe("text/html");
    expect(await response.text()).toBe("<html>not found</html>");
  });
});
