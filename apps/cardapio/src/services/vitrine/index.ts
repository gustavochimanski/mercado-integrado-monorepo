// @cardapio/services/vitrine/index.ts
import { useCriarVitrine } from "./criar-vitrine";
import { useAtualizarVitrine } from "./atualizar-vitrine";
import { useRemoverVitrine } from "./remover-vitrine";
import { useVincularProduto } from "./vincular-produto";
import { useDesvincularProduto } from "./desvincular-produto";
import { useVincularCombo } from "./vincular-combo";
import { useDesvincularCombo } from "./desvincular-combo";
import { useMarcarHome } from "./marcar-home";
import { useReordenarVitrines } from "./reordenar-vitrines";

export * from "./types";
export * from "./buscar-vitrines";
export * from "./criar-vitrine";
export * from "./atualizar-vitrine";
export * from "./remover-vitrine";
export * from "./vincular-produto";
export * from "./desvincular-produto";
export * from "./vincular-combo";
export * from "./desvincular-combo";
export * from "./marcar-home";
export * from "./reordenar-vitrines";

// Alias para manter compatibilidade
export { useBuscarVitrines as useVitrinesSearch } from "./buscar-vitrines";

// Exportar useMutateVitrine como objeto com todas as mutations
export function useMutateVitrine() {
  const criar = useCriarVitrine();
  const atualizar = useAtualizarVitrine();
  const remover = useRemoverVitrine();
  const vincular = useVincularProduto();
  const desvincular = useDesvincularProduto();
  const vincularCombo = useVincularCombo();
  const desvincularCombo = useDesvincularCombo();
  const markHome = useMarcarHome();
  const reordenar = useReordenarVitrines();

  return {
    create: criar,
    update: atualizar,
    remove: remover,
    vincular: vincular,
    desvincular: desvincular,
    vincularCombo: vincularCombo,
    desvincularCombo: desvincularCombo,
    markHome: markHome,
    reorder: reordenar,
  };
}

