"use client";

import { LojaStatusHeader } from "./LojaStatusHeader";
import { useBuscarEmpresa } from "@cardapio/services/empresa";
import { getEmpresaId, getEmpresaData } from "@cardapio/stores/empresa/empresaStore";
import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Componente wrapper que exibe o cabeçalho de status da loja globalmente.
 * Aparece acima do campo de pesquisa (Header).
 * 
 * Exibe na home (/) e na landing page da store (/landingpage-store).
 */
export function LojaStatusHeaderGlobal() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ✅ Logo reage à troca de ?empresa=: usar URL como fonte de verdade (igual à Home)
  const empresaParam = searchParams.get("empresa");
  const empresaIdFromUrl = useMemo(() => {
    const raw = (empresaParam ?? "").trim();
    if (!raw || !/^\d+$/.test(raw)) return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [empresaParam]);
  const empresaId = empresaIdFromUrl ?? getEmpresaId();
  
  // Verificar se deve exibir o cabeçalho
  const deveExibir = pathname === "/" || pathname.startsWith("/landingpage-store");
  
  // Buscar dados da empresa
  const { data: empresaData } = useBuscarEmpresa({
    empresaId: empresaId ? Number(empresaId) : undefined,
    enabled: !!empresaId && deveExibir,
  });

  // Fallback para dados do localStorage
  const empresaDataLocal = useMemo(() => {
    if (empresaData) return empresaData;
    return getEmpresaData();
  }, [empresaData]);

  // Se não deve exibir ou não há empresa/horários, não exibir
  if (!deveExibir || !empresaDataLocal?.horarios_funcionamento) {
    return null;
  }

  return (
    <LojaStatusHeader
      horarios={empresaDataLocal.horarios_funcionamento}
      nomeLoja={empresaDataLocal.nome}
      logo={empresaDataLocal.logo}
    />
  );
}
