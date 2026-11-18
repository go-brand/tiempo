// Compiles src/ to ESM in dist/: one entry per source file, shared code split
// into chunks, dependencies left as imports. Declarations come from tsc.
import { readdirSync, rmSync } from 'node:fs';
import { build } from 'esbuild';

const entryPoints = readdirSync('src', { recursive: true, encoding: 'utf8' })
  .filter((file) => file.endsWith('.ts') && !/\.(test|spec)\.ts$/.test(file))
  .map((file) => `src/${file}`);

rmSync('dist', { recursive: true, force: true });

await build({
  entryPoints,
  outdir: 'dist',
  outbase: 'src',
  bundle: true,
  splitting: true,
  format: 'esm',
  platform: 'node',
  target: 'es2022',
  packages: 'external',
  sourcemap: true,
  logLevel: 'warning'
});
