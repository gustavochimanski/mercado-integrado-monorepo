// src/services/useQueryProduto.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * IMPORTANTE:
 * Se o apiAdmin NÃO tiver baseURL '/api', troque BASE para "/api/delivery/produtos/delivery"
 */
const BASE = "api/delivery/produtos";

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
function errMsg(err: any, fallback: string) {
  return err?.response?.data?.detail ?? err?.message ?? fallback;
}

/** Backend espera Decimal via form: envie *string* com ponto. */
function decimalToForm(v: number | string | null | undefined, decimals: number) {
  if (v === null || v === undefined || v === "") return undefined;
  const n = typeof v === "string" ? Number(v.replace(",", ".")) : Number(v);
  if (Number.isNaN(n)) return undefined;
  return n.toFixed(decimals); // ex.: "10.00"
}


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

export function buildProdutoFormData(input: CreateProdutoInput | UpdateProdutoInput) {
  const fd = new FormData();

  fd.append("cod_empresa", String(input.cod_empresa));
  fd.append("cod_barras", String((input as any).cod_barras ?? "")); // será ignorado no PUT body, mas ok no POST
  fd.append("descricao", input.descricao.trim());
  fd.append("cod_categoria", String(input.cod_categoria));

  const preco = decimalToForm(input.preco_venda, 2);
  if (preco) fd.append("preco_venda", preco);

  const custo = decimalToForm(input.custo ?? undefined, 5);
  if (custo !== undefined) fd.append("custo", custo);

  if (input.vitrine_id !== undefined && input.vitrine_id !== null) {
    fd.append("vitrine_id", String(input.vitrine_id));
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

  

  const create = useMutation({
    mutationFn: async (input: CreateProdutoInput) => {
      const fd = buildProdutoFormData(input);
      // no POST o cod_barras vai no body (form)
      const { data } = await apiAdmin.post(`${BASE}`, fd);
      return data;
    },
    onSuccess: (_data, vars) => {
      toast.success("Produto criado com sucesso!");
      reloadPage(vars.cod_empresa);
    },
    onError: (err: any) => toast.error(errMsg(err, "Erro ao criar produto")),
  });

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
    onError: (err: any) => toast.error(errMsg(err, "Erro ao atualizar produto")),
  });

  const remove = useMutation({
    mutationFn: async ({ cod_barras, empresa_id }: { cod_barras: string; empresa_id: number }) => {
      await apiAdmin.delete(
        `${BASE}/${encodeURIComponent(cod_barras)}`,
        { params: { empresa_id } }
      );
    },
    onSuccess: (_d, vars) => {
      toast.success("Produto removido com sucesso!");
      reloadPage(vars?.empresa_id);
    },
    onError: (err: any) => toast.error(errMsg(err, "Erro ao remover produto")),
  });

  /** PATCH /disponibilidade – com opção de update otimista */
  const toggleDisponibilidade = useMutation({
    // params necessários pelo backend: empresa_id, disponivel
    mutationFn: async (p: { cod_barras: string; empresa_id: number; disponivel: boolean }) => {
      await apiAdmin.patch(`${BASE}/${encodeURIComponent(p.cod_barras)}/disponibilidade`, {
        empresa_id: p.empresa_id,
        disponivel: p.disponivel,
      });
      return p;
    },
    // Otimista (opcional): atualiza lista atual se presente no cache
    onMutate: async (p) => {
      const queries = qc.getQueryCache().findAll({ queryKey: ["produtos"] });
      const snapshots: any[] = [];
      for (const q of queries) {
        const key = q.queryKey;
        const data = qc.getQueryData<ProdutosPaginadosResponse>(key);
        if (!data) continue;
        snapshots.push({ key, data });
        const newData: ProdutosPaginadosResponse = {
          ...data,
          data: data.data.map((item) =>
            item.cod_barras === p.cod_barras ? { ...item, disponivel: p.disponivel } : item
          ),
        };
        qc.setQueryData(key, newData);
      }
      return { snapshots };
    },
    onError: (err, _vars, ctx) => {
      // rollback se falhar
      if (ctx?.snapshots) {
        for (const s of ctx.snapshots) qc.setQueryData(s.key, s.data);
      }
      toast.error(errMsg(err, "Erro ao alterar disponibilidade"));
    },
    onSuccess: () => toast.success("Disponibilidade atualizada!"),
    onSettled: (_d, _e, vars) => invalidate(vars?.empresa_id),
  });

  return { create, update, remove, toggleDisponibilidade };
}
