// src/hooks/useEmpresas.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchEmpresasDetalhes } from "./serviceGetEmpresas";

export function useEmpresasDetalhes() {
  return useQuery({
    queryKey: ["empresas_detalhes"],
    queryFn: fetchEmpresasDetalhes,
  });
}