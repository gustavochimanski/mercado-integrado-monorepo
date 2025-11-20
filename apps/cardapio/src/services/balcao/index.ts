// @cardapio/services/balcao/index.ts
import { useCriarPedidoBalcao } from "./criar-pedido";
import { useAdicionarItemBalcao } from "./adicionar-item";
import { useRemoverItemBalcao } from "./remover-item";
import { useConfirmarPedidoBalcao } from "./confirmar-pedido";
import { useCancelarPedidoBalcao } from "./cancelar-pedido";
import { useFecharContaBalcao } from "./fechar-conta";
import { useReabrirPedidoBalcao } from "./reabrir-pedido";

export * from "./types";
export * from "./listar-pedidos-abertos";
export * from "./listar-pedidos-finalizados";
export * from "./buscar-pedido";
export * from "./buscar-historico";
export * from "./criar-pedido";
export * from "./adicionar-item";
export * from "./remover-item";
export * from "./confirmar-pedido";
export * from "./cancelar-pedido";
export * from "./fechar-conta";
export * from "./reabrir-pedido";

// Aliases para manter compatibilidade
export { useListarPedidosBalcaoAbertos as useQueryPedidosBalcaoAbertos } from "./listar-pedidos-abertos";
export { useListarPedidosBalcaoFinalizados as useQueryPedidosBalcaoFinalizados } from "./listar-pedidos-finalizados";
export { useBuscarPedidoBalcao as useQueryPedidoBalcaoById } from "./buscar-pedido";
export { useBuscarHistoricoPedidoBalcao as useQueryHistoricoPedidoBalcao } from "./buscar-historico";

// Exportar useMutateBalcao como objeto com todas as mutations
export function useMutateBalcao() {
  const criar = useCriarPedidoBalcao();
  const adicionarItem = useAdicionarItemBalcao();
  const removerItem = useRemoverItemBalcao();
  const confirmar = useConfirmarPedidoBalcao();
  const cancelar = useCancelarPedidoBalcao();
  const fecharConta = useFecharContaBalcao();
  const reabrir = useReabrirPedidoBalcao();

  return {
    criar,
    adicionarItem,
    removerItem,
    confirmar,
    cancelar,
    fecharConta,
    reabrir,
  };
}

