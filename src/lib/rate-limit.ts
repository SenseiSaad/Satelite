/**
 * Simple in-memory per IP rate limit for the signup endpoint.
 *
 * This is a best effort guard. On serverless platforms each warm instance
 * keeps its own map, so the real ceiling is a multiple of MAX_HITS per minute.
 * That is enough to stop accidental resubmits and low volume abuse.
 * Swap this module for a DynamoDB backed counter if you need a global limit.
 */

const WINDOW_MS = 60_000;
const MAX_HITS = 5;
const MAX_TRACKED_IPS = 5_000;

const hits = new Map<string, number[]>();

/** Returns true when the request is allowed and records the hit. */
export function checkRateLimit(ip: string, now: number = Date.now()): boolean {
  const previous = hits.get(ip) ?? [];
  const recent = previous.filter((at) => now - at < WINDOW_MS);

  if (recent.length >= MAX_HITS) {
    hits.set(ip, recent);
    return false;
  }

  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > MAX_TRACKED_IPS) {
    for (const [key, timestamps] of hits) {
      if (timestamps.every((at) => now - at >= WINDOW_MS)) {
        hits.delete(key);
      }
    }
  }

  return true;
}

/** Test helper: clears all recorded hits. */
export function resetRateLimit(): void {
  hits.clear();
}
