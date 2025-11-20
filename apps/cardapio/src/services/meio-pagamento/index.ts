// @cardapio/services/meio-pagamento/index.ts
import { useCriarMeioPagamento } from "./criar-meio-pagamento";
import { useAtualizarMeioPagamento } from "./atualizar-meio-pagamento";
import { useRemoverMeioPagamento } from "./remover-meio-pagamento";

export * from "./types";
export * from "./listar-meios-pagamento";
export * from "./criar-meio-pagamento";
export * from "./atualizar-meio-pagamento";
export * from "./remover-meio-pagamento";

// Aliases para manter compatibilidade
export { useListarMeiosPagamento as useMeiosPagamento } from "./listar-meios-pagamento";

// Exportar useMutateMeioPagamento como objeto com todas as mutations
export function useMutateMeioPagamento() {
  const create = useCriarMeioPagamento();
  const update = useAtualizarMeioPagamento();
  const remove = useRemoverMeioPagamento();

  return { create, update, remove };
}

