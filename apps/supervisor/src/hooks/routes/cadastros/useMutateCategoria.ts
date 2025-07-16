// src/hooks/useMutateCategoria.ts
import apiMensura from "@supervisor/lib/api/apiMensura";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import slugify from "slugify";
import { toast } from "sonner";

interface NovoBody {
  descricao: string;
  slug?: string;
  imagem?: File;
}

interface UpdateBody extends NovoBody {
  id: number;
  posicao?: number;
  slug_pai?: string | null;
}

export function useMutateCategoria(parentSlug: string | null = null) {
  const qc = useQueryClient();

  function buildFormData({
    descricao,
    slug,
    imagem,
    posicao,
    slug_pai,
  }: NovoBody & { posicao?: number; slug_pai?: string | null }) {
    const fd = new FormData();
    const finalSlug = slug ?? slugify(descricao);

    fd.append("descricao", descricao.trim());
    fd.append("slug", finalSlug);
    fd.append("slug_pai", slug_pai ?? parentSlug ?? "");
    if (posicao !== undefined) fd.append("posicao", String(posicao));
    if (imagem) fd.append("imagem", imagem);

    return fd;
  }

  const createSub = useMutation({
    mutationFn: (body: NovoBody) =>
      apiMensura.post("/mensura/categorias/delivery", buildFormData(body)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categorias_planas"] });
      qc.invalidateQueries({ queryKey: ["categorias"] });
      toast.success("Categoria criada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao criar categoria.");
    },
  });

  const update = useMutation({
    mutationFn: ({ id, ...body }: UpdateBody) =>
      apiMensura.put(`/mensura/categorias/delivery/${id}`, buildFormData(body)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categorias_planas"] });
      qc.invalidateQueries({ queryKey: ["categorias"] });
      toast.success("Categoria atualizada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar categoria.");
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) =>
      apiMensura.delete(`/mensura/categorias/delivery/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categorias_planas"] });
      qc.invalidateQueries({ queryKey: ["categorias"] });
      toast.success("Categoria removida com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao remover categoria.");
    },
  });

  const moveRight = useMutation({
    mutationFn: (id: number) =>
      apiMensura.post(`/mensura/categorias/delivery/${id}/move-right`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categorias_planas"] });
      qc.invalidateQueries({ queryKey: ["categorias"] });
      toast.success("Categoria movida para a direita!");
    },
    onError: () => {
      toast.error("Erro ao mover categoria para a direita.");
    },
  });

  const moveLeft = useMutation({
    mutationFn: (id: number) =>
      apiMensura.post(`/mensura/categorias/delivery/${id}/move-left`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categorias_planas"] });
      qc.invalidateQueries({ queryKey: ["categorias"] });
      toast.success("Categoria movida para a esquerda!");
    },
    onError: () => {
      toast.error("Erro ao mover categoria para a esquerda.");
    },
  });

  return { createSub, update, remove, moveRight, moveLeft };
}
