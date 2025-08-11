import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const BASE = "api/delivery/categorias";

export function useMutateCategoria() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["categorias_planas"] });
    qc.invalidateQueries({ queryKey: ["categorias"] });
  };

  const create = useMutation({
    mutationFn: (body: any) => apiAdmin.post(BASE, body),
    onSuccess: () => {
      toast.success("Categoria criada com sucesso!");
      invalidate();
    },
    onError: () => toast.error("Erro ao criar categoria"),
  });

  const update = useMutation({
    mutationFn: ({ id, ...body }: any) => apiAdmin.put(`${BASE}/${id}`, body),
    onSuccess: () => {
      toast.success("Categoria atualizada com sucesso!");
      invalidate();
    },
    onError: () => toast.error("Erro ao atualizar categoria"),
  });

  const uploadImagem = useMutation({
    mutationFn: ({ id, cod_empresa, imagem }: { id: number; cod_empresa: number; imagem: File }) => {
      const fd = new FormData();
      fd.append("cod_empresa", String(cod_empresa));
      fd.append("imagem", imagem);
      return apiAdmin.patch(`${BASE}/${id}/imagem`, fd);
    },
    onSuccess: () => {
      toast.success("Imagem atualizada!");
      invalidate();
    },
    onError: () => toast.error("Erro ao enviar imagem"),
  });

  return { create, update, uploadImagem };
}
