// src/hooks/useAuthStatus.ts
import { useUserContext } from "../context/UserContext";

export function useAuthStatus() {
  const { user, isLoading } = useUserContext();

  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";
  const isGuest = !user;

  return {
    user,
    isLoading,
    isAdmin,
    isUser,
    isGuest,
    role: user?.role,
  };
}
