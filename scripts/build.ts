// Compiles src/ to ESM in dist/: one entry per source file, shared code split
// into chunks, dependencies left as imports. Also builds the zero-polyfill
// @gobrand/tiempo/native entry into dist/native/index.js. Declarations come from tsc.
import { readFileSync, readdirSync, rmSync } from 'node:fs';
import { build, type Plugin } from 'esbuild';

const entryPoints = readdirSync('src', { recursive: true, encoding: 'utf8' })
  .filter(
    (file) =>
      file.endsWith('.ts') &&
      !/\.(test|spec)\.ts$/.test(file) &&
      file !== 'shared/nativeTemporal.ts'
  )
  .map((file) => `src/${file}`);

const nativeTemporalPlugin: Plugin = {
  name: 'native-temporal',
  setup(buildContext) {
    const polyfillImport = "import { Temporal as PolyfillTemporal } from '@js-temporal/polyfill';";
    buildContext.onLoad({ filter: /[/\\]src[/\\]shared[/\\]temporal\.ts$/ }, ({ path }) => {
      const source = readFileSync(path, 'utf8');
      if (!source.includes(polyfillImport)) {
        throw new Error('Expected polyfill import in src/shared/temporal.ts');
      }
      return {
        contents: source.replace(
          polyfillImport,
          "import { Temporal as PolyfillTemporal } from './nativeTemporal';"
        ),
        loader: 'ts'
      };
    });
  }
};

rmSync('dist', { recursive: true, force: true });

await Promise.all([
  build({
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
  }),
  build({
    entryPoints: ['src/index.ts'],
    outfile: 'dist/native/index.js',
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    target: 'es2022',
    sourcemap: true,
    logLevel: 'warning',
    plugins: [nativeTemporalPlugin]
  })
]);
