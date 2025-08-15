"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { getEmpresaId, setEmpresaId } from "./empresaStore";

export function useReceiveEmpresaFromQuery(onReceived?: () => void) {
  const searchParams = useSearchParams();
  const empresaParam = searchParams.get("empresa"); // 👈 só esse cara

  // Evita duplo set no StrictMode (dev) e sets redundantes
  const lastAppliedRef = useRef<number | null>(null);

  useEffect(() => {
    const raw = (empresaParam ?? "").trim();
    if (!raw) return;

    // aceita só dígitos (ignora coisas tipo "1a", "abc")
    if (!/^\d+$/.test(raw)) return;

    const nextId = parseInt(raw, 10); // "001" -> 1
    if (!Number.isFinite(nextId) || nextId <= 0) return;

    const current = typeof getEmpresaId === "function" ? getEmpresaId() : null;

    // idempotência total
    if (nextId === current || nextId === lastAppliedRef.current) return;

    setEmpresaId(nextId);
    lastAppliedRef.current = nextId;
    onReceived?.();
  }, [empresaParam, onReceived]);
}
