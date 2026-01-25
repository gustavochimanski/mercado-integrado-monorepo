"use client";

import { useState, useEffect, useMemo } from "react";
import { verificarLojaAberta } from "@cardapio/lib/empresa/verificarLojaAberta";
import { useBuscarEmpresa } from "@cardapio/services/empresa";
import { getEmpresaId, getEmpresaData } from "@cardapio/stores/empresa/empresaStore";

/**
 * Hook para verificar se a loja está aberta no momento atual.
 * Atualiza automaticamente a cada minuto.
 * 
 * @returns objeto com { estaAberta: boolean, isLoading: boolean }
 */
export function useLojaAberta() {
  const [agora, setAgora] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const empresaId = getEmpresaId();
  
  // Buscar dados da empresa
  const { data: empresaData } = useBuscarEmpresa({
    empresaId: empresaId ?? undefined,
    enabled: !!empresaId,
  });

  // Fallback para dados do localStorage
  const empresaDataLocal = useMemo(() => {
    if (empresaData) return empresaData;
    return getEmpresaData();
  }, [empresaData]);

  useEffect(() => {
    setIsMounted(true);
    setAgora(new Date());
  }, []);

  // Atualizar a cada minuto
  useEffect(() => {
    if (!isMounted) return;
    const interval = setInterval(() => {
      setAgora(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, [isMounted]);

  const estaAberta = useMemo(() => {
    if (!agora || !isMounted) return true; // Durante SSR, assume aberta
    if (!empresaDataLocal?.horarios_funcionamento) return true; // Se não há horários, permite
    return verificarLojaAberta(empresaDataLocal.horarios_funcionamento, undefined, agora);
  }, [empresaDataLocal?.horarios_funcionamento, agora, isMounted]);

  return {
    estaAberta,
    isLoading: !isMounted || !agora,
    horarios: empresaDataLocal?.horarios_funcionamento ?? null,
  };
}
