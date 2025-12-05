// @cardapio/services/produto/index.ts
import { useAtualizarProduto } from "./atualizar-produto";

export * from "./types";
export * from "./buscar-produtos";
export * from "./atualizar-produto";

// Alias para manter compatibilidade
export { useBuscarProdutos as useSearchProdutos } from "./buscar-produtos";

// Exportar useMutateProduto como objeto com todas as mutations
export function useMutateProduto() {
  const update = useAtualizarProduto();

  return { update };
}

