/**
 * Base URL for the Core API (and Socket.io) as seen from the browser.
 *
 * - If `NEXT_PUBLIC_API_URL` is set, it wins (fixed host/port).
 * - Otherwise, use the same hostname as the Next app with `NEXT_PUBLIC_API_PORT` (default 3001)
 *   so visiting http://YOUR_PUBLIC_IP:3000 calls http://YOUR_PUBLIC_IP:3001.
 */
export function getBackendOrigin() {
  const explicit = process.env.NEXT_PUBLIC_API_URL;
  if (explicit && explicit.trim()) {
    return explicit.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    const port = process.env.NEXT_PUBLIC_API_PORT || '3001';
    return `${window.location.protocol}//${window.location.hostname}:${port}`;
  }
  const port = process.env.NEXT_PUBLIC_API_PORT || '3001';
  return `http://127.0.0.1:${port}`;
}
