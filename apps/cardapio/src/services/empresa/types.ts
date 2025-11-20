// @cardapio/services/empresa/types.ts

// Tipo para empresa na lista (disponíveis)
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

// Tipo para dados públicos de uma empresa específica
export interface EmpresaPublic {
  nome: string;
  logo: string;
  cardapio_tema: string; // Ex: "padrao", "azul", "roxo", "vermelho", etc.
  aceita_pedido_automatico: boolean;
  tempo_entrega_maximo: number;
}

