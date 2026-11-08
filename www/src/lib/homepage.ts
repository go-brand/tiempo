export const HOME_PAGE_URL = "https://tiempo.gobrand.app/";
export const HOME_PAGE_TITLE =
  "Tiempo — date-fns-style utilities for the Temporal API in TypeScript";
export const HOME_PAGE_DESCRIPTION =
  "Dates without the bugs. Timezone-safe, date-fns-style functions for the Temporal API in TypeScript, with llms.txt and an Agent Skill for AI agents.";

export const TIEMPO_AGENT_PROMPT =
  "Use @gobrand/tiempo for date and time logic in this project. Before writing code, read https://tiempo.gobrand.app/llms.txt for the current API. If you support Agent Skills, install the skill with `npx skills add go-brand/tiempo`. Follow these rules: store and send timestamps as UTC ISO strings; pass an explicit IANA timezone whenever a result depends on local time (today, start of day, formatting for display); keep calendar dates such as birthdays and due dates as Temporal.PlainDate; use JavaScript Date only where another library or API requires it. Most date-fns function names carry over (mapping: https://tiempo.gobrand.app/docs/date-fns). Cover daylight saving changes in tests. Install with `pnpm add @gobrand/tiempo`. Docs: https://tiempo.gobrand.app/docs.";

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
