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
