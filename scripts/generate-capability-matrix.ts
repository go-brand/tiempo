/**
 * Capability Matrix Generator
 *
 * Introspects every function exported from `src/index.ts` via the TypeScript
 * AST and emits an input/output type matrix as an MDX docs page. Reading the
 * written overload signatures (not resolved types) keeps the output faithful to
 * the public contract and avoids expanding aliases like `Timezone`.
 *
 * Usage: pnpm generate:matrix
 */

import * as ts from "typescript";
import * as fs from "node:fs";
import * as path from "node:path";
import {
  capabilityCell,
  capabilityMatrixIntro,
} from "./capability-matrix-semantics";

const OUT_PATH = "www/content/docs/type-matrix.mdx";
const DOCS_DIR = "www/content/docs";

// Category order mirrors the rest of the docs.
const CATEGORIES = [
  "conversion",
  "current-time",
  "formatting",
  "arithmetic",
  "boundaries",
  "comparison",
  "difference",
  "intervals",
  "utilities",
] as const;

const CATEGORY_TITLES: Record<string, string> = {
  conversion: "Conversion",
  "current-time": "Current Time",
  formatting: "Formatting",
  arithmetic: "Arithmetic",
  boundaries: "Boundaries",
  comparison: "Comparison",
  difference: "Difference",
  intervals: "Intervals",
  utilities: "Utilities",
  other: "Other",
};

interface Row {
  name: string;
  acceptsInstant: boolean;
  acceptsZoned: boolean;
  acceptsPlainDate: boolean;
  acceptsPlainTime: boolean;
  otherIn: string[];
  returns: string[];
}

function camelToKebab(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

/** Map each documented function slug to its category folder. */
function buildCategoryIndex(): Map<string, string> {
  const index = new Map<string, string>();
  for (const category of CATEGORIES) {
    const dir = path.join(DOCS_DIR, category);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (file.endsWith(".mdx")) index.set(file.replace(/\.mdx$/, ""), category);
    }
  }
  return index;
}

function clean(typeText: string): string {
  return typeText
    .replace(/\bTemporal\./g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const has = (s: string, re: RegExp) => re.test(s);

function analyze(name: string, decls: ts.FunctionDeclaration[], sf: ts.SourceFile): Row {
  // Prefer overload signatures (no body); fall back to the implementation.
  const overloads = decls.filter((d) => !d.body);
  const signatures = overloads.length > 0 ? overloads : decls;

  const paramText: string[] = [];
  const returnSet = new Set<string>();

  for (const sig of signatures) {
    for (const p of sig.parameters) {
      if (p.type) paramText.push(p.type.getText(sf));
    }
    if (sig.type) returnSet.add(clean(sig.type.getText(sf)));
  }

  const params = paramText.join(" | ");
  const otherIn: string[] = [];
  if (has(params, /\bstring\b/)) otherIn.push("string");
  if (has(params, /\bDate\b/)) otherIn.push("Date");
  if (has(params, /\bPlainDateLike\b/)) otherIn.push("PlainDateLike");
  if (has(params, /\bPlainTimeLike\b/)) otherIn.push("PlainTimeLike");
  if (has(params, /\bPlainDateTime\b/)) otherIn.push("PlainDateTime");
  if (has(params, /\bDuration\b/)) otherIn.push("Duration");

  return {
    name,
    acceptsInstant: has(params, /\bInstant\b/),
    acceptsZoned: has(params, /\bZonedDateTime\b/),
    acceptsPlainDate: has(params, /\bPlainDate\b/) || has(params, /\bPlainDateLike\b/),
    acceptsPlainTime: has(params, /\bPlainTime\b/) || has(params, /\bPlainTimeLike\b/),
    otherIn,
    returns: [...returnSet],
  };
}

function collectRows(): Row[] {
  const configPath = path.resolve("tsconfig.json");
  const config = ts.readConfigFile(configPath, ts.sys.readFile).config;
  const parsed = ts.parseJsonConfigFileContent(config, ts.sys, path.dirname(configPath));

  const program = ts.createProgram(parsed.fileNames, parsed.options);
  const checker = program.getTypeChecker();
  const indexFile = program.getSourceFile(path.resolve("src/index.ts"));
  if (!indexFile) throw new Error("src/index.ts not found in program");

  const moduleSymbol = checker.getSymbolAtLocation(indexFile);
  if (!moduleSymbol) throw new Error("Could not resolve src/index.ts module symbol");

  const rows: Row[] = [];
  for (const exp of checker.getExportsOfModule(moduleSymbol)) {
    let symbol = exp;
    if (symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);

    const decls = (symbol.getDeclarations() ?? []).filter(ts.isFunctionDeclaration);
    if (decls.length === 0) continue; // types, interfaces, etc.

    const sf = decls[0]!.getSourceFile();
    rows.push(analyze(exp.getName(), decls, sf));
  }
  return rows.sort((a, b) => a.name.localeCompare(b.name));
}

function render(rows: Row[]): string {
  const categoryOf = buildCategoryIndex();
  const grouped = new Map<string, Row[]>();
  for (const row of rows) {
    const category = categoryOf.get(camelToKebab(row.name)) ?? "other";
    (grouped.get(category) ?? grouped.set(category, []).get(category)!).push(row);
  }

  const order = [...CATEGORIES, "other"];

  const lines: string[] = [
    "---",
    "title: Type Matrix",
    "description: Which Temporal types every function accepts and returns",
    "---",
    "",
    capabilityMatrixIntro,
    "",
    "> **How to read this.** The **accepts** columns mark whether a function takes that Temporal type as a date/time input. **Other in** lists non-Temporal or `*Like` inputs (`string`, `Date`, `PlainDateLike`, …). **Returns** is the literal return type. `✅` means supported. A written note marks an intentional non-operation. `·` only means the type is not accepted; it is not automatically a missing feature.",
    "",
    "## API Rules",
    "",
    "- A `to<Type>` function returns `<Type>`. Temporal normalization helpers accept their target type when that produces a useful composable pipeline.",
    "- `ZonedDateTime` operations preserve the input timezone unless an explicit override is part of the signature.",
    "- Date-sized `PlainDate` operations stay in calendar space. Passing a timezone explicitly bridges a `PlainDate` to `ZonedDateTime`.",
    "- Formatting, comparison, difference, and projection functions intentionally return scalar values instead of preserving the input type.",
    "- Many `Instant` operations use implicit UTC calendar context and return `ZonedDateTime`. The table exposes that current contract; changing it would require a future breaking release.",
    "",
  ];

  for (const category of order) {
    const group = grouped.get(category);
    if (!group || group.length === 0) continue;
    lines.push(`## ${CATEGORY_TITLES[category] ?? category}`, "");
    lines.push(
      "| Function | Instant | Zoned | PlainDate | PlainTime | Other in | Returns |",
      "|----------|:-------:|:-----:|:---------:|:---------:|----------|---------|",
    );
    // Literal pipes (e.g. `1 | 2 | 3 | 4`) must be escaped inside table cells.
    const cell = (t: string) => `\`${t.replace(/\|/g, "\\|")}\``;
    for (const r of group.sort((a, b) => a.name.localeCompare(b.name))) {
      const otherIn = r.otherIn.length ? r.otherIn.map(cell).join(", ") : "·";
      const returns = r.returns.map(cell).join(" / ");
      lines.push(
        `| \`${r.name}\` | ${capabilityCell(r.name, "Instant", r.acceptsInstant)} | ${capabilityCell(r.name, "ZonedDateTime", r.acceptsZoned)} | ${capabilityCell(r.name, "PlainDate", r.acceptsPlainDate)} | ${capabilityCell(r.name, "PlainTime", r.acceptsPlainTime)} | ${otherIn} | ${returns} |`,
      );
    }
    lines.push("");
  }

  return lines.join("\n");
}

function main() {
  const rows = collectRows();
  const mdx = render(rows);
  fs.writeFileSync(OUT_PATH, mdx);
  console.log(`✓ Wrote ${OUT_PATH} (${rows.length} functions)`);
}

main();
