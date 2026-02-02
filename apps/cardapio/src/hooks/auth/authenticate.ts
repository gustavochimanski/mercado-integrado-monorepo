// src/services/auth/authenticate.ts
import axios from "axios";
import { setToken } from "../../stores/token/tokenStore";
import { getApiBaseUrlClient } from "@cardapio/lib/api/getApiBaseUrl.client";

export type LoginResponse = {
  token_type: string;
  type_user: string;
  access_token: string;
};

const api = axios.create();

// ✅ Interceptor que atualiza baseURL dinamicamente antes de cada request
api.interceptors.request.use((config) => {
  if (!config.baseURL) {
    config.baseURL = getApiBaseUrlClient();
  }
  return config;
});

export async function loginService(
  username: string,
  password: string
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>(
    "api/auth/token",
    { username, password }
  );

  setToken(data.access_token); // ✅ 100% em memória

  return data;
}

export function logoutService(redirectToLogin = true) {
  if (redirectToLogin) {
    // Importante: NÃO “zerar” tenant/empresa no logout.
    // Manter a URL atual e dar reload garante que:
    // - o tenant do path/query continua valendo
    // - a empresa (localStorage) não some
    try {
      window.location.reload();
    } catch {
      window.location.href = "/";
    }
  }
}
