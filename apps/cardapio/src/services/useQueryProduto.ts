// src/services/useQueryProduto.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";

const BASE = "/api/cadastros/admin/produtos";

// ----- Tipos (espelham seu backend) -----
export type ProdutoListItem = {
  cod_barras: string;
  descricao: string;
  imagem?: string | null;
  preco_venda: number;
  custo?: number | null;
  cod_categoria: number;
  label_categoria: string;
  disponivel: boolean;
  exibir_delivery: boolean;
};

export type ProdutosPaginadosResponse = {
  data: ProdutoListItem[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
};

// ----- Helpers -----

export type CreateProdutoInput = {
  cod_empresa: number;
  cod_barras: string;
  descricao: string;
  cod_categoria: number;
  preco_venda: number | string;
  custo?: number | string | null;
  vitrine_id?: number | null;
  data_cadastro?: string | Date | null;
  imagem?: File | null;
};

export type UpdateProdutoInput = Omit<CreateProdutoInput, "cod_barras"> & {
  cod_barras: string; // no path
};

function decimalToForm(v: number | string | null | undefined, decimals: number) {
  if (v === null || v === undefined || v === "") return undefined;
  const n = typeof v === "string" ? Number(v.replace(",", ".")) : Number(v);
  if (Number.isNaN(n)) return undefined;
  return n.toFixed(decimals);
}

function useDebounced<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function useSearchProdutos(
  cod_empresa: number,
  q: string,
  opts?: { page?: number; limit?: number; apenas_disponiveis?: boolean; enabled?: boolean }
) {
  const {
    page = 1,
    limit = 30,
    apenas_disponiveis = false,
    enabled,
  } = opts ?? {};
  const qDeb = useDebounced(q, 350);

  return useQuery({
    queryKey: ["produtos_search", cod_empresa, qDeb, page, limit, apenas_disponiveis],
    queryFn: async () => {
      const params: Record<string, any> = {
        cod_empresa,
        page,
        limit,
        apenas_disponiveis,
      };
      if (qDeb?.trim()) params.q = qDeb.trim();

      const { data } = await apiAdmin.get(`${BASE}/search`, { params });
      return data as ProdutosPaginadosResponse;
    },
    enabled: enabled ?? !!cod_empresa,
    staleTime: 5 * 60 * 1000,
  });
}

export function buildProdutoFormData(input: CreateProdutoInput | UpdateProdutoInput) {
  const fd = new FormData();

  fd.append("cod_empresa", String(input.cod_empresa));
  // Dica: só no POST
  if (!("cod_barras" in input) || (input as any)._method === "POST") {
    fd.append("cod_barras", String((input as any).cod_barras ?? ""));
  }

  fd.append("descricao", input.descricao.trim());
  fd.append("cod_categoria", String(input.cod_categoria));

  const preco = decimalToForm(input.preco_venda, 2);
  if (preco !== undefined) fd.append("preco_venda", preco);

  const custo = decimalToForm(input.custo ?? undefined, 5);
  if (custo !== undefined) fd.append("custo", custo);

  if (input.vitrine_id !== undefined && input.vitrine_id !== null) {
    fd.append("vitrine_id", String(input.vitrine_id));
  }

  if (input.data_cadastro) {
    const iso = typeof input.data_cadastro === "string"
      ? input.data_cadastro
      : input.data_cadastro.toISOString().slice(0, 10);
    fd.append("data_cadastro", iso);
  }

  if (input.imagem) fd.append("imagem", input.imagem);

  return fd;
}


// ----- Queries -----
export function useFetchCadProdDelivery(
  cod_empresa: number,
  page: number,
  limit = 30,
  apenas_disponiveis = false
) {
  const key = ["produtos", cod_empresa, page, limit, apenas_disponiveis] as const;

  return useQuery<ProdutosPaginadosResponse>({
    queryKey: key,
    queryFn: async () => {
      const res = await apiAdmin.get(
        `${BASE}?cod_empresa=${cod_empresa}&page=${page}&limit=${limit}&apenas_disponiveis=${apenas_disponiveis}`
      );
      return res.data as ProdutosPaginadosResponse;
    },
  })
}

// ----- Mutations -----
export function useMutateProduto() {
  const qc = useQueryClient();

  const invalidate = (codEmpresa?: number) => {
    // invalida todas as variações da lista:
    qc.invalidateQueries({ queryKey: ["produtos"], exact: false });
    if (codEmpresa) {
      qc.invalidateQueries({
        predicate: (q) => {
          const k = q.queryKey;
          return Array.isArray(k) && k[0] === "produtos" && k[1] === codEmpresa;
        },
      });
    }
  };

  const reloadPage = (cod_empresa: number) => {
    invalidate(cod_empresa);
    window.location.reload();
  };

  const update = useMutation({
    mutationFn: async (input: UpdateProdutoInput) => {
      const { cod_barras } = input;
      const fd = buildProdutoFormData(input);
      // no PUT o cod_barras vai no PATH
      const { data } = await apiAdmin.put(`${BASE}/${encodeURIComponent(cod_barras)}`, fd);
      return data;
    },
    onSuccess: (_data, vars) => {
      toast.success("Produto atualizado com sucesso!");
      reloadPage(vars.cod_empresa);
    },
    onError: (err: any) => toast.error(extractErrorMessage(err, "Erro ao atualizar produto")),
  });


  return { update };
}
