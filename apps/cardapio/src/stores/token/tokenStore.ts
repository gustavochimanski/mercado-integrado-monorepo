// src/stores/token/tokenStore.ts
import { setWithExpiry, getWithExpiry, removeWithExpiry } from "../../utils/storageWithExpiry";

const TOKEN_KEY = "userToken";
const MS_30_DAYS = 30 * 24 * 60 * 60 * 1000;

export function setToken(newToken: string) {
  if (!newToken) return;
  setWithExpiry(TOKEN_KEY, newToken, MS_30_DAYS);
}

export function getToken(): string | null {
  return getWithExpiry<string>(TOKEN_KEY);
}

export function clearToken() {
  removeWithExpiry(TOKEN_KEY);
}
