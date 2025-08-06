// src/hooks/useMutateCategoria.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { slugify } from "@cardapio/lib/slugfy";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface NovoBody {
  cod_empresa: number;
  descricao: string;
  slug?: string;
  imagem?: File;
  parent_id?: number | null; // ✅ novo campo correto
}

interface UpdateBody extends NovoBody {
  id: number;
  posicao?: number;
}


interface UpdateBody extends NovoBody {
  id: number;
  posicao?: number;
  slug_pai?: string | null;
}

interface NovoBody {
  cod_empresa: number;    // ← adiciona aqui
  descricao:   string;
  slug?:       string;
  imagem?:     File;
}

interface UpdateBody extends NovoBody {
  id:        number;
  posicao?:  number;
  slug_pai?: string | null;
}

export function useMutateCategoria(parentSlug: string | null = null) {
  const qc = useQueryClient();

  function buildFormData({
    cod_empresa,
    descricao,
    slug,
    imagem,
    posicao,
    parent_id,
  }: NovoBody & { posicao?: number }) {
    const fd = new FormData();
    const finalSlug = slug ?? slugify(descricao);

    fd.append("cod_empresa", String(cod_empresa));
    fd.append("descricao", descricao.trim());
    fd.append("slug", finalSlug);
    if (parent_id !== undefined && parent_id !== null) {
      fd.append("parent_id", String(parent_id));
    }
    if (posicao !== undefined) fd.append("posicao", String(posicao));
    if (imagem) fd.append("imagem", imagem);

    return fd;
  }


  const createSub = useMutation({
    mutationFn: (body: NovoBody) =>
      apiAdmin.post("/delivery/categorias/delivery", buildFormData(body)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categorias_planas"] });
      qc.invalidateQueries({ queryKey: ["categorias"] });
      toast.success("Categoria criada com sucesso!");
      setTimeout(() => window.location.reload(), 800);
    },
    onError: () => {
      toast.error("Erro ao criar categoria.");
    },
  });

  const update = useMutation({
    mutationFn: ({ id, ...body }: UpdateBody) =>
      apiAdmin.put(`/delivery/categorias/delivery/${id}`, buildFormData(body)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categorias_planas"] });
      qc.invalidateQueries({ queryKey: ["categorias"] });
      toast.success("Categoria atualizada com sucesso!");
      setTimeout(() => window.location.reload(), 800);
    },
    onError: () => {
      toast.error("Erro ao atualizar categoria.");
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) =>
      apiAdmin.delete(`/delivery/categorias/delivery/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categorias_planas"] });
      qc.invalidateQueries({ queryKey: ["categorias"] });
      toast.success("Categoria removida com sucesso!");
      setTimeout(() => window.location.reload(), 800);
    },
    onError: () => {
      toast.error("Erro ao remover categoria.");
    },
  });

  const moveRight = useMutation({
    mutationFn: (id: number) =>
      apiAdmin.post(`/delivery/categorias/delivery/${id}/move-right`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categorias_planas"] });
      qc.invalidateQueries({ queryKey: ["categorias"] });
      toast.success("Categoria movida para a direita!");
      setTimeout(() => window.location.reload(), 800);
    },
    onError: () => {
      toast.error("Erro ao mover categoria para a direita.");
    },
  });

  const moveLeft = useMutation({
    mutationFn: (id: number) =>
      apiAdmin.post(`/delivery/categorias/delivery/${id}/move-left`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categorias_planas"] });
      qc.invalidateQueries({ queryKey: ["categorias"] });
      toast.success("Categoria movida para a esquerda!");
      setTimeout(() => window.location.reload(), 800);
    },
    onError: () => {
      toast.error("Erro ao mover categoria para a esquerda.");
    },
  });

  return { createSub, update, remove, moveRight, moveLeft };
}
