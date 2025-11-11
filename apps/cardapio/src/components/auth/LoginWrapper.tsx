// components/LoginWrapper.tsx
"use client";

import LoginComponent from "@cardapio/components/auth/SupervisorLoginModal";
import { useUserContext } from "@cardapio/hooks/auth/userContext";
import { useModoSupervisor } from "@cardapio/lib/params/useModoSupervisor";

export function LoginWrapper() {
  const isSupervisor = useModoSupervisor();
  const { isAuthenticated } = useUserContext();

  if (!isSupervisor || isAuthenticated) return null;

  return <LoginComponent />;
}
