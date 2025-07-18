// src/services/useQueryProduto.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { TypeCadProdDeliveryResponse } from "@cardapio/types/cadProdDeliveryType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateProdutoBody {
  cod_empresa: number;
  formData: FormData;
}

interface UpdateProdutoBody {
  cod_empresa: number;
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
      const res = await apiAdmin.get(
        `/mensura/produtos/delivery?cod_empresa=${cod_empresa}&page=${page}&limit=${limit}`
      );
      return res.data;
    },
  });
}

export function useMutateProduto() {
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: async ({ cod_empresa, formData }: CreateProdutoBody) => {
      try {
        formData.append("cod_empresa", String(cod_empresa));

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
    mutationFn: async ({ cod_barras, cod_empresa, formData }: UpdateProdutoBody) => {
      try {
        formData.append("cod_empresa", String(cod_empresa));

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
