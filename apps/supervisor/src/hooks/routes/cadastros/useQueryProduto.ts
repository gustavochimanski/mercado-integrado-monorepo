// src/services/useQueryProduto.ts
import { TypeCadProdDeliveryResponse } from "@supervisor/types/routes/cadastros/cadProdDeliveryType";
import apiMensura from "@supervisor/lib/api/apiMensura";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateProdutoBody {
  cod_barras: string;
  formData: FormData;
}

export type CreateProdutoInput = {
  cod_barras: string;
  descricao: string;
  cod_empresa: number;
  preco_venda: number | string;
  custo?: number | string;
  imagem?: File;
  data_cadastro?: string; // opcional (YYYY-MM-DD)
};

export function useFetchCadProdMensura(
  cod_empresa: number,
  page: number,
  limit = 30
) {
  return useQuery<TypeCadProdDeliveryResponse>({
    queryKey: ["produtos", cod_empresa, page, limit],
    queryFn: async () => {
      const res = await apiMensura.get(
        `/api/mensura/produtos?cod_empresa=${cod_empresa}&page=${page}&limit=${limit}`
      );
      return res.data;
    },
  });
}

export function useMutateProduto() {
  const qc = useQueryClient();

  const create = useMutation({
    // 🔧 Agora recebemos CreateProdutoInput
    mutationFn: async (input: CreateProdutoInput) => {
      const fd = new FormData();
      fd.append("cod_barras", input.cod_barras.trim());
      fd.append("descricao", input.descricao.trim());
      fd.append("cod_empresa", String(input.cod_empresa));
      fd.append("preco_venda", String(input.preco_venda));

      if (input.custo !== undefined && input.custo !== "" && !isNaN(Number(input.custo))) {
        fd.append("custo", String(input.custo));
      }
      if (input.data_cadastro) {
        fd.append("data_cadastro", input.data_cadastro);
      }
      if (input.imagem) {
        fd.append("imagem", input.imagem);
      }

      try {
        const { data } = await apiMensura.post("/api/mensura/produtos", fd);
        toast.success("Produto criado com sucesso!");
        return data;
      } catch (err: any) {
        const msg = err.response?.data?.detail || err.message || "Erro ao criar produto";
        toast.error(msg);
        throw err;
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["produtos"], exact: false });
    },
  });

  const update = useMutation({
    mutationFn: async ({ cod_barras, formData }: UpdateProdutoBody) => {
      try {
        const { data } = await apiMensura.put(
          `/api/mensura/produtos/${cod_barras}`, // 🔧 rota corrigida
          formData
        );
        toast.success("Produto atualizado com sucesso!");
        return data;
      } catch (err: any) {
        const msg =
          err.response?.data?.detail ||
          err.message ||
          "Erro ao atualizar produto";
        toast.error(msg);
        throw err;
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["produtos"], exact: false });
    },
  });

  const remove = useMutation({
    mutationFn: async (cod_barras: string) => {
      try {
        await apiMensura.delete(`/api/mensura/produtos/${cod_barras}`); // 🔧 rota corrigida
        toast.success("Produto removido com sucesso!");
      } catch (err: any) {
        const msg =
          err.response?.data?.detail || err.message || "Erro ao remover produto";
        toast.error(msg);
        throw err;
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["produtos"], exact: false });
    },
  });

  return { create, update, remove };
}
