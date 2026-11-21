import * as fs from 'node:fs';
import { defineConfig } from 'tsup';

const nativeTemporalPlugin = {
  name: 'native-temporal',
  setup(build: {
    onLoad: (
      options: { filter: RegExp },
      callback: (args: { path: string }) => { contents: string; loader: 'ts' }
    ) => void;
  }) {
    const polyfillImport = "import { Temporal as PolyfillTemporal } from '@js-temporal/polyfill';";
    build.onLoad({ filter: /[/\\]src[/\\]shared[/\\]temporal\.ts$/ }, ({ path: filePath }) => {
      const source = fs.readFileSync(filePath, 'utf8');
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

export default defineConfig(() => {
  fs.rmSync('dist', { recursive: true, force: true });

  return [
    {
      entry: [
        'src/**/*.ts',
        '!src/**/__tests__/**',
        '!src/**/*.test.ts',
        '!src/**/*.spec.ts',
        '!src/shared/nativeTemporal.ts'
      ],
      format: ['esm'],
      target: 'es2022',
      sourcemap: true,
      clean: false
      /**
       * Do not use tsdown for generating d.ts files because it can not generate
       * the definition maps required for go-to-definition to work in our IDE. We
       * use tsc for that.
       */
    },
    {
      entry: ['src/index.ts'],
      outDir: 'dist/native',
      format: ['esm'],
      target: 'es2022',
      sourcemap: true,
      clean: false,
      esbuildPlugins: [nativeTemporalPlugin]
    }
  ];
});
