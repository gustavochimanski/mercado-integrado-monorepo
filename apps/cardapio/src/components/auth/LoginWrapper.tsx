// components/LoginWrapper.tsx
"use client";

import { useModoSupervisor } from "@cardapio/hooks/useModoSupervisor";
import LoginComponent from "@cardapio/components/auth/SupervisorLoginModal";
import { useUserContext } from "@packs/auth";

export function LoginWrapper() {
  const isSupervisor = useModoSupervisor();
  const { isAuthenticated } = useUserContext();

  if (!isSupervisor || isAuthenticated) return null;

  return <LoginComponent />;
}
