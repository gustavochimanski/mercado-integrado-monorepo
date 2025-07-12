// src/services/auth/authenticate.ts
import axios from "axios";
import { deleteCookie, setCookie } from "cookies-next";
import { setToken } from "../token/tokenStore";

export type LoginResponse = {
  token_type: string;
  type_user: string;
  access_token: string;
};

const api = axios.create({
  baseURL: "https://gerente.mensuraapi.com.br",
});

export async function loginService(
  username: string,
  password: string
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>(
    "/mensura/auth/token",
    { username, password }
  );

  // Salva token no cookie (fallback) + memória (realtime)
  setCookie("access_token", data.access_token, {
    path: "/",
    maxAge: 60 * 25,
    sameSite: "lax",
    secure: false, // deixe true em prod com HTTPS
  });

  setToken(data.access_token); // ✅ Salva também em memória

  return data;
}

export function logoutService(redirectToLogin = true) {
  deleteCookie("access_token", { path: "/" });

  if (redirectToLogin) {
    window.location.href = "/login";
  }
}
