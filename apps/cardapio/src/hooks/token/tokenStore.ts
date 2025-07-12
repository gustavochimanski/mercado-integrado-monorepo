// src/token/tokenStore.ts
let token: string | null = null;

export function setToken(newToken: string) {
  token = newToken;
  console.log("💾 Token salvo:", token);
}

export function getToken() {
  console.log("🔎 Token lido:", token);
  return token;
}

export function clearToken() {
  token = null;
  console.log("🧹 Token limpo");
}
