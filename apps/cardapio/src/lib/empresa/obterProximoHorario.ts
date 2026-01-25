// @cardapio/lib/empresa/obterProximoHorario.ts
import type { HorarioDia } from "@cardapio/services/empresa/types";

interface ProximoHorario {
  dia: string;
  horario: string;
  diasRestantes?: number;
}

const DIAS_SEMANA = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"] as const;
const DIAS_SEMANA_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;

/**
 * Obtém o próximo horário de abertura da loja.
 * 
 * @param horarios - Array de horários de funcionamento
 * @param dataReferencia - Data de referência (padrão: agora)
 * @returns Informações sobre o próximo horário de abertura ou null se não houver
 */
export function obterProximoHorario(
  horarios: HorarioDia[] | null | undefined,
  dataReferencia: Date = new Date()
): ProximoHorario | null {
  if (!horarios || horarios.length === 0) {
    return null;
  }

  const agora = dataReferencia;
  const diaSemanaAtual = agora.getDay();
  const horaAtual = agora.getHours();
  const minutoAtual = agora.getMinutes();
  const horaMinutoAtual = horaAtual * 60 + minutoAtual;

  // Ordenar horários por dia da semana
  const horariosOrdenados = [...horarios].sort((a, b) => a.dia_semana - b.dia_semana);

  // Verificar se há horário hoje ainda
  const horarioHoje = horariosOrdenados.find((h) => h.dia_semana === diaSemanaAtual);
  if (horarioHoje && horarioHoje.intervalos.length > 0) {
    for (const intervalo of horarioHoje.intervalos) {
      const [horaInicio, minutoInicio] = intervalo.inicio.split(":").map(Number);
      const inicioMinutos = horaInicio * 60 + minutoInicio;
      
      // Se ainda não chegou neste intervalo hoje, retornar
      if (horaMinutoAtual < inicioMinutos) {
        return {
          dia: "Hoje",
          horario: intervalo.inicio,
        };
      }
    }
  }

  // Buscar próximo dia com horário
  for (let dias = 1; dias <= 7; dias++) {
    const diaProximo = (diaSemanaAtual + dias) % 7;
    const horarioDia = horariosOrdenados.find((h) => h.dia_semana === diaProximo);
    
    if (horarioDia && horarioDia.intervalos.length > 0) {
      const primeiroIntervalo = horarioDia.intervalos[0];
      const nomeDia = dias === 1 ? "Amanhã" : DIAS_SEMANA[diaProximo];
      
      return {
        dia: nomeDia,
        horario: primeiroIntervalo.inicio,
        diasRestantes: dias,
      };
    }
  }

  return null;
}

/**
 * Formata o próximo horário para exibição amigável
 */
export function formatarProximoHorario(proximo: ProximoHorario | null): string {
  if (!proximo) {
    return "Horários não disponíveis";
  }

  if (proximo.dia === "Hoje") {
    return `Hoje às ${proximo.horario}`;
  }

  if (proximo.dia === "Amanhã") {
    return `Amanhã às ${proximo.horario}`;
  }

  return `${proximo.dia} às ${proximo.horario}`;
}
