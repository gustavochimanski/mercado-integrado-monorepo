import { api } from "@cardapio/app/api/api";
import { useQuery } from "@tanstack/react-query";

// 🔎 Tipo da resposta da empresa (baseado no schema da API)
export interface EmpresaPublic {
  nome: string;
  logo: string;
  cardapio_tema: string; // Ex: "padrao", "azul", "roxo", "vermelho", etc.
  aceita_pedido_automatico: boolean;
  tempo_entrega_maximo: number;
}

// ✅ Buscar dados da empresa (sem autenticação)
export function useQueryEmpresaPublic(enabled = true, empresaId: number | undefined,) {
  return useQuery<EmpresaPublic>({
    queryKey: ["mensura-empresa-client"],
    queryFn: async () => {
      const { data } = await api.get<EmpresaPublic>("/api/cadastros/public/emp/", {
         params: { empresa_id: empresaId }, 
      });
      return data;
    },
    enabled,
    staleTime: 60 * 60 * 1000, // 1 hora - empresa não muda frequentemente
    gcTime: 2 * 60 * 60 * 1000, // 2 horas
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 3, // Tentar 3 vezes em caso de erro
  });
}
