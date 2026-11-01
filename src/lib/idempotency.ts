/**
 * Portfolio Pro - Order Idempotency & Replay Protection Engine
 * Prevents duplicate financial transactions from network retries or double-clicks.
 */

import crypto from "crypto";

const processedKeys = new Map<string, { timestamp: number; result: any }>();
const EXPIRATION_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Computes a unique deterministic signature for an order
 */
export function generateOrderFingerprint(params: {
  clientPan: string;
  fundId: string;
  orderType: string;
  amount?: number;
  units?: number;
}): string {
  const raw = `${params.clientPan.toUpperCase()}|${params.fundId}|${params.orderType}|${params.amount || 0}|${params.units || 0}`;
  return crypto.createHash("sha256").update(raw).digest("hex");
}

/**
 * Checks if a transaction has already been submitted or completed
 */
export function checkIdempotency(key: string): { isDuplicate: boolean; cachedResult?: any } {
  // Prune expired keys
  const now = Date.now();
  processedKeys.forEach((v, k) => {
    if (now - v.timestamp > EXPIRATION_WINDOW_MS) {
      processedKeys.delete(k);
    }
  });

  const existing = processedKeys.get(key);
  if (existing) {
    return { isDuplicate: true, cachedResult: existing.result };
  }

  return { isDuplicate: false };
}

/**
 * Stores the result of a processed order against the idempotency key
 */
export function recordIdempotency(key: string, result: any) {
  processedKeys.set(key, { timestamp: Date.now(), result });
}
