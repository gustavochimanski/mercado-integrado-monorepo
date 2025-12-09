// @cardapio/services/complementos/index.ts
export * from "./buscar-complementos-produto-client";
export * from "./buscar-complementos-combo-client";
export * from "./buscar-complementos-receita-client";

// Aliases para facilitar uso
export { useBuscarComplementosProdutoClient as useComplementosProduto } from "./buscar-complementos-produto-client";
export { useBuscarComplementosComboClient as useComplementosCombo } from "./buscar-complementos-combo-client";
export { useBuscarComplementosReceitaClient as useComplementosReceita } from "./buscar-complementos-receita-client";

