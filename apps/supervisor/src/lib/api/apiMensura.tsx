// src/lib/api/apiMensura.ts
"use client";

import axios, { AxiosError, AxiosResponse } from "axios";
import { getCookie } from "cookies-next";

const apiMensura = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptor de request
apiMensura.interceptors.request.use((config) => {
  // pega o token do cookie (funciona no client)
  const token = getCookie("access_token");
  if (token && typeof token === "string") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de response para tratar 401
apiMensura.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Se for 401 e não for uma tentativa de reautenticação
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Verificar se estamos no client-side
        if (typeof window !== "undefined") {
          // Importar dinamicamente para evitar problemas de SSR
          const { useReauthContext } = await import("@supervisor/providers/ReauthProvider");
          
          // Tentar reautenticação
          const reauthSuccess = await window.showReauthModal?.();
          
          if (reauthSuccess) {
            // Refazer a requisição original
            return apiMensura(originalRequest);
          } else {
            // Falha na reautenticação, redirecionar para login
            window.location.href = "/login";
          }
        }
      } catch (reauthError) {
        console.error("Erro na reautenticação:", reauthError);
        // Em caso de erro, redirecionar para login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiMensura;
