import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => JSON.parse(readFileSync(path, 'utf8'));

describe('jsr.json', () => {
  it('publishes the same package and version as package.json', () => {
    const pkg = read('package.json');
    const jsr = read('jsr.json');
    expect(jsr.name).toBe(pkg.name);
    expect(jsr.version).toBe(pkg.version);
    expect(jsr.license).toBe(pkg.license);
  });
});
