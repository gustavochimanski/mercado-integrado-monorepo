// src/lib/api/apiMensura.ts
"use client";

import { getToken, setToken } from "@packs/auth/src/tokenStore";
import axios from "axios";

const apiAdmin = axios.create({
  baseURL: "https://gerente.mensuraapi.com.br",
});

apiAdmin.interceptors.request.use((config) => {
  const token = getToken(); // ✅ vem da memória
  if (token && typeof token === "string") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiAdmin;"use client";

import { useEffect } from "react";

export function useReceiveTokenFromParent() {
  useEffect(() => {
    window.parent.postMessage({ type: "ready_for_token" }, "*");

    const listener = (event: MessageEvent) => {
      const { type, token } = event.data || {};
      if (type === "auth_token" && token) {
        console.log("🔐 Token recebido:", token);
        setToken(token); 
      }
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, []);
}

