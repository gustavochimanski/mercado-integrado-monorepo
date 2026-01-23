// hooks/useModoSupervisorFallback.ts
"use client";
import { useSearchParams } from "next/navigation";

export function useModoSupervisor() {
  const searchParams = useSearchParams();
  const via = searchParams.get("via");
  
  return via === "supervisor";
}
