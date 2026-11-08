import { build } from 'esbuild';
import { runInNewContext } from 'node:vm';
import { expect, it } from 'vitest';

it('loads a browser bundle and converts a timestamp without Node globals', async () => {
  const result = await build({
    stdin: {
      contents: `import { toInstant } from './src/index.ts'; globalThis.result = toInstant('2025-01-01T00:00Z').toString();`,
      resolveDir: process.cwd(),
    },
    bundle: true,
    write: false,
    platform: 'browser',
    format: 'iife',
  });
  for (const context of [{ result: '' }, { result: '', process: { env: {} } }]) {
    runInNewContext(result.outputFiles[0]!.text, context);
    expect(context.result).toBe('2025-01-01T00:00:00Z');
  }
});
