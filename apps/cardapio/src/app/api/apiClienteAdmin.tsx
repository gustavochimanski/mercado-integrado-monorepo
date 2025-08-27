import { getCliente } from "@cardapio/stores/client/ClientStore";
import axios from "axios";

export const apiClienteAdmin = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiClienteAdmin.interceptors.request.use((config) => {
  const cliente = getCliente();
  console.log("Token cliente:", cliente?.tokenCliente);
  if (cliente?.tokenCliente) {
    config.headers = config.headers ?? {};
    (config.headers as any)["x-super-token"] = cliente.tokenCliente;
  }
  return config;
});
