import type { IANATimezone } from './types/iana-timezones';

/**
 * Timezone identifier.
 *
 * Includes all IANA timezone identifiers with full autocomplete support,
 * plus a string fallback for forward compatibility with new timezones.
 *
 * @example
 * ```typescript
 * const tz1: Timezone = 'America/New_York'; // Autocomplete works!
 * const tz2: Timezone = 'Europe/London';
 * const tz3: Timezone = 'UTC';
 * ```
 */
export type Timezone = 'UTC' | IANATimezone;

export type { IANATimezone };
