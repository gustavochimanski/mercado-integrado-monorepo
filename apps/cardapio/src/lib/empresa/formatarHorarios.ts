// @cardapio/lib/empresa/formatarHorarios.ts
import type { HorarioDia } from "@cardapio/services/empresa/types";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;

/**
 * Formata horários de funcionamento para exibição.
 * Util para `empresa.horarios_funcionamento` (obtido com `?empresa_id=X`).
 *
 * @example
 * ```ts
 * formatarHorarios(empresa.horarios_funcionamento);
 * // "Seg: 08:00 - 12:00, 14:00 - 18:00 | Ter: 08:00 - 12:00, 14:00 - 18:00"
 * ```
 */
export function formatarHorarios(horarios: HorarioDia[] | null | undefined): string {
  if (!horarios || horarios.length === 0) {
    return "Horários não disponíveis";
  }

  return horarios
    .map((dia) => {
      const nomeDia = DIAS_SEMANA[dia.dia_semana] ?? `Dia ${dia.dia_semana}`;
      const intervalos = dia.intervalos
        .map((i) => `${i.inicio} - ${i.fim}`)
        .join(", ");
      return `${nomeDia}: ${intervalos}`;
    })
    .join(" | ");
}
