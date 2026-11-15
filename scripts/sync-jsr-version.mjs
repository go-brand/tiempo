// npm runs this as the `version` lifecycle script, after it bumps package.json
// and before it commits, so jsr.json is released with the same version.
// Replace only the version string so the file keeps its formatting.
import { readFileSync, writeFileSync } from 'node:fs';

const { version } = JSON.parse(readFileSync('package.json', 'utf8'));
const jsr = readFileSync('jsr.json', 'utf8');
writeFileSync('jsr.json', jsr.replace(/"version": "[^"]*"/, `"version": "${version}"`));
