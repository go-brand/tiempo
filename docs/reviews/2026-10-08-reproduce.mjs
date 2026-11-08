// Review probes for expected public behavior. These failed on reviewed commit
// 6219c0a and now serve as a source/built-package check. Run with: node --import tsx docs/reviews/2026-10-08-reproduce.mjs
// Optionally pass a freshly built dist/index.js path as the first argument.
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { pathToFileURL } from 'node:url';
import { Temporal as Polyfill } from '@js-temporal/polyfill';
import { build } from 'esbuild';

const root = new URL('../../', import.meta.url);
const target = process.argv[2]
  ? pathToFileURL(process.argv[2])
  : new URL('src/index.ts', root);
// Reproduce the shipped implementation choice even if the calling shell has
// enabled the native-only test configuration.
process.env.TIEMPO_TEMPORAL = 'polyfill';
const tiempo = await import(target.href);
let failures = 0;
let probes = 0;
let compatibilityFailures = 0;

async function probe(name, expected, read, kind = 'contract') {
  probes++;
  try {
    const actual = await read();
    assert.deepEqual(actual, expected);
    console.log(JSON.stringify({ name, kind, status: 'pass' }));
  } catch (error) {
    failures++;
    if (kind === 'compatibility') compatibilityFailures++;
    console.log(JSON.stringify({
      name,
      kind,
      status: 'fail',
      expected,
      ...('actual' in error ? { actual: error.actual } : { error: error.message }),
    }));
  }
}

const zoned = Polyfill.ZonedDateTime.from('2025-01-20T15:00-05:00[America/New_York]');

const bundle = await build({
    absWorkingDir: root.pathname,
    entryPoints: [target.pathname],
    bundle: true,
    write: false,
    platform: 'browser',
    format: 'iife',
    globalName: 'tiempo',
    logLevel: 'silent',
});
await probe('browser import without a process shim', 'imports successfully', () => {
  vm.runInNewContext(bundle.outputFiles[0].text, {});
  return 'imports successfully';
});
await probe('control: browser bundle works with a process shim', '2025-01-01T00:00:00Z', () => {
  const context = { process: { env: {} } };
  vm.runInNewContext(bundle.outputFiles[0].text, context);
  return context.tiempo.toInstant('2025-01-01T00:00Z').toString();
}, 'control');
await probe('control: documented polyfill comparison works', true, () =>
  tiempo.isBefore(zoned, zoned.add({ hours: 1 })), 'control');

// Native inputs are a known interoperability limitation, not a documented
// guarantee of the default polyfill path. Keep these separate from defects.
if (globalThis.Temporal) {
  const nativeZoned = globalThis.Temporal.ZonedDateTime.from(zoned.toString());
  await probe('native isBefore', true, () =>
    tiempo.isBefore(nativeZoned, nativeZoned.add({ hours: 1 })), 'compatibility');
  await probe('native isPast', true, () => tiempo.isPast(nativeZoned), 'compatibility');
  await probe('native eachHourOfInterval', 2, () =>
    tiempo.eachHourOfInterval({ start: nativeZoned, end: nativeZoned.add({ hours: 1 }) }).length,
    'compatibility');
} else {
  console.log(JSON.stringify({ status: 'skip', reason: 'native Temporal is unavailable' }));
}

const midnightGap = Polyfill.ZonedDateTime.from('2025-09-07T12:00[America/Santiago]');
await probe('endOfDay after skipped midnight',
  '2025-09-07T23:59:59.999999999-03:00[America/Santiago]',
  () => tiempo.endOfDay(midnightGap).toString());
await probe('endOfWeek after skipped Sunday midnight',
  '2025-09-07T23:59:59.999999999-03:00[America/Santiago]',
  () => tiempo.endOfWeek(midnightGap).toString());

// Intl may spell the timezone name differently on another ICU build. Assert
// that the token is exactly its requested part, independent of that spelling.
const zoneName = new Intl.DateTimeFormat('en-US', {
  timeZone: zoned.timeZoneId, timeZoneName: 'short',
}).formatToParts(zoned.epochMilliseconds).find(part => part.type === 'timeZoneName').value;
const era = new Intl.DateTimeFormat('en-US', {
  timeZone: zoned.timeZoneId, era: 'short',
}).formatToParts(zoned.epochMilliseconds).find(part => part.type === 'era').value;
await probe('format timezone token', zoneName, () => tiempo.format(zoned, 'z'));
await probe('format era token', era, () => tiempo.format(zoned, 'G'));
await probe('formatPlainDate era token', era, () => tiempo.formatPlainDate(zoned.toPlainDate(), 'G'));

const earlier = Polyfill.Instant.from('2025-01-01T00:00:00.000999999Z');
const later = earlier.add({ nanoseconds: 1 });
await probe('truncate elapsed milliseconds after subtracting', 0, () =>
  tiempo.differenceInMilliseconds(later, earlier));
await probe('fractional seconds retain submillisecond precision', 1e-9, () =>
  tiempo.differenceInSeconds(later, earlier, { fractional: true }));
await probe('whole seconds truncate an interval shorter than one second', 0, () =>
  tiempo.differenceInSeconds(earlier.add({ nanoseconds: 999000001 }), earlier));

await probe('eachDayOfInterval skips nonexistent Apia date', [
  '2011-12-29T00:00:00-10:00[Pacific/Apia]',
  '2011-12-31T00:00:00+14:00[Pacific/Apia]',
], () => tiempo.eachDayOfInterval({
  start: Polyfill.ZonedDateTime.from('2011-12-29T12:00[Pacific/Apia]'),
  end: Polyfill.ZonedDateTime.from('2011-12-31T12:00[Pacific/Apia]'),
}).map(value => value.toString()));

await probe('eachHourOfInterval includes later local hour boundaries after 30-minute DST',
  ['03:00:00', '04:00:00'], () => tiempo.eachHourOfInterval({
    start: Polyfill.ZonedDateTime.from('2025-10-05T00:15[Australia/Lord_Howe]'),
    end: Polyfill.ZonedDateTime.from('2025-10-05T04:15[Australia/Lord_Howe]'),
  }).filter(value => value.hour >= 3).map(value => value.toPlainTime().toString()));

await probe('reversed interval within the same day is empty', [], () =>
  tiempo.eachDayOfInterval({ start: zoned.add({ hours: 1 }), end: zoned })
    .map(value => value.toString()));

await probe('historical XXXXX offset has integer components', '+00:09:21', () =>
  tiempo.format(Polyfill.ZonedDateTime.from('1900-01-01T12:00[Europe/Paris]'), 'XXXXX'));

console.log(JSON.stringify({ target: target.href, probes, failures, compatibilityFailures }));
process.exitCode = failures ? 1 : 0;
