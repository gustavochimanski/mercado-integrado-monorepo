"use client";

import React, { useEffect, useState, useMemo } from "react";

interface TempoPedidoBadgeProps {
  dataCriacao: string; // String do backend, ex: "2025-09-02T20:07:44"
  limiteMinutos?: number; // Limite em minutos
}

const TempoPedidoBadge: React.FC<TempoPedidoBadgeProps> = ({
  dataCriacao,
  limiteMinutos = 30,
}) => {
  const [tempoSegundos, setTempoSegundos] = useState<number>(0);

  useEffect(() => {
    // Força UTC: adiciona 'Z' se não existir
    const isoUTC = dataCriacao.endsWith("Z") ? dataCriacao : dataCriacao + "Z";
    const criado = Date.parse(isoUTC);

    const interval = setInterval(() => {
      const agora = Date.now();
      const diffSegundos = Math.max(0, Math.floor((agora - criado) / 1000));
      setTempoSegundos(diffSegundos);
    }, 1000);

    return () => clearInterval(interval);
  }, [dataCriacao]);

  const minutosPassados = useMemo(() => Math.floor(tempoSegundos / 60), [tempoSegundos]);
  const percentual = useMemo(
    () => Math.min(100, (minutosPassados / limiteMinutos) * 100),
    [minutosPassados, limiteMinutos]
  );

  const corBadge = useMemo(() => {
    if (percentual < 50) return "bg-green-500 text-white";
    if (percentual < 80) return "bg-yellow-500 text-black";
    return "bg-red-600 text-white";
  }, [percentual]);

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${corBadge}`}
      title={`Pedido feito há ${minutosPassados} minuto(s)`}
    >
      {minutosPassados} min
    </span>
  );
};

export default TempoPedidoBadge;
