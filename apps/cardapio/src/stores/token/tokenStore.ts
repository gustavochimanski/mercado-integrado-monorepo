// src/token/tokenStore.ts
const TOKEN_KEY = "userToken";

function loadFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function saveToStorage(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

function removeFromStorage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

export function setToken(newToken: string) {
  saveToStorage(newToken);
}

export function getToken(): string | null {
  return loadFromStorage();
}

export function clearToken() {
  removeFromStorage();
}
