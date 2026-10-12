/**
 * Admin Authentication and Convenience Passcode Gate
 *
 * NOTE FOR OPERATORS:
 * This passcode lock is a client-side convenience lock designed to prevent accidental
 * edits or casual browsing by unauthorized personnel on shared or public devices.
 * It is NOT enterprise-grade backend server security, as assets and data are stored
 * locally in the browser runtime.
 */

import { getContent, saveContent, resetContent } from '@/lib/contentStorage';

export const CONVENIENCE_LOCK_NOTE =
  "Note: This passcode is a client-side convenience lock to prevent accidental edits or casual browsing. It is not enterprise-grade server security.";

const PASSCODE_STORAGE_KEY = 'admin.auth.passcodeHash';
const SESSION_AUTH_KEY = 'santa_admin_authenticated_session';
const PASSCODE_SALT = 'santa-towing-passcode-salt-2026:';

/**
 * Hash a passcode using SHA-256 via the Web Crypto API
 */
export async function hashPasscode(passcode: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(PASSCODE_SALT + passcode.trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Returns whether an admin passcode has already been configured in content storage
 */
export function hasPasscode(): boolean {
  const content = getContent();
  const hash = content[PASSCODE_STORAGE_KEY];
  return typeof hash === 'string' && hash.length > 0;
}

/**
 * Sets a new admin passcode by computing its SHA-256 hash and saving via contentStorage
 */
export async function setPasscode(passcode: string): Promise<boolean> {
  if (!passcode || passcode.trim().length === 0) {
    return false;
  }
  const hash = await hashPasscode(passcode);
  return saveContent(PASSCODE_STORAGE_KEY, hash);
}

/**
 * Verifies if the provided passcode matches the stored hash
 */
export async function verifyPasscode(passcode: string): Promise<boolean> {
  const content = getContent();
  const storedHash = content[PASSCODE_STORAGE_KEY];
  if (!storedHash || typeof storedHash !== 'string') {
    return false;
  }
  const computedHash = await hashPasscode(passcode);
  return computedHash === storedHash;
}

/**
 * Checks if the current browser session is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return window.sessionStorage.getItem(SESSION_AUTH_KEY) === 'true';
}

/**
 * Starts an authenticated admin session
 */
export function loginSession(): void {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
    window.dispatchEvent(new Event('santa_admin_auth_changed'));
  }
}

/**
 * Ends the authenticated admin session
 */
export function logoutSession(): void {
  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem(SESSION_AUTH_KEY);
    window.dispatchEvent(new Event('santa_admin_auth_changed'));
  }
}

/**
 * Clears the stored passcode hash and resets the session
 */
export function resetStoredPasscode(): boolean {
  logoutSession();
  return resetContent(PASSCODE_STORAGE_KEY);
}
