// @cardapio/services/categoria/index.ts
import { useCriarCategoria } from "./criar-categoria";
import { useAtualizarCategoria } from "./atualizar-categoria";
import { useUploadImagemCategoria } from "./upload-imagem";
import { useRemoverCategoria } from "./remover-categoria";
import { useMoverCategoriaDireita } from "./mover-direita";
import { useMoverCategoriaEsquerda } from "./mover-esquerda";

export * from "./types";
export * from "./buscar-categoria";
export * from "./buscar-categorias";
export * from "./criar-categoria";
export * from "./atualizar-categoria";
export * from "./upload-imagem";
export * from "./remover-categoria";
export * from "./mover-direita";
export * from "./mover-esquerda";

// Aliases para manter compatibilidade
export { useBuscarCategoria as useCategoriaById } from "./buscar-categoria";
export { useBuscarCategorias as useCategoriasSearch } from "./buscar-categorias";

// Exportar useMutateCategoria como objeto com todas as mutations
export function useMutateCategoria() {
  const create = useCriarCategoria();
  const update = useAtualizarCategoria();
  const uploadImagem = useUploadImagemCategoria();
  const remove = useRemoverCategoria();
  const moveRight = useMoverCategoriaDireita();
  const moveLeft = useMoverCategoriaEsquerda();

  return { create, update, uploadImagem, remove, moveRight, moveLeft };
}

