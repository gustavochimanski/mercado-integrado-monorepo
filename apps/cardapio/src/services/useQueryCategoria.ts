import apiAdmin from "@cardapio/app/api/apiAdmin";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CategoriaMini } from "./useQueryHome";

interface CreateCategoriaBody {
  descricao: string;
  cod_empresa: number;
  parent_id?: number | null;
  slug?: string;
  posicao?: number;
}

interface UpdateCategoriaBody extends CreateCategoriaBody {
  id: number;
}

interface UploadImagemBody {
  id: number;
  cod_empresa: number;
  imagem: File;
}


// ✅ Hook para buscar por ID
export function useCategoriaById(catId: number) {
  return useQuery({
    queryKey: ["categoria", catId],
    queryFn: async () => {
      const { data } = await apiAdmin.get<CategoriaMini>(`api/delivery/categorias/${catId}`);
      return data;
    },
    enabled: !!catId, // só busca se tiver ID válido
  });
}

export function useMutateCategoria() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["categorias_planas"] });
    qc.invalidateQueries({ queryKey: ["categorias"] });
  };

  const create = useMutation({
    mutationFn: (body: CreateCategoriaBody) => apiAdmin.post("api/delivery/categorias", body),
    onSuccess: () => {
      toast.success("Categoria criada com sucesso!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)), 
  });

  const update = useMutation({
    mutationFn: ({ id, ...body }: UpdateCategoriaBody) =>
      apiAdmin.put(`api/delivery/categorias/${id}`, body),
    onSuccess: () => {
      toast.success("Categoria atualizada com sucesso!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)), 
  });

  const uploadImagem = useMutation({
    mutationFn: ({ id, cod_empresa, imagem }: UploadImagemBody) => {
      const fd = new FormData();
      fd.append("cod_empresa", String(cod_empresa));
      fd.append("imagem", imagem);
      return apiAdmin.patch(`api/delivery/categorias/${id}/imagem`, fd);
    },
    onSuccess: () => {
      toast.success("Imagem atualizada!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)), 
  });

  const remove = useMutation({
    mutationFn: (id: number) => apiAdmin.delete(`api/delivery/categorias/${id}`),
    onSuccess: () => {
      toast.success("Categoria removida com sucesso!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)), 
  });

  const moveRight = useMutation({
    mutationFn: (id: number) => apiAdmin.post(`api/delivery/categorias/${id}/move-right`),
    onSuccess: () => {
      toast.success("Categoria movida para a direita!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const moveLeft = useMutation({
    mutationFn: (id: number) => apiAdmin.post(`api/delivery/categorias/${id}/move-left`),
    onSuccess: () => {
      toast.success("Categoria movida para a esquerda!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  return { create, update, uploadImagem, remove, moveRight, moveLeft };
}
