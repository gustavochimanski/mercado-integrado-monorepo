// @cardapio/services/home/index.ts
export * from "./types";
export * from "./buscar-home";
export * from "./buscar-categoria-por-slug";
export * from "./listar-produtos-vitrine-por-categoria";

// Aliases para manter compatibilidade
export { useBuscarHome as useHome } from "./buscar-home";
export { useBuscarCategoriaPorSlug as useCategoriaPorSlug } from "./buscar-categoria-por-slug";
export { useListarProdutosVitrinePorCategoria as useProdutosVitrinePorCategoria } from "./listar-produtos-vitrine-por-categoria";

