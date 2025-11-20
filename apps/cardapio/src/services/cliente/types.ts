// @cardapio/services/cliente/types.ts

/** Tipos vindos do backend */
export interface ClienteOut {
  id: number;
  nome: string;
  email?: string;
  telefone?: string | null;
  cpf_cnpj?: string | null;
  created_at: string;
  updated_at: string;
  super_token: string;
}

export interface ClienteCreate {
  nome: string;
  email?: string;
  telefone?: string | null;
  cpf_cnpj?: string | null;
}

export type ClienteUpdate = Partial<ClienteCreate>;

export interface NovoDispositivoRequest {
  telefone: string;
}

export interface ConfirmacaoCodigoRequest {
  telefone: string;
  codigo: string;
}

export interface NovoDispositivoResponse {
  super_token: string;
  nome: string;
  telefone: string;
}

