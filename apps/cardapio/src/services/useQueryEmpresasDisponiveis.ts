import { useQuery } from "@tanstack/react-query";
import { api } from "@cardapio/app/api/api";

export interface EmpresaDisponivel {
  id: number;
  nome: string;
  logo?: string | null;
  distancia_km?: number | null;
  endereco?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
}

interface UseQueryEmpresasDisponiveisOptions {
  enabled?: boolean;
  filtros?: {
    q?: string | null;
    cidade?: string | null;
    estado?: string | null;
    limit?: number;
  };
}

export function useQueryEmpresasDisponiveis(options?: UseQueryEmpresasDisponiveisOptions) {
  const { filtros } = options ?? {};

  return useQuery({
    queryKey: [
      "empresas-disponiveis",
      filtros?.q ?? null,
      filtros?.cidade ?? null,
      filtros?.estado ?? null,
      filtros?.limit ?? null,
    ],
    queryFn: async () => {
      const { data } = await api.get<EmpresaDisponivel[]>("/api/cadastros/public/emp/lista", {
        params: {
          q: filtros?.q ?? undefined,
          cidade: filtros?.cidade ?? undefined,
          estado: filtros?.estado ?? undefined,
          limit: filtros?.limit ?? undefined,
        },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: options?.enabled ?? true,
  });
}


