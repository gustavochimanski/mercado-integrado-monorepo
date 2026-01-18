// @cardapio/services/adicionais/index.ts
export * from "./buscar-adicionais-produto-client";
export * from "./buscar-adicionais-combo-client";
export * from "./buscar-adicionais-receita-client";
export * from "./upload-imagem";

// Aliases para manter compatibilidade (client-side) - mantém nomes originais
export { useBuscarAdicionaisProdutoClient as useAdicionaisProduto } from "./buscar-adicionais-produto-client";
export { useBuscarAdicionaisComboClient as useAdicionaisCombo } from "./buscar-adicionais-combo-client";
export { useBuscarAdicionaisReceitaClient as useAdicionaisReceita } from "./buscar-adicionais-receita-client";

