// src/services/useQueryAdicional.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import type { AdicionalResponse } from "@cardapio/api/models/AdicionalResponse";
import type { CriarAdicionalRequest } from "@cardapio/api/models/CriarAdicionalRequest";
import type { AtualizarAdicionalRequest } from "@cardapio/api/models/AtualizarAdicionalRequest";
import type { VincularAdicionaisProdutoRequest } from "@cardapio/api/models/VincularAdicionaisProdutoRequest";

const BASE = "/api/cadastros/admin/adicionais";

// ----- Tipos -----
export type { AdicionalResponse, CriarAdicionalRequest, AtualizarAdicionalRequest, VincularAdicionaisProdutoRequest };

// ----- Helpers -----
function decimalToForm(v: number | string | null | undefined, decimals: number) {
  if (v === null || v === undefined || v === "") return undefined;
  const n = typeof v === "string" ? Number(v.replace(",", ".")) : Number(v);
  if (Number.isNaN(n)) return undefined;
  return n.toFixed(decimals);
}

function normalizeCriarAdicionalRequest(input: CriarAdicionalRequest): CriarAdicionalRequest {
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

function normalizeAtualizarAdicionalRequest(input: AtualizarAdicionalRequest): AtualizarAdicionalRequest {
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

// ----- Queries -----

/**
 * Lista todos os adicionais de uma empresa
 */
export function useAdicionais(
  empresa_id: number,
  apenas_ativos: boolean = true,
  opts?: { enabled?: boolean }
) {
  const key = ["adicionais", empresa_id, apenas_ativos] as const;

  return useQuery<AdicionalResponse[]>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await apiAdmin.get<AdicionalResponse[]>(
        `${BASE}?empresa_id=${empresa_id}&apenas_ativos=${apenas_ativos}`
      );
      return data;
    },
    enabled: (opts?.enabled ?? true) && !!empresa_id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Busca um adicional por ID
 */
export function useAdicionalById(
  adicional_id: number | null,
  opts?: { enabled?: boolean }
) {
  const qc = useQueryClient();
  const seed = adicional_id 
    ? qc.getQueryData<AdicionalResponse>(["adicional", adicional_id])
    : undefined;

  return useQuery<AdicionalResponse>({
    queryKey: ["adicional", adicional_id],
    queryFn: async () => {
      const { data } = await apiAdmin.get<AdicionalResponse>(
        `${BASE}/${adicional_id}`
      );
      return data;
    },
    initialData: seed,
    enabled: !!adicional_id && (opts?.enabled ?? true),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

/**
 * Lista todos os adicionais vinculados a um produto
 */
export function useAdicionaisProduto(
  cod_barras: string,
  apenas_ativos: boolean = true,
  opts?: { enabled?: boolean }
) {
  const key = ["adicionais_produto", cod_barras, apenas_ativos] as const;

  return useQuery<AdicionalResponse[]>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await apiAdmin.get<AdicionalResponse[]>(
        `${BASE}/produto/${encodeURIComponent(cod_barras)}?apenas_ativos=${apenas_ativos}`
      );
      return data;
    },
    enabled: (opts?.enabled ?? true) && !!cod_barras,
    staleTime: 5 * 60 * 1000,
  });
}

// ----- Mutations -----

export function useMutateAdicional() {
  const qc = useQueryClient();

  const invalidate = (empresaId?: number) => {
    // Invalida todas as queries de adicionais
    qc.invalidateQueries({ queryKey: ["adicionais"], exact: false });
    if (empresaId) {
      qc.invalidateQueries({
        predicate: (q) => {
          const k = q.queryKey;
          return Array.isArray(k) && k[0] === "adicionais" && k[1] === empresaId;
        },
      });
    }
    // Invalida adicionais de produtos também
    qc.invalidateQueries({ queryKey: ["adicionais_produto"], exact: false });
  };

  /**
   * Cria um novo adicional
   */
  const create = useMutation({
    mutationFn: async (input: CriarAdicionalRequest) => {
      const normalized = normalizeCriarAdicionalRequest(input);
      const { data } = await apiAdmin.post<AdicionalResponse>(BASE, normalized);
      return data;
    },
    onSuccess: (_data, vars) => {
      toast.success("Adicional criado com sucesso!");
      invalidate(vars.empresa_id);
    },
    onError: (err: any) => 
      toast.error(extractErrorMessage(err, "Erro ao criar adicional")),
  });

  /**
   * Atualiza um adicional existente
   */
  const update = useMutation({
    mutationFn: async ({ 
      adicional_id, 
      input 
    }: { 
      adicional_id: number; 
      input: AtualizarAdicionalRequest 
    }) => {
      const normalized = normalizeAtualizarAdicionalRequest(input);
      const { data } = await apiAdmin.put<AdicionalResponse>(
        `${BASE}/${adicional_id}`,
        normalized
      );
      return data;
    },
    onSuccess: (_data, vars) => {
      toast.success("Adicional atualizado com sucesso!");
      // Invalida o adicional específico e a lista
      qc.invalidateQueries({ queryKey: ["adicional", vars.adicional_id] });
      qc.invalidateQueries({ queryKey: ["adicionais"], exact: false });
      qc.invalidateQueries({ queryKey: ["adicionais_produto"], exact: false });
    },
    onError: (err: any) => 
      toast.error(extractErrorMessage(err, "Erro ao atualizar adicional")),
  });

  /**
   * Deleta um adicional
   */
  const remove = useMutation({
    mutationFn: async ({ 
      adicional_id, 
      empresa_id 
    }: { 
      adicional_id: number; 
      empresa_id: number 
    }) => {
      await apiAdmin.delete(`${BASE}/${adicional_id}`);
    },
    onSuccess: (_data, vars) => {
      toast.success("Adicional deletado com sucesso!");
      invalidate(vars.empresa_id);
      // Remove do cache
      qc.removeQueries({ queryKey: ["adicional", vars.adicional_id] });
    },
    onError: (err: any) => 
      toast.error(extractErrorMessage(err, "Erro ao deletar adicional")),
  });

  /**
   * Vincula adicionais a um produto
   * IMPORTANTE: Este endpoint substitui todos os adicionais vinculados ao produto
   */
  const vincularProduto = useMutation({
    mutationFn: async ({
      cod_barras,
      adicional_ids,
    }: {
      cod_barras: string;
      adicional_ids: number[];
    }) => {
      const payload: VincularAdicionaisProdutoRequest = {
        adicional_ids,
      };
      const { data } = await apiAdmin.post(
        `${BASE}/produto/${encodeURIComponent(cod_barras)}/vincular`,
        payload
      );
      return data;
    },
    onSuccess: (_data, vars) => {
      toast.success("Adicionais vinculados com sucesso!");
      // Invalida os adicionais do produto
      qc.invalidateQueries({ 
        queryKey: ["adicionais_produto", vars.cod_barras],
        exact: false 
      });
      // Também invalida produtos que podem mostrar os adicionais
      qc.invalidateQueries({ queryKey: ["produtos"], exact: false });
    },
    onError: (err: any) => 
      toast.error(extractErrorMessage(err, "Erro ao vincular adicionais ao produto")),
  });

  return {
    create,
    update,
    remove,
    vincularProduto,
  };
}

