import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts', '!src/**/__tests__/**', '!src/**/*.test.ts', '!src/**/*.spec.ts'],
  format: ['esm'],
  target: 'es2022',
  sourcemap: true,

  /**
   * Do not use tsdown for generating d.ts files because it can not generate type
   * the definition maps required for go-to-definition to work in our IDE. We
   * use tsc for that.
   */
});
