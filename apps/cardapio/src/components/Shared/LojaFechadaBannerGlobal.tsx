"use client";

import { LojaFechadaBanner } from "./LojaFechadaBanner";
import { useLojaAberta } from "@cardapio/hooks/useLojaAberta";
import { useBuscarEmpresa } from "@cardapio/services/empresa";
import { getEmpresaId, getEmpresaData } from "@cardapio/stores/empresa/empresaStore";
import { useMemo } from "react";

/**
 * Componente wrapper que exibe o banner de loja fechada globalmente.
 * Usa os dados da empresa para exibir o banner em todas as rotas.
 */
export function LojaFechadaBannerGlobal() {
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

  // Se não há empresa ou horários, não exibir
  if (!empresaDataLocal?.horarios_funcionamento) {
    return null;
  }

  return (
    <LojaFechadaBanner
      horarios={empresaDataLocal.horarios_funcionamento}
      nomeLoja={empresaDataLocal.nome}
      logo={empresaDataLocal.logo}
    />
  );
}
