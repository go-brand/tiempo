import * as fs from 'node:fs';
import * as path from 'node:path';
import { pathToFileURL } from 'node:url';

const relativeDeclarationImport =
  /((?:\bfrom\s+|\bimport\s*\()\s*)(["'])(\.\.?\/[^"']+)\2/g;

function withJavaScriptExtension(specifier: string): string {
  return path.posix.extname(specifier) === '' ? `${specifier}.js` : specifier;
}

export function rewriteDeclarationImports(content: string): string {
  return content.replace(
    relativeDeclarationImport,
    (_, prefix: string, quote: string, specifier: string) =>
      `${prefix}${quote}${withJavaScriptExtension(specifier)}${quote}`
  );
}

function declarationFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return declarationFiles(entryPath);
    return entry.name.endsWith('.d.ts') ? [entryPath] : [];
  });
}

function main(): void {
  const distDirectory = path.resolve('dist');
  let updatedFiles = 0;

  for (const file of declarationFiles(distDirectory)) {
    const original = fs.readFileSync(file, 'utf8');
    const rewritten = rewriteDeclarationImports(original);
    if (rewritten === original) continue;

    fs.writeFileSync(file, rewritten);
    updatedFiles++;
  }

  console.log(`✓ Fixed relative imports in ${updatedFiles} declaration files`);
}

const entryPath = process.argv[1] ? path.resolve(process.argv[1]) : undefined;
if (entryPath && import.meta.url === pathToFileURL(entryPath).href) {
  main();
}
