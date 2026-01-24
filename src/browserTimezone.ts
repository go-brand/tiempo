/**
 * Get the browser/device timezone.
 *
 * Returns the IANA timezone identifier configured on the user's device.
 * This is primarily useful in client-side code (browsers, React Native).
 *
 * **Warning:** On servers, this returns the server's configured timezone
 * (often "UTC"), which is rarely what you want. For user-specific timezones
 * on the server, retrieve the timezone from user preferences or request headers.
 *
 * @returns The IANA timezone identifier (e.g., "America/New_York", "Europe/London")
 *
 * @example
 * ```typescript
 * import { toZonedTime, browserTimezone } from '@gobrand/tiempo';
 *
 * // Convert UTC to the user's local timezone
 * const userTime = toZonedTime("2025-01-20T20:00:00Z", browserTimezone());
 * ```
 */
export function browserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
