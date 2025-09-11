import { getCliente, clearCliente } from "@cardapio/stores/client/ClientStore";
import axios from "axios";

export const apiClienteAdmin = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptor de requisição adiciona o super token
apiClienteAdmin.interceptors.request.use((config) => {
  const cliente = getCliente();
  if (cliente?.tokenCliente) {
    config.headers = config.headers ?? {};
    (config.headers as any)["x-super-token"] = cliente.tokenCliente;
  }
  return config;
});

// Interceptor de resposta para capturar 401 e limpar cliente
apiClienteAdmin.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Token inválido ou expirado. Limpando cliente...");
      clearCliente(); // remove cache e localStorage
    }
    return Promise.reject(error);
  }
);
