// @cardapio/lib/empresa/verificarLojaAberta.ts
import type { HorarioDia } from "@cardapio/services/empresa/types";

/**
 * Verifica se a loja está aberta no momento atual baseado nos horários de funcionamento.
 * 
 * @param horarios - Array de horários de funcionamento da empresa
 * @param timezone - Timezone da empresa (opcional, padrão: timezone do navegador)
 * @param dataReferencia - Data de referência para verificação (opcional, padrão: data atual)
 * @returns true se a loja está aberta, false caso contrário
 * 
 * @example
 * ```ts
 * const estaAberta = verificarLojaAberta(empresa.horarios_funcionamento);
 * ```
 */
export function verificarLojaAberta(
  horarios: HorarioDia[] | null | undefined,
  timezone?: string,
  dataReferencia?: Date
): boolean {
  // Se não há horários configurados, considera como aberta
  if (!horarios || horarios.length === 0) {
    return true;
  }

  // Se não há data de referência, retorna false (evita erro de hidratação)
  if (!dataReferencia) {
    return false;
  }

  // Obter data/hora atual no timezone da empresa ou do navegador
  const agora = timezone 
    ? new Date(dataReferencia.toLocaleString("en-US", { timeZone: timezone }))
    : dataReferencia;

  const diaSemanaAtual = agora.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
  const horaAtual = agora.getHours();
  const minutoAtual = agora.getMinutes();
  const horaMinutoAtual = horaAtual * 60 + minutoAtual; // Converter para minutos desde meia-noite

  // Buscar horários do dia atual
  const horarioDia = horarios.find((h) => h.dia_semana === diaSemanaAtual);

  // Se não há horário configurado para o dia atual, considera como fechada
  if (!horarioDia || !horarioDia.intervalos || horarioDia.intervalos.length === 0) {
    return false;
  }

  // Verificar se o horário atual está dentro de algum intervalo
  return horarioDia.intervalos.some((intervalo) => {
    const [horaInicio, minutoInicio] = intervalo.inicio.split(":").map(Number);
    const [horaFim, minutoFim] = intervalo.fim.split(":").map(Number);

    const inicioMinutos = horaInicio * 60 + minutoInicio;
    const fimMinutos = horaFim * 60 + minutoFim;

    // Se o intervalo cruza a meia-noite (ex: 22:00 - 02:00)
    if (fimMinutos < inicioMinutos) {
      return horaMinutoAtual >= inicioMinutos || horaMinutoAtual <= fimMinutos;
    }

    // Intervalo normal (ex: 08:00 - 18:00)
    return horaMinutoAtual >= inicioMinutos && horaMinutoAtual <= fimMinutos;
  });
}
