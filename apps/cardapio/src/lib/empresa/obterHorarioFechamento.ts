// @cardapio/lib/empresa/obterHorarioFechamento.ts
import type { HorarioDia } from "@cardapio/services/empresa/types";

interface HorarioFechamento {
  horario: string;
  minutosRestantes: number;
}

/**
 * Obtém o próximo horário de fechamento da loja quando ela está aberta.
 * 
 * @param horarios - Array de horários de funcionamento
 * @param dataReferencia - Data de referência (padrão: agora)
 * @returns Informações sobre o próximo fechamento ou null se não houver
 */
export function obterHorarioFechamento(
  horarios: HorarioDia[] | null | undefined,
  dataReferencia: Date = new Date()
): HorarioFechamento | null {
  if (!horarios || horarios.length === 0) {
    return null;
  }

  const agora = dataReferencia;
  const diaSemanaAtual = agora.getDay();
  const horaAtual = agora.getHours();
  const minutoAtual = agora.getMinutes();
  const horaMinutoAtual = horaAtual * 60 + minutoAtual;

  // Buscar horários do dia atual
  const horarioDia = horarios.find((h) => h.dia_semana === diaSemanaAtual);

  if (!horarioDia || !horarioDia.intervalos || horarioDia.intervalos.length === 0) {
    return null;
  }

  // Encontrar todos os intervalos em que a loja está aberta e pegar o que fecha mais tarde
  let intervaloAtual: { intervalo: typeof horarioDia.intervalos[0]; minutosRestantes: number } | null = null;

  for (const intervalo of horarioDia.intervalos) {
    const [horaInicio, minutoInicio] = intervalo.inicio.split(":").map(Number);
    const [horaFim, minutoFim] = intervalo.fim.split(":").map(Number);

    const inicioMinutos = horaInicio * 60 + minutoInicio;
    const fimMinutos = horaFim * 60 + minutoFim;

    // Verificar se estamos dentro deste intervalo
    let dentroDoIntervalo = false;
    
    // Se o intervalo cruza a meia-noite (ex: 22:00 - 02:00)
    if (fimMinutos < inicioMinutos) {
      dentroDoIntervalo = horaMinutoAtual >= inicioMinutos || horaMinutoAtual <= fimMinutos;
    } else {
      // Intervalo normal (ex: 08:00 - 18:00)
      dentroDoIntervalo = horaMinutoAtual >= inicioMinutos && horaMinutoAtual <= fimMinutos;
    }

    if (dentroDoIntervalo) {
      // Calcular minutos restantes até o fechamento
      let minutosRestantes: number;
      
      if (fimMinutos < inicioMinutos) {
        // Intervalo cruza meia-noite
        if (horaMinutoAtual >= inicioMinutos) {
          // Estamos depois da meia-noite, mas antes do fim
          minutosRestantes = fimMinutos - horaMinutoAtual;
        } else {
          // Estamos antes da meia-noite, calcular até o fim (que é no dia seguinte)
          minutosRestantes = (24 * 60 - horaMinutoAtual) + fimMinutos;
        }
      } else {
        // Intervalo normal
        minutosRestantes = fimMinutos - horaMinutoAtual;
      }

      // Se não temos um intervalo ainda, ou se este fecha mais tarde (mais minutos restantes), usar este
      if (!intervaloAtual || minutosRestantes > intervaloAtual.minutosRestantes) {
        intervaloAtual = {
          intervalo,
          minutosRestantes: Math.max(0, minutosRestantes),
        };
      }
    }
  }

  if (intervaloAtual) {
    return {
      horario: intervaloAtual.intervalo.fim,
      minutosRestantes: intervaloAtual.minutosRestantes,
    };
  }

  return null;
}

/**
 * Formata a mensagem de fechamento
 */
export function formatarMensagemFechamento(fechamento: HorarioFechamento | null): string | null {
  if (!fechamento) {
    return null;
  }

  if (fechamento.minutosRestantes < 30) {
    return `Corre! A loja vai fechar em ${fechamento.minutosRestantes} ${fechamento.minutosRestantes === 1 ? 'minuto' : 'minutos'}`;
  }

  return `Fecha às ${fechamento.horario}`;
}
