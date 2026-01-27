"use client";

import { clearToken, getToken } from "@cardapio/stores/token/tokenStore";
import axios from "axios";

// ✅ Use variável de ambiente
const apiAdmin = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// ✅ Solicitar token imediatamente se estiver no modo supervisor
if (typeof window !== "undefined") {
  const urlParams = new URLSearchParams(window.location.search);
  const viaSupervisor = urlParams.get("via") === "supervisor";
  
  if (viaSupervisor && !getToken() && window.parent && window.parent !== window) {
    // Solicitar token do parent imediatamente
    window.parent.postMessage({ type: "ready_for_token" }, "*");
  }
}

apiAdmin.interceptors.request.use((config) => {
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
