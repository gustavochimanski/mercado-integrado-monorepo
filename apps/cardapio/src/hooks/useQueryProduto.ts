// src/services/useQueryProduto.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateProdutoBody {
  formData: FormData;
}

interface UpdateProdutoBody {
  cod_barras: string;
  formData: FormData;
}

export function useMutateProduto() {
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: async ({ formData }: CreateProdutoBody) => {
      try {
        const { data } = await apiAdmin.post(
          "/mensura/produtos/delivery",
          formData
        );
        toast.success("Produto criado com sucesso!");
        return data;
      } catch (err: any) {
        const msg =
          err.response?.data?.detail ||
          err.message ||
          "Erro ao criar produto";
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
        const { data } = await apiAdmin.put(
          `/mensura/produtos/delivery/${cod_barras}`,
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
        await apiAdmin.delete(`/mensura/produtos/delivery/${cod_barras}`);
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
