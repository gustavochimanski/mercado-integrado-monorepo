import { getCliente, clearCliente } from "@cardapio/stores/client/ClientStore"
import axios from "axios"

export const apiClienteAdmin = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

// Interceptor de request → adiciona o token
apiClienteAdmin.interceptors.request.use((config) => {
  const cliente = getCliente()

  if (cliente?.tokenCliente) {
    config.headers = config.headers ?? {}
    config.headers["x-super-token"] = cliente.tokenCliente
  }

  return config
})

// Interceptor de response → trata erro 401
apiClienteAdmin.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      clearCliente()
      if (typeof window !== "undefined") {
        window.location.href = "/"
      }
    }
    return Promise.reject(error)
  }
)
