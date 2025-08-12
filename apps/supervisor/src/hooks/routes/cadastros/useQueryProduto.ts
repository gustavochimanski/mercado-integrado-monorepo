// src/services/useQueryProduto.ts
import { TypeCadProdDeliveryResponse } from "@supervisor/types/routes/cadastros/cadProdDeliveryType";
import apiMensura from "@supervisor/lib/api/apiMensura";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateProdutoBody {
  formData: FormData;
}

interface UpdateProdutoBody {
  cod_barras: string;
  formData: FormData;
}

export function useFetchCadProdDelivery(
  cod_empresa: number,
  page: number,
  limit = 30
) {
  return useQuery<TypeCadProdDeliveryResponse>({
    queryKey: ["produtos", cod_empresa, page, limit],
    queryFn: async () => {
      const res = await apiMensura.get(
        `/api/delivery/produtos?cod_empresa=${cod_empresa}&page=${page}&limit=${limit}`
      );
      return res.data;
    },
  });
}

export function useMutateProduto() {
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: async ({ formData }: CreateProdutoBody) => {
      try {
        const { data } = await apiMensura.post(
          "/api/delivery/produtos",
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
        const { data } = await apiMensura.put(
          `/api/delivery/produtos/${cod_barras}`,
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
        await apiMensura.delete(`/api/delivery/produtos/${cod_barras}`);
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
