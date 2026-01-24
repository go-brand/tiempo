/**
 * Generates TypeScript type definitions for all IANA timezones.
 *
 * Run with: pnpm generate:timezones
 *
 * This script uses Intl.supportedValuesOf('timeZone') to get all
 * IANA timezone identifiers supported by the JavaScript runtime.
 */

import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const timezones = Intl.supportedValuesOf('timeZone');

const content = `/**
 * Auto-generated IANA timezone identifiers.
 *
 * Generated from Intl.supportedValuesOf('timeZone')
 * Total: ${timezones.length} timezones
 *
 * To regenerate: pnpm generate:timezones
 *
 * @see https://www.iana.org/time-zones
 */
export type IANATimezone =
${timezones.map((tz) => `  | '${tz}'`).join('\n')}
  | (string & {});
`;

const outputPath = join(__dirname, '../src/types/iana-timezones.ts');
writeFileSync(outputPath, content);

console.log(`Generated ${timezones.length} timezone types to src/types/iana-timezones.ts`);
