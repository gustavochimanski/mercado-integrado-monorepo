import { useQuery } from "@tanstack/react-query";
import { TypeCaixas } from "../types/typesPDVS";
import { fetchAllCaixas, fetchByIdCaixas } from "../services/PdvsService";

// Hook para Buscar Todos os Caixas
export const useFetchAllCaixas = () => {
  return useQuery<TypeCaixas[]>({
    queryKey: ["fetchAllCaixas"],
    queryFn: fetchAllCaixas,
    staleTime: 60 * 1000,
  });
};

// Hook para buscar um perfil por ID
export const useFetchByIdCaixa = (id: string | undefined) => {
  return useQuery<TypeCaixas>({
    queryKey: ["fetchPerfilPdvById", id],
    queryFn: () => fetchByIdCaixas(id!),
    enabled: !!id, // Só executa se houver um ID
    staleTime: 60 * 1000,
  });
};
