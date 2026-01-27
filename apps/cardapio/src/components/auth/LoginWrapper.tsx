// components/LoginWrapper.tsx
"use client";

import { useEffect, useState } from "react";
import LoginComponent from "@cardapio/components/auth/SupervisorLoginModal";
import { useUserContext } from "@cardapio/hooks/auth/userContext";
import { useModoSupervisor } from "@cardapio/lib/params/useModoSupervisor";
import { getToken } from "@cardapio/stores/token/tokenStore";

export function LoginWrapper() {
  // Evita hydration mismatch: no SSR/primeira hidratação, renderiza null e só decide após mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isSupervisor = useModoSupervisor();
  const { isLoading } = useUserContext();
  const hasAdminToken = !!getToken();

  if (!mounted) return null;
  // Se já existe token admin persistido, nunca mostrar modal (evita flicker durante refetch do user).
  if (!isSupervisor || hasAdminToken) return null;
  // Se ainda está carregando o contexto, evita “piscar” caso o token esteja chegando via postMessage.
  if (isLoading) return null;

  return <LoginComponent />;
}
