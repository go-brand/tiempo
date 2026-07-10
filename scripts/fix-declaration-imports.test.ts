import { describe, expect, it } from 'vitest';
import { rewriteDeclarationImports } from './fix-declaration-imports';

describe('rewriteDeclarationImports', () => {
  it('adds JavaScript extensions to relative declaration imports and exports', () => {
    const declaration = [
      'import type { Timezone } from "./types";',
      'export { toInstant } from "./toInstant";',
      'type Lazy = import("./shared/temporal").Temporal;',
    ].join('\n');

    expect(rewriteDeclarationImports(declaration)).toBe(
      [
        'import type { Timezone } from "./types.js";',
        'export { toInstant } from "./toInstant.js";',
        'type Lazy = import("./shared/temporal.js").Temporal;',
      ].join('\n')
    );
  });

  it('leaves packages and existing extensions unchanged', () => {
    const declaration = [
      'import type { Temporal } from "@js-temporal/polyfill";',
      'export { toInstant } from "./toInstant.js";',
      'import data from "./data.json";',
    ].join('\n');

    expect(rewriteDeclarationImports(declaration)).toBe(declaration);
  });
});
