// src/services/useQueryProduto.ts
import { TypeCadProdDeliveryResponse } from "@supervisor/types/routes/cadastros/cadProdDeliveryType";
import apiMensura from "@supervisor/lib/api/apiMensura";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@supervisor/hooks/use-toast";
import { getErrorMessage } from "@supervisor/lib/getErrorMessageOrizon";

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
  const { toast } = useToast();

  const create = useMutation({
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
        toast({ title: "Produto criado", description: "O produto foi criado com sucesso." });
        return data;
      } catch (err: any) {
        toast({ title: "Erro ao criar produto", description: getErrorMessage(err), variant: "destructive"  });
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
        const { data } = await apiMensura.put(`/api/mensura/produtos/${cod_barras}`, formData);
        toast({ title: "Produto atualizado", description: "O produto foi atualizado com sucesso." });
        return data;
      } catch (err: any) {
        toast({ title: "Erro ao atualizar produto", description: getErrorMessage(err), variant: "destructive"  });
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
        await apiMensura.delete(`/api/mensura/produtos/${cod_barras}`);
        toast({ title: "Produto removido", description: "O produto foi removido com sucesso." });
      } catch (err: any) {
        toast({ title: "Erro ao remover produto", description: getErrorMessage(err), variant: "destructive"  });
        throw err;
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["produtos"], exact: false });
    },
  });

  return { create, update, remove };
}
