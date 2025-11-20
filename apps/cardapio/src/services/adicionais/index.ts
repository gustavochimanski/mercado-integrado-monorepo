// @cardapio/services/adicionais/index.ts
import { useCriarAdicional } from "./criar-adicional";
import { useAtualizarAdicional } from "./atualizar-adicional";
import { useRemoverAdicional } from "./remover-adicional";
import { useVincularAdicionaisProduto } from "./vincular-produto";

export * from "./types";
export * from "./listar-adicionais";
export * from "./buscar-adicional";
export * from "./listar-adicionais-produto";
export * from "./criar-adicional";
export * from "./atualizar-adicional";
export * from "./remover-adicional";
export * from "./vincular-produto";
export * from "./buscar-adicionais-produto-client";
export * from "./buscar-adicionais-combo-client";
export * from "./buscar-adicionais-receita-client";

// Aliases para manter compatibilidade (admin)
export { useListarAdicionais as useAdicionais } from "./listar-adicionais";
export { useBuscarAdicional as useAdicionalById } from "./buscar-adicional";
export { useListarAdicionaisProduto as useAdicionaisProdutoAdmin } from "./listar-adicionais-produto";

// Aliases para manter compatibilidade (client-side) - mantém nomes originais
export { useBuscarAdicionaisProdutoClient as useAdicionaisProduto } from "./buscar-adicionais-produto-client";
export { useBuscarAdicionaisComboClient as useAdicionaisCombo } from "./buscar-adicionais-combo-client";
export { useBuscarAdicionaisReceitaClient as useAdicionaisReceita } from "./buscar-adicionais-receita-client";

// Exportar useMutateAdicional como objeto com todas as mutations
export function useMutateAdicional() {
  const create = useCriarAdicional();
  const update = useAtualizarAdicional();
  const remove = useRemoverAdicional();
  const vincularProduto = useVincularAdicionaisProduto();

  return {
    create,
    update,
    remove,
    vincularProduto,
  };
}

