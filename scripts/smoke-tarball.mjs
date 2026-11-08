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
  const archive = readdirSync(directory).find(file => file.endsWith('.tgz'));
  assert(archive, 'pnpm pack must produce a tarball');
  writeFileSync(join(directory, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
  execFileSync('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', join(directory, archive)], {
    cwd: directory, stdio: 'pipe',
  });
  const consumer = readFileSync(join(root, 'smoke/consumer.ts'), 'utf8')
    .replace("'../dist/index.js'", "'@gobrand/tiempo'");
  writeFileSync(join(directory, 'consumer.ts'), consumer);
  for (const [module, moduleResolution] of [['NodeNext', 'NodeNext'], ['ESNext', 'Bundler']]) {
    writeFileSync(join(directory, 'tsconfig.json'), JSON.stringify({
      compilerOptions: {
        strict: true, skipLibCheck: false, target: 'ES2022',
        module, moduleResolution, outDir: 'out', types: [],
      },
      include: ['consumer.ts'],
    }));
    execFileSync(process.execPath, [resolve('node_modules/typescript/bin/tsc'), '-p', join(directory, 'tsconfig.json')], {
      cwd: root, stdio: 'pipe',
    });
    execFileSync(process.execPath, [join(directory, 'out/consumer.js')], { stdio: 'pipe' });
  }
  const bundle = await build({
    stdin: {
      contents: `import { toInstant } from '@gobrand/tiempo'; globalThis.result = toInstant(0).toString();`,
      resolveDir: directory,
    },
    bundle: true, write: false, platform: 'browser', format: 'iife', minify: true,
  });
  const context = {};
  runInNewContext(bundle.outputFiles[0].text, context);
  assert.equal(context.result, '1970-01-01T00:00:00Z');
  console.log('✓ installed tarball: ESM, NodeNext/Bundler declarations, minified browser consumer');
} catch (error) {
  if (error.stdout) process.stderr.write(error.stdout);
  if (error.stderr) process.stderr.write(error.stderr);
  throw error;
} finally {
  rmSync(directory, { recursive: true, force: true });
}
