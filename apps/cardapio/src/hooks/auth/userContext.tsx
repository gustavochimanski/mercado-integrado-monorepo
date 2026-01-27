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
import { useQueryClient } from "@tanstack/react-query";
import { getToken, setToken, clearToken } from "../../stores/token/tokenStore";
import { loginService, logoutService } from "./authenticate";
import { useReceiveTokenFromParent } from "../../stores/token/UseReceiveTokenFromParent";
import { useModoSupervisor } from "../../lib/params/useModoSupervisor";
import { getApiBaseUrlClient } from "@cardapio/lib/api/getApiBaseUrl.client";

// Instância axios sem baseURL fixa
const api = axios.create();

// ✅ Interceptor que atualiza baseURL dinamicamente antes de cada request
api.interceptors.request.use((config) => {
  if (!config.baseURL) {
    config.baseURL = getApiBaseUrlClient();
  }
  return config;
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
  const isSupervisor = useModoSupervisor();
  const queryClient = useQueryClient();

  // ✅ Memoiza a função pra não recriar em cada render
  const fetchUser = useCallback(async () => {
    // Pequeno delay para garantir que cookies foram persistidos
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Primeiro tenta o token normal (admin)
    const authToken = getToken();

    if (!authToken) {
      setUser(null);
      return;
    }

    try {
      // Usa a instância axios com baseURL já configurada (igual ao authenticate.ts)
      const res = await api.get<User>("api/auth/me", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setUser(res.data);
    } catch (err) {
      console.warn("❌ Erro ao buscar usuário:", err);
      clearToken();
      setUser(null);
    }
  }, []);

  // ✅ Hook escutando token via postMessage
  useReceiveTokenFromParent(() => {
    fetchUser();
    // ✅ Invalidar queries admin quando token for recebido via postMessage
    queryClient.invalidateQueries({
      predicate: (query) => {
        const key = query.queryKey?.[0];
        return typeof key === "string" && (
          key.includes("receitas") ||
          key.includes("combos") ||
          key.includes("categorias") ||
          key.includes("vitrines") ||
          key.includes("produtos") ||
          key.includes("admin")
        );
      }
    });
  });

  async function login(username: string, password: string) {
    const res = await loginService(username, password);
    setToken(res.access_token);
    await fetchUser();
    
    // ✅ Invalidar queries admin após login bem-sucedido para que sejam refeitas com o token
    queryClient.invalidateQueries({
      predicate: (query) => {
        const key = query.queryKey?.[0];
        return typeof key === "string" && (
          key.includes("receitas") ||
          key.includes("combos") ||
          key.includes("categorias") ||
          key.includes("vitrines") ||
          key.includes("produtos") ||
          key.includes("admin")
        );
      }
    });
  }

  function logout() {
    clearToken();
    logoutService(true);
    setUser(null);
  }

  useEffect(() => {
    fetchUser().finally(() => setIsLoading(false));
  }, [fetchUser]);

  // ✅ Se via=supervisor estiver presente, considerar como admin
  const isAdmin = isSupervisor || user?.type_user === "admin";

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin,
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
