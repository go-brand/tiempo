/**
 * Documentation Generator
 *
 * Single source of truth: MDX files in www/content/docs/
 * Generates:
 * 1. Skill reference markdown files (skills/tiempo/references/)
 * 2. llms.txt (www/public/llms.txt)
 * 3. SKILL.md index (skills/tiempo/SKILL.md)
 *
 * Usage: pnpm generate:docs
 */

import * as fs from "node:fs";
import * as path from "node:path";

const DOCS_DIR = "www/content/docs";
const SKILL_REFS_DIR = "skills/tiempo/references";
const LLMS_TXT_PATH = "www/public/llms.txt";
const SKILL_MD_PATH = "skills/tiempo/SKILL.md";
const BASE_URL = "https://eng.gobrand.app/tiempo/docs";

// Categories to process (in order for llms.txt)
const CATEGORIES = [
  "conversion",
  "current-time",
  "formatting",
  "arithmetic",
  "boundaries",
  "comparison",
  "difference",
  "utilities",
] as const;

// Category metadata for llms.txt
const CATEGORY_TITLES: Record<string, string> = {
  conversion: "Conversion",
  "current-time": "Current Time",
  formatting: "Formatting",
  arithmetic: "Arithmetic",
  boundaries: "Boundaries",
  comparison: "Comparison",
  difference: "Difference",
  utilities: "Utilities",
};

// Functions to group under "Optional" in llms.txt
const OPTIONAL_FUNCTIONS = new Set([
  "add-milliseconds",
  "add-microseconds",
  "add-nanoseconds",
  "sub-milliseconds",
  "sub-microseconds",
  "sub-nanoseconds",
  "difference-in-milliseconds",
  "difference-in-microseconds",
  "difference-in-nanoseconds",
  "is-same-hour",
  "is-same-minute",
  "is-same-second",
  "is-same-millisecond",
  "is-same-microsecond",
  "is-same-nanosecond",
  "is-plain-date-before",
  "is-plain-date-after",
  "is-plain-date-equal",
  "is-plain-time-before",
  "is-plain-time-after",
  "is-plain-time-equal",
]);

interface DocFile {
  slug: string;
  category: string;
  title: string;
  description: string;
  body: string;
  filePath: string;
}

interface MetaJson {
  title: string;
  description?: string;
  icon?: string;
  pages: string[];
}

/**
 * Parse MDX frontmatter and body
 */
function parseMdx(content: string): {
  frontmatter: Record<string, string>;
  body: string;
} {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) {
    return { frontmatter: {}, body: content };
  }

  const frontmatter: Record<string, string> = {};
  const frontmatterLines = frontmatterMatch[1].split("\n");
  for (const line of frontmatterLines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      frontmatter[key] = value;
    }
  }

  return { frontmatter, body: frontmatterMatch[2] };
}

/**
 * Load all MDX doc files
 */
function loadDocFiles(): DocFile[] {
  const docs: DocFile[] = [];

  for (const category of CATEGORIES) {
    const categoryDir = path.join(DOCS_DIR, category);
    if (!fs.existsSync(categoryDir)) continue;

    // Load meta.json to get page order
    const metaPath = path.join(categoryDir, "meta.json");
    if (!fs.existsSync(metaPath)) continue;

    const meta: MetaJson = JSON.parse(fs.readFileSync(metaPath, "utf-8"));

    for (const slug of meta.pages) {
      const filePath = path.join(categoryDir, `${slug}.mdx`);
      if (!fs.existsSync(filePath)) {
        console.warn(`Warning: ${filePath} not found (listed in meta.json)`);
        continue;
      }

      const content = fs.readFileSync(filePath, "utf-8");
      const { frontmatter, body } = parseMdx(content);

      docs.push({
        slug,
        category,
        title: frontmatter.title || slug,
        description: frontmatter.description || "",
        body,
        filePath,
      });
    }
  }

  return docs;
}

/**
 * Generate skill reference markdown from MDX
 */
function generateSkillMarkdown(doc: DocFile): string {
  // Convert MDX to plain markdown:
  // 1. Add # title header
  // 2. Keep the body as-is (most MDX content is valid markdown)
  return `# ${doc.title}\n${doc.body}`;
}

/**
 * Generate all skill reference files
 */
function generateSkillRefs(docs: DocFile[]): void {
  console.log("Generating skill reference files...");

  for (const doc of docs) {
    const outDir = path.join(SKILL_REFS_DIR, doc.category);
    fs.mkdirSync(outDir, { recursive: true });

    const outPath = path.join(outDir, `${doc.slug}.md`);
    const markdown = generateSkillMarkdown(doc);
    fs.writeFileSync(outPath, markdown);
    console.log(`  ✓ ${outPath}`);
  }
}

/**
 * Generate llms.txt
 */
function generateLlmsTxt(docs: DocFile[]): void {
  console.log("Generating llms.txt...");

  const lines: string[] = [
    "# tiempo",
    "",
    "> A lightweight datetime utility library for timezone conversions, formatting, and date math built on the Temporal API.",
    "",
    "tiempo provides a familiar date-fns-style API while leveraging the modern Temporal API for precision you can trust. It supports 400+ IANA timezones, nanosecond precision, DST-safe arithmetic, and immutable operations.",
    "",
    "## Docs",
    "",
    "- [Introduction](https://eng.gobrand.app/tiempo/docs): Overview of tiempo and key features",
    "- [Installation](https://eng.gobrand.app/tiempo/docs/installation): Getting started with tiempo in your project",
    "- [TypeScript](https://eng.gobrand.app/tiempo/docs/typescript): Type-safe datetime handling with timezone autocomplete",
    "",
  ];

  // Group docs by category
  const byCategory = new Map<string, DocFile[]>();
  const optionalDocs: DocFile[] = [];

  for (const doc of docs) {
    if (OPTIONAL_FUNCTIONS.has(doc.slug)) {
      optionalDocs.push(doc);
    } else {
      const existing = byCategory.get(doc.category) || [];
      existing.push(doc);
      byCategory.set(doc.category, existing);
    }
  }

  // Generate category sections
  for (const category of CATEGORIES) {
    const categoryDocs = byCategory.get(category);
    if (!categoryDocs || categoryDocs.length === 0) continue;

    lines.push(`## ${CATEGORY_TITLES[category] || category}`);
    lines.push("");

    for (const doc of categoryDocs) {
      const url = `${BASE_URL}/${doc.category}/${doc.slug}`;
      lines.push(`- [${doc.title}](${url}): ${doc.description}`);
    }

    lines.push("");
  }

  // Add optional section
  if (optionalDocs.length > 0) {
    lines.push("## Optional");
    lines.push("");

    for (const doc of optionalDocs) {
      const url = `${BASE_URL}/${doc.category}/${doc.slug}`;
      lines.push(`- [${doc.title}](${url}): ${doc.description}`);
    }

    lines.push("");
  }

  fs.writeFileSync(LLMS_TXT_PATH, lines.join("\n"));
  console.log(`  ✓ ${LLMS_TXT_PATH}`);
}

/**
 * Generate SKILL.md index
 */
function generateSkillMd(docs: DocFile[]): void {
  console.log("Generating SKILL.md...");

  const lines: string[] = [
    "---",
    "name: tiempo",
    "description: Use when working with dates, times, timezones, or datetime conversions in TypeScript/JavaScript. Provides guidance on using the tiempo library for timezone-safe datetime handling with the Temporal API.",
    "---",
    "",
    "# tiempo - Timezone-Safe Datetime Handling",
    "",
    "Lightweight utility library for timezone conversions built on the Temporal API.",
    "",
    "```bash",
    "npm install @gobrand/tiempo",
    "```",
    "",
    "## Best Practices",
    "",
    "- **Always use explicit timezones** - Never rely on implicit timezone behavior. [details](references/best-practices/explicit-timezone.md)",
    "- **Don't use JavaScript Date** - Use tiempo instead of Date for timezone work. [details](references/best-practices/no-js-date.md)",
    "- **Store UTC, display local** - Backend stores UTC, frontend converts for display. [details](references/best-practices/utc-storage.md)",
    "",
    "---",
    "",
  ];

  // Group by category
  const byCategory = new Map<string, DocFile[]>();
  for (const doc of docs) {
    const existing = byCategory.get(doc.category) || [];
    existing.push(doc);
    byCategory.set(doc.category, existing);
  }

  // Generate category tables (all categories have reference links)
  for (const category of CATEGORIES) {
    const categoryDocs = byCategory.get(category);
    if (!categoryDocs || categoryDocs.length === 0) continue;

    const title = CATEGORY_TITLES[category] || category;
    lines.push(`## ${title}`);
    lines.push("");
    lines.push("| Function | Description | Reference |");
    lines.push("|----------|-------------|-----------|");

    for (const doc of categoryDocs) {
      const refPath = `references/${category}/${doc.slug}.md`;
      lines.push(
        `| \`${doc.title}()\` | ${doc.description} | [details](${refPath}) |`
      );
    }

    lines.push("");
  }

  // Add types section
  lines.push("## Types");
  lines.push("");
  lines.push("```ts");
  lines.push("import type { Timezone, IANATimezone } from '@gobrand/tiempo';");
  lines.push("");
  lines.push("// Timezone: accepts IANA timezones + \"UTC\"");
  lines.push(
    "const tz: Timezone = 'America/New_York';  // Autocomplete for 400+ timezones"
  );
  lines.push("");
  lines.push('// IANATimezone: strictly IANA identifiers (excludes "UTC")');
  lines.push("const iana: IANATimezone = 'Europe/London';");
  lines.push("```");
  lines.push("");

  fs.writeFileSync(SKILL_MD_PATH, lines.join("\n"));
  console.log(`  ✓ ${SKILL_MD_PATH}`);
}

/**
 * Main
 */
function main(): void {
  console.log("📚 Documentation Generator\n");
  console.log("Source: MDX files in www/content/docs/");
  console.log("─".repeat(50));

  const docs = loadDocFiles();
  console.log(`\nFound ${docs.length} doc files\n`);

  generateSkillRefs(docs);
  console.log("");

  generateLlmsTxt(docs);
  console.log("");

  generateSkillMd(docs);
  console.log("");

  console.log("─".repeat(50));
  console.log("✅ Done!");
}

main();
