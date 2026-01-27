// hooks/useModoSupervisorFallback.ts
"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const STORAGE_KEY = "cardapio:modo_supervisor";

export function useModoSupervisor() {
  const searchParams = useSearchParams();

  // Durante SSR/hidratação inicial, evite depender de window/sessionStorage para não gerar mismatch.
  // Depois da montagem, sincronizamos com a URL real e com sessionStorage.
  const viaFromSearchParams = useMemo(() => {
    const raw = searchParams?.get("via");
    return raw?.trim().toLowerCase() ?? null;
  }, [searchParams]);

  const [isSupervisor, setIsSupervisor] = useState<boolean>(viaFromSearchParams === "supervisor");

  useEffect(() => {
    if (typeof window === "undefined") return;

    let viaFromUrl: string | null = null;
    try {
      viaFromUrl = new URLSearchParams(window.location.search).get("via");
    } catch {
      // ignore
    }

    const normalized = (viaFromUrl ?? "").trim().toLowerCase();
    const isSupervisorByUrl = normalized === "supervisor";

    let isSupervisorByStorage = false;
    try {
      isSupervisorByStorage = window.sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // ignore
    }

    if (isSupervisorByUrl) {
      try {
        window.sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignore
      }
    }

    setIsSupervisor(isSupervisorByUrl || isSupervisorByStorage);
  }, [viaFromSearchParams]);

  return isSupervisor;
}
