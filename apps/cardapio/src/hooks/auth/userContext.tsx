// src/context/UserContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { getToken, setToken, clearToken } from "../token/tokenStore";
import { loginService, logoutService } from "./authenticate";
import { useReceiveTokenFromParent } from "../token/UseReceiveTokenFromParent";

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
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchUser() {
    const token = getToken(); // ✅ apenas da memória

    if (!token) {
      console.warn("⚠️ Nenhum token encontrado");
      return;
    }

    try {
      const res = await axios.get<User>(
        "https://gerente.mensuraapi.com.br/mensura/auth/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
    } catch (err) {
      console.warn("❌ Erro ao buscar usuário:", err);
      clearToken(); // limpa da memória
      setUser(null);
    }
  }

  // Reage a tokens via postMessage
  useReceiveTokenFromParent(fetchUser);

  async function login(username: string, password: string) {
    const res = await loginService(username, password);
    setToken(res.access_token); // ✅ em memória
    await fetchUser();
  }

  function logout() {
    clearToken(); // ✅ limpa da memória
    logoutService(true); // redireciona
    setUser(null);
  }

  useEffect(() => {
    fetchUser().finally(() => setIsLoading(false));
  }, []);

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
