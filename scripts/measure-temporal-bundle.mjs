// Read-only experiment: compare the current browser bundle with a global-Temporal
// variant. This does not change package exports, runtime selection, or declarations.
import { build } from 'esbuild';
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const nativeOnly = {
  name: 'native-only-experiment',
  setup(builder) {
    builder.onLoad({ filter: /\/src\/shared\/temporal\.ts$/ }, ({ path }) => {
      const source = readFileSync(path, 'utf8');
      const importLine = 'import { Temporal as PolyfillTemporal } from "@js-temporal/polyfill";';
      if (!source.includes(importLine)) throw new Error('Temporal runtime import changed; update this experiment');
      return {
        contents: source.replace(importLine, 'const PolyfillTemporal = globalThis.Temporal;'),
        loader: 'ts',
      };
    });
  },
};

for (const [name, imports] of [['arithmetic', 'addDays,toInstant'], ['formatting', 'format,toInstant'], ['full', '*']]) {
  const contents = imports === '*' ? "export * from './src/index.ts';" : `export {${imports}} from './src/index.ts';`;
  for (const [mode, plugins] of [['bundled', []], ['native-only experiment', [nativeOnly]]]) {
    const result = await build({
      stdin: { contents, resolveDir: process.cwd() },
      bundle: true, write: false, format: 'esm', platform: 'browser',
      target: 'es2022', minify: true, plugins, metafile: true,
    });
    const bytes = result.outputFiles[0].contents;
    console.log(JSON.stringify({
      name, mode, bytes: bytes.length, gzip: gzipSync(bytes).length,
      polyfillModules: Object.keys(result.metafile.inputs).filter(path => path.includes('@js-temporal')).length,
    }));
  }
}
