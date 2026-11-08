import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { codeBlocks, runExample } from './reference-examples';

// fs.globSync needs Node 22; CI also tests Node 20.
const files = (dir: string, extension: string) =>
  readdirSync(dir)
    .filter((name) => name.endsWith(extension))
    .map((name) => `${dir}/${name}`);

// Pages whose examples are complete programs with exact `// result` comments.
const REFERENCE_SECTIONS = [
  'conversion',
  'formatting',
  'current-time',
  'boundaries',
  'rounding',
  'arithmetic',
  'comparison',
  'selection',
  'difference',
  'business-days',
  'intervals',
  'utilities'
];

const EXECUTABLE_PAGES = [
  'www/content/docs/date-fns.mdx',
  'www/content/docs/recipes.mdx',
  ...REFERENCE_SECTIONS.flatMap((section) => files(`www/content/docs/${section}`, '.mdx'))
];

describe('reference page examples', () => {
  it.each(EXECUTABLE_PAGES)('%s produces its documented results', async (page) => {
    const examples = codeBlocks(page).filter((block) => block.includes("'@gobrand/tiempo'"));
    const checks = (await Promise.all(examples.map(runExample))).flat();

    expect(checks.length).toBeGreaterThan(0);
    for (const check of checks) {
      expect(check.actual, check.line).toBe(check.expected);
    }
  });
});

describe('JSDoc examples', () => {
  const sources = files('src', '.ts').filter((file) => !file.endsWith('.test.ts'));

  it.each(sources)('%s does not contradict its result comments', async (file) => {
    const text = readFileSync(file, 'utf8');
    const blocks = [...text.matchAll(/```(?:ts|typescript)\n([\s\S]*?)```/g)].map((m) =>
      m[1]!.replace(/^\s*\* ?/gm, '')
    );

    for (const block of blocks) {
      let checks;
      try {
        checks = await runExample(block);
      } catch (error) {
        // Fragments may use names defined elsewhere; anything else is a broken example.
        expect(String(error)).toMatch(/is not defined/);
        continue;
      }
      for (const { line, expected, actual } of checks) {
        // Prose comments such as `// → 14:00` or `// ~0.67` are illustrations, not values.
        if (/^[→~]/.test(expected)) continue;
        expect(actual.startsWith(expected.replace(/[:,n]$/, '')), `${line} → ${actual}`).toBe(true);
      }
    }
  });
});
