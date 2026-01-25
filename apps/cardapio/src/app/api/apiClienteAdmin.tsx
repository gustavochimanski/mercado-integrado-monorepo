import { getCliente, clearCliente, getTokenCliente } from "@cardapio/stores/client/ClientStore"
import axios from "axios"
import { getCookie } from "cookies-next"

export const apiClienteAdmin = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

// Interceptor de request → adiciona o token
apiClienteAdmin.interceptors.request.use((config) => {
  // Tenta buscar do ClientStore primeiro, depois do cookie
  let superToken = getTokenCliente()
  
  // Se não encontrou no ClientStore, tenta buscar do cookie diretamente
  if (!superToken || superToken.trim() === "") {
    try {
      const cookieToken = getCookie("super_token")
      if (typeof cookieToken === "string" && cookieToken.trim()) {
        superToken = cookieToken.trim()
      }
    } catch (error) {
      // Ignora erros ao buscar cookie (pode acontecer em SSR)
      console.warn("Erro ao buscar token do cookie:", error)
    }
  }

  // Só adiciona o header se o token existir e não estiver vazio
  if (superToken && superToken.trim()) {
    config.headers = config.headers ?? {}
    config.headers["x-super-token"] = superToken.trim()
  } else {
    // Log de debug em desenvolvimento para identificar quando o token não está sendo enviado
    if (process.env.NODE_ENV === "development") {
      console.warn("[apiClienteAdmin] Token não encontrado para requisição:", config.url)
    }
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
