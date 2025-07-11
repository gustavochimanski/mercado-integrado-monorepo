// src/hooks/useAuth.ts
"use client";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import { useMutation } from "@tanstack/react-query";
import { loginService } from "./authenticate";

interface Credentials {
  username: string;
  password: string;
}

export function useAuth() {
  const [typeUser, setTypeUser] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checked, setChecked] = useState(false);

  // 1) checa cookie só uma vez
  useEffect(() => {
    const token = getCookie("access_token");
    setIsAuthenticated(!!token);
    setChecked(true); // sinaliza que a checagem acabou
  }, []);

  const {
    mutateAsync: login,
    isPending: isLoggingIn, // isPending substitui isLoading em mutations no v5
  } = useMutation({
    mutationFn: (creds: Credentials) =>
      loginService(creds.username, creds.password),

    onSuccess: (data) => {
      setTypeUser(data.type_user);
      // full reload para garantir middleware
      window.location.href = "/";
    },
    onError: (error: any) => {
      // Rejeita o erro para que o componente possa capturar com try/catch
      throw error;
    },
  });

  return {
    login,
    isLoggingIn,
    typeUser,
    isAuthenticated,
    checked,
  };
}
