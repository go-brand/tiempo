// Run after `pnpm build`: verify package exports and declarations as an installed consumer.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { build } from 'esbuild';
import { runInNewContext } from 'node:vm';

const root = process.cwd();
const directory = mkdtempSync(join(tmpdir(), 'tiempo-consumer-'));
try {
  execFileSync('pnpm', ['pack', '--pack-destination', directory], { cwd: root, stdio: 'pipe' });
  const archive = readdirSync(directory).find((file) => file.endsWith('.tgz'));
  assert(archive, 'pnpm pack must produce a tarball');
  writeFileSync(join(directory, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
  execFileSync(
    'npm',
    ['install', '--ignore-scripts', '--no-audit', '--no-fund', join(directory, archive)],
    {
      cwd: directory,
      stdio: 'pipe'
    }
  );
  const consumer = readFileSync(join(root, 'smoke/consumer.ts'), 'utf8').replace(
    "'../dist/index.js'",
    "'@gobrand/tiempo'"
  );
  writeFileSync(join(directory, 'consumer.ts'), consumer);
  writeFileSync(
    join(directory, 'native-consumer.ts'),
    [
      "import { addDays, format, toInstant, toZonedTime } from '@gobrand/tiempo/native';",
      "const instant = toInstant('2025-01-20T20:00:00Z');",
      "const next = addDays(toZonedTime(instant, 'America/New_York'), 1);",
      "if (format(next, 'yyyy-MM-dd HH:mm') !== '2025-01-21 15:00') {",
      "  throw new Error('Native subpath formatting failed');",
      '}'
    ].join('\n')
  );
  for (const [module, moduleResolution] of [
    ['NodeNext', 'NodeNext'],
    ['ESNext', 'Bundler']
  ]) {
    writeFileSync(
      join(directory, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: {
          strict: true,
          skipLibCheck: false,
          target: 'ES2022',
          module,
          moduleResolution,
          outDir: 'out',
          types: []
        },
        include: ['consumer.ts', 'native-consumer.ts']
      })
    );
    execFileSync(
      process.execPath,
      [resolve('node_modules/typescript/bin/tsc'), '-p', join(directory, 'tsconfig.json')],
      {
        cwd: root,
        stdio: 'pipe'
      }
    );
    execFileSync(process.execPath, [join(directory, 'out/consumer.js')], { stdio: 'pipe' });
    if ('Temporal' in globalThis) {
      execFileSync(process.execPath, [join(directory, 'out/native-consumer.js')], {
        stdio: 'pipe'
      });
    }
  }
  const bundle = await build({
    stdin: {
      contents: `import { toInstant } from '@gobrand/tiempo'; globalThis.result = toInstant(0).toString();`,
      resolveDir: directory
    },
    bundle: true,
    write: false,
    platform: 'browser',
    format: 'iife',
    minify: true
  });
  const context = {};
  runInNewContext(bundle.outputFiles[0].text, context);
  assert.equal(context.result, '1970-01-01T00:00:00Z');

  const nativeBundle = await build({
    stdin: {
      contents: `import { addDays, toInstant } from '@gobrand/tiempo/native'; globalThis.result = addDays(toInstant(0), 1).toString();`,
      resolveDir: directory
    },
    bundle: true,
    write: false,
    platform: 'browser',
    format: 'iife',
    minify: true,
    metafile: true
  });
  const polyfillInputs = Object.keys(nativeBundle.metafile.inputs).filter((file) =>
    file.includes('@js-temporal')
  );
  assert.equal(polyfillInputs.length, 0, '@gobrand/tiempo/native must not bundle the polyfill');
  if ('Temporal' in globalThis) {
    const nativeContext = {};
    runInNewContext(nativeBundle.outputFiles[0].text, nativeContext);
    assert.equal(nativeContext.result, '1970-01-02T00:00:00+00:00[UTC]');
  }
  const missingContext = { Temporal: undefined };
  assert.throws(
    () => runInNewContext(nativeBundle.outputFiles[0].text, missingContext),
    /@gobrand\/tiempo\/native needs a runtime with built-in Temporal/
  );
  console.log(
    '✓ installed tarball: ESM, NodeNext/Bundler declarations, minified browser consumer (default + /native)'
  );
} catch (error) {
  if (error.stdout) process.stderr.write(error.stdout);
  if (error.stderr) process.stderr.write(error.stderr);
  throw error;
} finally {
  rmSync(directory, { recursive: true, force: true });
}
