// src/context/UserContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";
import { getToken, setToken, clearToken } from "../../stores/token/tokenStore";
import { loginService, logoutService } from "./authenticate";
import { useReceiveTokenFromParent } from "../../stores/token/UseReceiveTokenFromParent";
import { getTokenCliente } from "../../stores/client/ClientStore";
import { getCookie } from "cookies-next";

// Instância axios com baseURL configurada
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export interface User {
  id: string;
  username: string;
  type_user: string;
}

interface UserContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isUser: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Memoiza a função pra não recriar em cada render
  const fetchUser = useCallback(async () => {
    // Pequeno delay para garantir que cookies foram persistidos
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Primeiro tenta o token normal (admin)
    let token = getToken();
    let headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else {
      // Se não tiver token normal, tenta usar o super_token do cliente
      // Tenta do cookie primeiro (mais rápido após salvar)
      const cookieToken = getCookie("super_token");
      const storeToken = getTokenCliente();
      const superToken = (typeof cookieToken === "string" ? cookieToken : null) || storeToken;
      
      if (superToken && superToken.trim()) {
        // Também pode precisar do header x-super-token
        headers["x-super-token"] = superToken;
        token = superToken;
      }
    }

    if (!token) {
      setUser(null);
      return;
    }

    try {
      // Usa a instância axios com baseURL já configurada (igual ao authenticate.ts)
      const res = await api.get<User>("api/auth/client/me", { headers });
      setUser(res.data);
      
      // Se o super_token funcionou e o usuário é admin, salva como token normal também
      if (res.data && res.data.type_user === "admin" && token && !getToken()) {
        setToken(token);
      }
    } catch (err) {
      // Se falhou com super_token, não limpa tudo (pode ser apenas cliente normal)
      if (getToken()) {
        console.warn("❌ Erro ao buscar usuário:", err);
        clearToken();
        setUser(null);
      } else {
        // Se não tinha token normal e falhou, apenas limpa o estado (cliente não admin)
        setUser(null);
      }
    }
  }, []);

  // ✅ Hook escutando token via postMessage
  useReceiveTokenFromParent(fetchUser);

  async function login(username: string, password: string) {
    const res = await loginService(username, password);
    setToken(res.access_token);
    await fetchUser();
  }

  function logout() {
    clearToken();
    logoutService(true);
    setUser(null);
  }

  useEffect(() => {
    fetchUser().finally(() => setIsLoading(false));
  }, [fetchUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.type_user === "admin",
        isUser: user?.type_user === "user",
        login,
        logout,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUserContext precisa do <UserProvider>");
  return ctx;
}
