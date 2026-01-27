// @cardapio/services/empresa/types.ts
// Alinhado ao endpoint GET /api/empresas/public/emp/lista

/** Intervalo de horário no formato "HH:MM" */
export interface HorarioIntervalo {
  inicio: string;
  fim: string;
}

/** Horários de um dia da semana (0=domingo, 1=segunda, ..., 6=sábado) */
export interface HorarioDia {
  dia_semana: number;
  intervalos: HorarioIntervalo[];
}

/** Empresa na lista (GET sem empresa_id). horarios_funcionamento é sempre null. */
export interface EmpresaDisponivel {
  id: number;
  nome: string;
  logo: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  distancia_km: number | null;
  tema: string | null;
  landingpage_store?: boolean;
  redireciona_home: boolean;
  redireciona_home_para: string | null;
  /** Na lista sempre null; use empresa_id para obter horários. */
  horarios_funcionamento?: HorarioDia[] | null;
  /** @deprecated Legado */
  endereco?: string | null;
}

/**
 * Empresa com detalhes completos (GET ?empresa_id=X).
 * Inclui logo e horarios_funcionamento quando disponíveis.
 */
export interface EmpresaPublic {
  id: number;
  nome: string;
  logo: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  distancia_km: number | null;
  tema: string | null;
  landingpage_store?: boolean;
  redireciona_home: boolean;
  redireciona_home_para: string | null;
  horarios_funcionamento: HorarioDia[] | null;
  /** @deprecated Legado */
  cardapio_tema?: string;
  /** @deprecated Legado */
  aceita_pedido_automatico?: boolean;
  /** @deprecated Legado */
  tempo_entrega_maximo?: number;
}
