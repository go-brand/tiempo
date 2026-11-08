import * as ts from 'typescript';
import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { analyze } from './generate-capability-matrix';

function row(name: string) {
  const file = ts.createSourceFile(`${name}.ts`, readFileSync(`src/${name}.ts`, 'utf8'), ts.ScriptTarget.Latest, true);
  const declarations = file.statements.filter(ts.isFunctionDeclaration).filter(d => d.name?.text === name);
  return analyze(name, declarations, file);
}

it('includes epoch-number inputs without treating a format pattern as an input date', () => {
  expect(row('toInstant').otherIn).toContain('number');
  expect(row('toZonedTime').otherIn).toContain('number');
  expect(row('format').otherIn).not.toContain('string');
  expect(row('addDays').otherIn).not.toContain('number');
});

it('preserves individual overloads including timezone and return mapping', () => {
  const signatures = row('startOfMonth').signatures;
  expect(signatures).toContain('startOfMonth(input: PlainDate): PlainDate');
  expect(signatures).toContain('startOfMonth(input: PlainDate, timezone: Timezone): ZonedDateTime');
  expect(signatures).not.toContain('startOfMonth(input: Instant | ZonedDateTime | PlainDate, timezone?: Timezone): PlainDate | ZonedDateTime');
});
