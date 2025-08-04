// src/services/Auth/authenticate.ts

import { LoginRequest, TokenResponse } from "@supervisor/api";
import { mensuraApi } from "@supervisor/api/MensuraApi";
import { deleteCookie, setCookie } from "cookies-next"; // ✅ funciona no client e server


export type LoginResponse = {
  token_type: string;
  type_user: string;
  access_token: string
};

export async function loginService(
  username: string,
  password: string
): Promise<TokenResponse> {

  const data = await mensuraApi.auth.loginUsuarioAuthTokenPost({
    username,
    password
  } satisfies LoginRequest)
  

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
