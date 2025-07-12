// src/lib/auth/tokenStore.ts
let token: string | null = null;

export function setToken(newToken: string) {
  token = newToken;
}

export function getToken() {
  return token;
}
