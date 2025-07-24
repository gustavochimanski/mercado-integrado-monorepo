// src/services/auth/authenticate.ts
import axios from "axios";
import { setToken } from "../../stores/token/tokenStore";

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

  setToken(data.access_token); // ✅ 100% em memória

  return data;
}

export function logoutService(redirectToLogin = true) {
  if (redirectToLogin) {
    window.location.href = "/login";
  }
}
