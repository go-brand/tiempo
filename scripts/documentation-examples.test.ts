import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { build } from 'esbuild';
import { expect, it } from 'vitest';

it.each([
  ['README.md', 'display', 'payload'],
  ['skills/tiempo/references/best-practices/utc-storage.md', 'display', 'payload'],
  ['skills/tiempo/references/best-practices/explicit-timezone.md', 'display'],
])('executes the documented example and verifies output comments in %s', async (file, ...variables) => {
  const text = readFileSync(file, 'utf8');
  const example = text.match(/```(?:typescript|ts)\n([\s\S]*?)```/)![1]!;
  const expected = variables.map(name => {
    const comment = example.match(new RegExp(`const ${name} = .*?//\\s*"([^"]+)"`));
    expect(comment, `${name} must document its output`).not.toBeNull();
    return comment![1];
  });
  const bundle = await build({
    stdin: {
      contents: example.replaceAll("'@gobrand/tiempo'", "'./src/index.ts'") + `\nglobalThis.outputs = [${variables.join(',')}];`,
      resolveDir: process.cwd(),
    },
    bundle: true, write: false, format: 'iife', platform: 'browser',
  });
  const context = { outputs: [] };
  runInNewContext(bundle.outputFiles[0]!.text, context);
  expect(context.outputs).toEqual(expected);
});

it.each([
  [0, '[dayCount, reversedCount, calendarDates, nextDay, isEarlier]', [2, -2, ['2026-10-10', '2026-10-11', '2026-10-12'], '2026-10-11', true]],
  [1, 'monthStarts', ['2026-01-01', '2026-02-01', '2026-03-01']],
] as const)('executes API conventions example %i', async (index, expression, expected) => {
  const text = readFileSync('www/content/docs/api-conventions.mdx', 'utf8');
  const examples = [...text.matchAll(/```ts\n([\s\S]*?)```/g)];
  const example = examples[index]![1]!;
  const bundle = await build({
    stdin: {
      contents: example.replaceAll("'@gobrand/tiempo'", "'./src/index.ts'") + `\nglobalThis.outputs = ${expression};`,
      resolveDir: process.cwd(),
    },
    bundle: true, write: false, format: 'iife', platform: 'browser',
  });
  const context = { outputs: [] };
  runInNewContext(bundle.outputFiles[0]!.text, context);
  expect(context.outputs).toEqual(expected);
});
