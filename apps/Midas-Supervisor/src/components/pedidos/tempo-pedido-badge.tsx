'use client'

import { useEffect, useState, useMemo } from 'react'

interface TempoPedidoBadgeProps {
  dataCriacao: string // String do backend, ex: "2025-09-02T20:07:44"
  limiteMinutos?: number // Limite em minutos
}

export function TempoPedidoBadge({
  dataCriacao,
  limiteMinutos = 30,
}: TempoPedidoBadgeProps) {
  const [tempoSegundos, setTempoSegundos] = useState<number>(0)

  useEffect(() => {
    const isoUTC = dataCriacao.endsWith('Z') ? dataCriacao : dataCriacao + 'Z'
    const criado = Date.parse(isoUTC)

    const interval = setInterval(() => {
      const agora = Date.now()
      const diffSegundos = Math.max(0, Math.floor((agora - criado) / 1000))
      setTempoSegundos(diffSegundos)
    }, 1000)

    return () => clearInterval(interval)
  }, [dataCriacao])

  const minutosPassados = useMemo(
    () => Math.floor(tempoSegundos / 60),
    [tempoSegundos]
  )

  const percentual = useMemo(
    () => Math.min(100, (minutosPassados / limiteMinutos) * 100),
    [minutosPassados, limiteMinutos]
  )

  // Define a cor baseada no percentual
  const corBadge = useMemo(() => {
    if (percentual < 50)
      return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300'
    if (percentual < 70)
      return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300'
    if (percentual < 80)
      return 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300'
    return 'bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-300' // crítico
  }, [percentual])

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${corBadge}`}
      title={`Pedido feito há ${minutosPassados} minuto(s)`}
    >
      {minutosPassados} min
    </span>
  )
}
