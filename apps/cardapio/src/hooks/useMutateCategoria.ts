// src/hooks/useMutateCategoria.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { slugify } from "@cardapio/lib/slugfy";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface NovoBody {
  descricao: string;
  slug?: string;
  imagem?: File;
}

export function useMutateCategoria(parentSlug: string | null) {
  const qc = useQueryClient();

  function buildFormData({ descricao, slug, imagem }: NovoBody) {
    const fd = new FormData();
    const finalSlug = slug ?? slugify(descricao); // 👈 aqui

    fd.append("descricao", descricao.trim());
    fd.append("slug", finalSlug); // sempre envia
    fd.append("slug_pai", parentSlug ?? "");
    if (imagem) fd.append("imagem", imagem);

    return fd;
  }


  const createSub = useMutation({
    mutationFn: (body: NovoBody) =>
      apiAdmin.post("/mensura/categorias/delivery", buildFormData(body)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categorias_planas"] });
      qc.invalidateQueries({ queryKey: ["categorias"] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) =>
      apiAdmin.delete(`/mensura/categorias/delivery/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categorias_planas"] });
      qc.invalidateQueries({ queryKey: ["categorias"] });
    },
  });

  return { createSub, remove };
}
