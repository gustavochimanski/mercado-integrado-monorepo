// @cardapio/services/mesa/index.ts
export * from "./types";
export * from "./listar-mesas-disponiveis";
export * from "./listar-mesas";
export * from "./buscar-mesa";
export * from "./buscar-estatisticas";

// Aliases para manter compatibilidade
export { useListarMesasDisponiveis as useQueryMesasDisponiveis } from "./listar-mesas-disponiveis";
export { useListarMesas as useQueryMesas } from "./listar-mesas";
export { useBuscarMesa as useQueryMesaById } from "./buscar-mesa";
export { useBuscarEstatisticasMesas as useQueryMesaStats } from "./buscar-estatisticas";

