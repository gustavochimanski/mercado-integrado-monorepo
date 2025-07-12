let token: string | null = null;

export function setToken(newToken: string) {
  token = newToken;
  console.log("💾 Token salvo na memória:", token);
}

export function getToken() {
  console.log("🔎 Lendo token da memória:", token);
  return token;
}
