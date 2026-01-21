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
  id: number;
  nome: string;
  logo?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  distancia_km?: number | null;
  tema: string; // Cor oklch do tema, ex: "oklch(0.55 0.22 25)"
  // Campos legados para compatibilidade
  cardapio_tema?: string;
  aceita_pedido_automatico?: boolean;
  tempo_entrega_maximo?: number;
}

