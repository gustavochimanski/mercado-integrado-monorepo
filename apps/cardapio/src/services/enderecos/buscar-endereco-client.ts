// @cardapio/services/enderecos/buscar-endereco-client.ts
import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";

export interface EnderecoSearchResult {
  estado: string | null;
  codigo_estado: string | null;
  cidade: string | null;
  bairro: string | null;
  distrito: string | null;
  logradouro: string | null;
  numero: string | null;
  cep: string | null;
  pais: string | null;
  latitude: number;
  longitude: number;
  endereco_formatado: string;
}

interface BuscarEnderecoClientParams {
  text: string;
  max_results?: number;
}

/**
 * Hook para buscar endereços usando Google Maps (Client)
 * Endpoint: GET /api/localizacao/client/buscar-endereco?text={texto}&max_results={max_results}
 * 
 * Requer autenticação de cliente (X-Super-Token) - gerenciado automaticamente por apiClienteAdmin
 * 
 * @example
 * ```tsx
 * const buscarEndereco = useBuscarEnderecoClient();
 * buscarEndereco.mutate({ text: "Rua das Calêndulas 140", max_results: 5 });
 * // ou
 * buscarEndereco.mutate("Rua das Calêndulas 140");
 * ```
 */
export function useBuscarEnderecoClient() {
  return useMutation({
    mutationFn: async (params: BuscarEnderecoClientParams | string) => {
      // Suportar tanto objeto quanto string para compatibilidade
      const searchText = typeof params === "string" ? params : params.text;
      const maxResults = typeof params === "string" ? 5 : (params.max_results ?? 5);
      
      if (!searchText.trim()) {
        throw new Error("Texto de busca é obrigatório");
      }
      
      // Validar max_results (1-10)
      const validMaxResults = Math.max(1, Math.min(10, maxResults));
      
      try {
        const queryParams = new URLSearchParams({
          text: searchText.trim(),
          max_results: validMaxResults.toString(),
        });
        
        const { data } = await apiClienteAdmin.get<EnderecoSearchResult[]>(
          `/api/localizacao/client/buscar-endereco?${queryParams.toString()}`
        );
        
        // A API retorna um array de EnderecoSearchResult diretamente
        return data;
      } catch (error: any) {
        // Tratar erros específicos
        if (error.response?.status === 400) {
          throw new Error("Parâmetros inválidos. Verifique o texto de busca.");
        }
        if (error.response?.status === 401) {
          throw new Error("Token inválido. Faça login novamente.");
        }
        if (error.response?.status === 503) {
          throw new Error("Serviço de geolocalização não configurado. Verifique a configuração da API key do Google Maps.");
        }
        
        throw error;
      }
    },
    onError: (err: any) => {
      console.error("Error searching address:", err);
      const message = err.message || extractErrorMessage(err, "Erro ao buscar endereço");
      toast.error(message);
    },
  });
}

