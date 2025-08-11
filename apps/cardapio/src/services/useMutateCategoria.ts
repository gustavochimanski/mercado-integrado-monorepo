// src/hooks/useMutateCategoria.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { slugify } from "@cardapio/lib/slugfy";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * IMPORTANTE:
 * Se o apiAdmin NÃO tiver baseURL '/api', troque BASE para "/api/delivery/categorias"
 */
const BASE = "/delivery/categorias";

type TipoExibicao = "P" | null | undefined; // "P" = aparece na home

interface NovoBody {
  cod_empresa: number;
  descricao: string;
  slug?: string;
  imagem?: File;
  parent_id?: number | null;
  posicao?: number;
  tipo_exibicao?: TipoExibicao; // só no create
}

interface UpdateBody {
  id: number;
  cod_empresa: number;
  descricao: string;
  slug?: string;
  imagem?: File;
  parent_id?: number | null;
  posicao?: number;
  // sem tipo_exibicao no PUT (o toggle é endpoint próprio)
}

function buildFormDataCreate(body: NovoBody) {
  const fd = new FormData();
  const finalSlug = body.slug ?? slugify(body.descricao);

  fd.append("cod_empresa", String(body.cod_empresa));
  fd.append("descricao", body.descricao.trim());
  fd.append("slug", finalSlug);

  if (body.parent_id !== undefined && body.parent_id !== null) {
    fd.append("parent_id", String(body.parent_id));
  }
  if (typeof body.posicao === "number") {
    fd.append("posicao", String(body.posicao));
  }
  if (body.tipo_exibicao) {
    fd.append("tipo_exibicao", body.tipo_exibicao);
  }
  if (body.imagem) {
    fd.append("imagem", body.imagem);
  }

  return fd;
}

function buildFormDataUpdate(body: Omit<UpdateBody, "id">) {
  const fd = new FormData();
  const finalSlug = body.slug ?? slugify(body.descricao);

  fd.append("cod_empresa", String(body.cod_empresa));
  fd.append("descricao", body.descricao.trim());
  fd.append("slug", finalSlug);

  if (body.parent_id !== undefined && body.parent_id !== null) {
    fd.append("parent_id", String(body.parent_id));
  }
  if (typeof body.posicao === "number") {
    fd.append("posicao", String(body.posicao));
  }
  // NÃO append de imagem se não houver arquivo novo
  if (body.imagem) {
    fd.append("imagem", body.imagem);
  }

  return fd;
}

export function useMutateCategoria() {
  const qc = useQueryClient();

  // Helpers de cache/UX
  const onOk = (msg: string) => {
    qc.invalidateQueries({ queryKey: ["categorias_planas"] });
    qc.invalidateQueries({ queryKey: ["categorias"] });
    toast.success(msg);
    // hard refresh leve (só se realmente precisar)
    setTimeout(() => window.location.reload(), 800);
  };
  const onErr = (msg: string) => toast.error(msg);

  const create = useMutation({
    mutationFn: (body: NovoBody) =>
      apiAdmin.post(`${BASE}`, buildFormDataCreate(body)),
    onSuccess: () => onOk("Categoria criada com sucesso!"),
    onError: () => onErr("Erro ao criar categoria."),
  });

  const update = useMutation({
    mutationFn: ({ id, ...rest }: UpdateBody) =>
      apiAdmin.put(`${BASE}/${id}`, buildFormDataUpdate(rest)),
    onSuccess: () => onOk("Categoria atualizada com sucesso!"),
    onError: () => onErr("Erro ao atualizar categoria."),
  });

  const remove = useMutation({
    mutationFn: (id: number) => apiAdmin.delete(`${BASE}/${id}`),
    onSuccess: () => onOk("Categoria removida com sucesso!"),
    onError: () => onErr("Erro ao remover categoria."),
  });

  const moveRight = useMutation({
    mutationFn: (id: number) => apiAdmin.post(`${BASE}/${id}/move-right`),
    onSuccess: () => onOk("Categoria movida para a direita!"),
    onError: () => onErr("Erro ao mover categoria para a direita."),
  });

  const moveLeft = useMutation({
    mutationFn: (id: number) => apiAdmin.post(`${BASE}/${id}/move-left`),
    onSuccess: () => onOk("Categoria movida para a esquerda!"),
    onError: () => onErr("Erro ao mover categoria para a esquerda."),
  });

  const toggleHome = useMutation({
    mutationFn: (id: number) => apiAdmin.post(`${BASE}/${id}/toggle-home`),
    onSuccess: () => onOk("Visibilidade na Home atualizada!"),
    onError: () => onErr("Erro ao alternar visibilidade na Home."),
  });

  return { create, update, remove, moveRight, moveLeft, toggleHome };
}
