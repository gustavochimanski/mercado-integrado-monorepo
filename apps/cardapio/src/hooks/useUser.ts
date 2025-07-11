// src/hooks/useUser.ts
import apiAdmin from "../app/api/apiAdmin";
import { useQuery } from "@tanstack/react-query";

export interface User {
  role: string
}

export function useUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => apiAdmin.get<{ id: string; role: string }>("/auth/me"),
    select: res => res.data,
    refetchOnWindowFocus: false,
  });
}
