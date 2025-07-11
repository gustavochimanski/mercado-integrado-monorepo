// @packs/auth/src/UserContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import axios from "axios";
import { loginService } from "./authenticate";

export interface User {
  id: string;
  role: string;
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

  // 🔐 Usado no login e no carregamento inicial
  async function fetchUser() {
    const token = getCookie("access_token");
    if (!token) return;

    try {
      const res = await axios.get<User>(
        "https://mensuraapi.com.br/mensura/auth/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
    } catch {
      deleteCookie("access_token");
      setUser(null);
    }
  }

  // ⏬ Aqui é onde usamos o `loginService` mesmo
  async function login(username: string, password: string) {
    const res = await loginService(username, password);

    // ⛳️ AQUI sim salvamos o token no cookie:
    setCookie("access_token", res.access_token, {
      path: "/",
      maxAge: 60 * 25,
      sameSite: "lax",
      secure: false,
    });

    await fetchUser(); // pega os dados e atualiza o context
  }

  function logout() {
    deleteCookie("access_token", { path: "/" });
    setUser(null);
    window.location.href = "/login";
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
        isAdmin: user?.role === "admin",
        isUser: user?.role === "user",
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
