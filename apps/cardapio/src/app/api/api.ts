import axios from "axios";
import { getApiBaseUrlClient } from "@cardapio/lib/api/getApiBaseUrl.client";

// ✅ Cria instância axios sem baseURL fixa
export const api = axios.create();

// ✅ Interceptor que atualiza baseURL dinamicamente antes de cada request
api.interceptors.request.use((config) => {
  if (!config.baseURL) {
    config.baseURL = getApiBaseUrlClient();
  }
  return config;
});
