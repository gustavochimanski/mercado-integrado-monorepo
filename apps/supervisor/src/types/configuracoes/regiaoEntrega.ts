import type { RegiaoEntregaOut } from "@supervisor/api";

// Estrutura de dados do formulário para criar ou atualizar uma região de entrega
export interface RegiaoEntregaForm {
  cep?: string;
  bairro: string;
  cidade: string;
  uf: string;
  taxa_entrega: number;
  raio_km?: number;
  ativo: boolean;
}

// Props para o componente RegiaoEntregaModal
export interface RegiaoEntregaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  regiaoEntrega?: RegiaoEntregaOut | null;
  empresaId: number;
}

// Estrutura de sugestão de endereço retornada pela busca
export interface EnderecoSuggestion {
  id: string;
  display: string;
  cep?: string;
  bairro: string;
  cidade: string;
  uf: string;
  latitude?: number;
  longitude?: number;
  formatted?: string;
}

// Hook personalizado para busca de endereços
export interface UseEnderecoSearchReturn {
  suggestions: EnderecoSuggestion[];
  isLoading: boolean;
  error: string | null;
  search: (query: string) => Promise<void>;
  clearSuggestions: () => void;
}