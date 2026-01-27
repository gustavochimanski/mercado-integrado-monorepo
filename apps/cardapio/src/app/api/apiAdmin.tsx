"use client";

import { clearToken, getToken } from "@cardapio/stores/token/tokenStore";
import axios from "axios";
import { getApiBaseUrlClient } from "@cardapio/lib/api/getApiBaseUrl.client";

// ✅ Cria instância axios sem baseURL fixa
const apiAdmin = axios.create();

// ✅ Solicitar token imediatamente se estiver no modo supervisor
if (typeof window !== "undefined") {
  const urlParams = new URLSearchParams(window.location.search);
  const viaSupervisor = urlParams.get("via") === "supervisor";
  
  if (viaSupervisor && !getToken() && window.parent && window.parent !== window) {
    // Solicitar token do parent imediatamente
    window.parent.postMessage({ type: "ready_for_token" }, "*");
  }
}

// ✅ Interceptor que atualiza baseURL dinamicamente e adiciona token de autenticação
apiAdmin.interceptors.request.use((config) => {
  // Atualiza baseURL dinamicamente
  if (!config.baseURL) {
    config.baseURL = getApiBaseUrlClient();
  }
  
  // Adiciona token de autenticação
  const token = getToken(); // ✅ vem da memória
  if (token && typeof token === "string") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiAdmin.interceptors.response.use(
  (res) => res,
  (error) => {
    // Se token expirar/for inválido, derruba token local e deixa o app exibir login de novo
    const status = error?.response?.status;
    if (status === 401) {
      try {
        clearToken();
      } catch {
        // ignore
      }
    }
    return Promise.reject(error);
  }
);

export default apiAdmin;
