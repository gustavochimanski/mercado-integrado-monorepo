// utils/storageWithExpiry.ts
// Simple localStorage wrapper that supports expiry (ms)
const isClient = typeof window !== "undefined";

export function setWithExpiry(key: string, value: any, ttlMs: number) {
  if (!isClient) return;
  const item = {
    value,
    expiresAt: Date.now() + ttlMs,
  };
  try {
    localStorage.setItem(key, JSON.stringify(item));
  } catch {
    // ignore storage errors
  }
}

export function getWithExpiry<T = any>(key: string): T | null {
  if (!isClient) return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const item = JSON.parse(raw) as { value: T; expiresAt?: number };
    if (!item.expiresAt) {
      // no expiry set — treat as present
      return item.value;
    }
    if (Date.now() > item.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  } catch {
    try {
      localStorage.removeItem(key);
    } catch {}
    return null;
  }
}

export function removeWithExpiry(key: string) {
  if (!isClient) return;
  try {
    localStorage.removeItem(key);
  } catch {}
}

