// @cardapio/services/adicionais/utils.ts
import type { CriarAdicionalRequest, AtualizarAdicionalRequest } from "./types";

function decimalToForm(v: number | string | null | undefined, decimals: number) {
  if (v === null || v === undefined || v === "") return undefined;
  const n = typeof v === "string" ? Number(v.replace(",", ".")) : Number(v);
  if (Number.isNaN(n)) return undefined;
  return n.toFixed(decimals);
}

export function normalizeCriarAdicionalRequest(input: CriarAdicionalRequest): CriarAdicionalRequest {
  return {
    ...input,
    nome: input.nome.trim(),
    descricao: input.descricao?.trim() || null,
    preco: input.preco !== undefined ? decimalToForm(input.preco, 2) || 0 : 0,
    ativo: input.ativo ?? true,
    obrigatorio: input.obrigatorio ?? false,
    permite_multipla_escolha: input.permite_multipla_escolha ?? true,
    ordem: input.ordem ?? 0,
  };
}

export function normalizeAtualizarAdicionalRequest(input: AtualizarAdicionalRequest): AtualizarAdicionalRequest {
  const normalized: AtualizarAdicionalRequest = {};
  
  if (input.nome !== undefined && input.nome !== null) {
    normalized.nome = input.nome.trim() || null;
  }
  
  if (input.descricao !== undefined) {
    normalized.descricao = input.descricao?.trim() || null;
  }
  
  if (input.preco !== undefined && input.preco !== null) {
    const preco = decimalToForm(input.preco, 2);
    if (preco !== undefined) {
      normalized.preco = preco;
    }
  }
  
  if (input.ativo !== undefined) {
    normalized.ativo = input.ativo;
  }
  
  if (input.obrigatorio !== undefined) {
    normalized.obrigatorio = input.obrigatorio;
  }
  
  if (input.permite_multipla_escolha !== undefined) {
    normalized.permite_multipla_escolha = input.permite_multipla_escolha;
  }
  
  if (input.ordem !== undefined) {
    normalized.ordem = input.ordem;
  }
  
  return normalized;
}

