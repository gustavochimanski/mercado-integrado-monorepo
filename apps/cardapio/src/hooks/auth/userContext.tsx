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
import { getCookie,  deleteCookie } from "cookies-next";
import { getToken, setToken } from "../token/tokenStore";
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
    // ✅ tenta pegar da memória
    let token = getToken();

    // fallback: tenta pegar do cookie (ex: login por form)
    if (!token) {
      token = getCookie("access_token") as string;
      if (token) setToken(token); // atualiza memória também
    }

    if (!token) return;

    try {
      const res = await axios.get<User>(
        "https://gerente.mensuraapi.com.br/mensura/auth/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
    } catch {
      deleteCookie("access_token");
      setUser(null);
    }
  }

  // Escuta tokens recebidos por postMessage e revalida
  useReceiveTokenFromParent(fetchUser);

  async function login(username: string, password: string) {
    const res = await loginService(username, password);
    await fetchUser();
  }

  function logout() {
    logoutService(true);
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
