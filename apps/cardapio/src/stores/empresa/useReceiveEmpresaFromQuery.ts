"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@cardapio/app/api/api";
import type { EmpresaDisponivel } from "@cardapio/services/empresa";
import { getEmpresaId, setEmpresaId, clearEmpresaData } from "./empresaStore";

export function useReceiveEmpresaFromQuery(onReceived?: () => void) {
  const searchParams = useSearchParams();
  const empresaParam = searchParams.get("empresa"); // 👈 só esse cara

  // Evita duplo set no StrictMode (dev) e sets redundantes
  const lastAppliedRef = useRef<number | null>(null);
  const fetchingDefaultRef = useRef(false);
  const onReceivedRef = useRef(onReceived);

  useEffect(() => {
    onReceivedRef.current = onReceived;
  }, [onReceived]);

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

    // Limpar dados da empresa antiga quando a empresa muda
    if (current && current !== nextId) {
      clearEmpresaData();
    }

    setEmpresaId(nextId);
    lastAppliedRef.current = nextId;
    onReceivedRef.current?.();
  }, [empresaParam]);

  useEffect(() => {
    const raw = (empresaParam ?? "").trim();
    if (raw) return; // já tratamos quando vem via URL

    if (fetchingDefaultRef.current) return;

    const current = typeof getEmpresaId === "function" ? getEmpresaId() : null;
    if (current && current > 0) return;

    let cancelled = false;
    fetchingDefaultRef.current = true;

    const selectDefaultEmpresa = async () => {
      try {
        const { data } = await api.get<EmpresaDisponivel[]>("/api/empresas/public/emp/lista");
        if (cancelled) return;

        if (Array.isArray(data) && data.length > 0) {
          const [menorEmpresa] = [...data].sort((a, b) => a.id - b.id);

          if (menorEmpresa?.id && menorEmpresa.id !== current) {
            setEmpresaId(menorEmpresa.id);
            lastAppliedRef.current = menorEmpresa.id;
            onReceivedRef.current?.();
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("Não foi possível definir empresa padrão:", error);
        }
      } finally {
        fetchingDefaultRef.current = false;
      }
    };

    selectDefaultEmpresa();

    return () => {
      cancelled = true;
    };
  }, [empresaParam]);
}
