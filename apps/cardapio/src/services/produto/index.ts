// @cardapio/services/produto/index.ts
import { useAtualizarProduto } from "./atualizar-produto";

export * from "./types";
export * from "./buscar-produtos";
export * from "./listar-produtos";
export * from "./atualizar-produto";

// Aliases para manter compatibilidade
export { useBuscarProdutos as useSearchProdutos } from "./buscar-produtos";
export { useListarProdutos as useFetchCadProdDelivery } from "./listar-produtos";

// Exportar useMutateProduto como objeto com todas as mutations
export function useMutateProduto() {
  const update = useAtualizarProduto();

  return { update };
}

