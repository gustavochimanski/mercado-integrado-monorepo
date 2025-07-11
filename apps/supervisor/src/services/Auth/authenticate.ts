// src/services/Auth/authenticate.ts

import axios from "axios";
import { deleteCookie, setCookie } from "cookies-next"; // ✅ funciona no client e server


export type LoginResponse = {
  token_type: string;
  type_user: string;
  access_token: string
};

const api = axios.create({
  baseURL: "https://mensuraapi.com.br",      
});


export async function loginService(
  username: string,
  password: string
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>(
    "/mensura/auth/token",
    { username, password }
  );
  

  // 🔐 Armazena em cookie para acesso universal (SSR + client)
  setCookie("access_token", data.access_token, {
    path: "/",            // acessível em todas as rotas
    maxAge: 60 * 25,      
    sameSite: "lax",
    secure: false,
  });

  return data;
}

export function logoutService(redirectToLogin = true) {
  // 1) Remove o cookie
  deleteCookie("access_token", { path: "/" });

  // 2) Se quiser, faça um full reload para forçar limpeza de estado e middleware
  if (redirectToLogin) {
    // Você pode redirecionar para '/login' ou apenas recarregar na raiz
    window.location.href = "/login";
  }
}
