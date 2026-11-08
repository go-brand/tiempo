import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { build } from 'esbuild';

export interface ExampleCheck {
  line: string;
  expected: string;
  actual: string;
}

const STATEMENT =
  /^(?:(?:const|let|var|import|export|return|if|for|while|do|function|type|interface)\b|\}|\/\/)/;

/**
 * Rewrites `expression; // result` lines into recorded checks. The expected
 * value is a quoted string, an array literal, or the comment's first word.
 */
export function instrument(code: string): string {
  return code
    .split('\n')
    .map((line) => {
      const match = line.match(/^(\s*)([^\s].*?);\s*\/\/\s*(\S.*)$/);
      if (!match || STATEMENT.test(match[2]!)) return line;
      const [, indent, expression, comment] = match;
      const quoted = comment!.match(/^"([^"]*)"/);
      const expected = quoted
        ? quoted[1]!
        : comment!.startsWith('[')
          ? comment!
          : comment!.split(/\s/)[0]!;
      return `${indent}__check(${JSON.stringify(line.trim())}, () => (${expression}), ${JSON.stringify(expected)});`;
    })
    .join('\n');
}

export function codeBlocks(file: string): string[] {
  const text = readFileSync(file, 'utf8');
  return [...text.matchAll(/```(?:ts|typescript)\n([\s\S]*?)```/g)].map((m) => m[1]!);
}

/** Bundles one block against the source and returns every recorded check. */
export async function runExample(code: string): Promise<ExampleCheck[]> {
  const source = [
    "import { Temporal } from './src/shared/temporal';",
    "import * as tiempo from './src/index.ts';",
    // Continuation blocks rely on imports shown earlier on the same page.
    'Object.assign(globalThis, tiempo, { Temporal });',
    instrument(code.replaceAll("'@gobrand/tiempo'", "'./src/index.ts'"))
  ].join('\n');
  const bundle = await build({
    stdin: { contents: source, resolveDir: process.cwd(), loader: 'ts' },
    bundle: true,
    write: false,
    format: 'iife',
    platform: 'browser',
    logLevel: 'silent'
  });
  const checks: ExampleCheck[] = [];
  const context = {
    __check(line: string, evaluate: () => unknown, expected: string) {
      const value = evaluate();
      const actual = expected.startsWith('[') ? JSON.stringify(value) : String(value);
      checks.push({
        line,
        expected: expected.startsWith('[')
          ? JSON.stringify(JSON.parse(expected.replaceAll("'", '"')))
          : expected,
        actual
      });
    }
  };
  runInNewContext(bundle.outputFiles[0]!.text, context);
  return checks;
}
