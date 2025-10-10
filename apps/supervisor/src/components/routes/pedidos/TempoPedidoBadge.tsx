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

  // Define a cor e se deve piscar
  const { corBadge, devePiscar } = useMemo(() => {
    if (percentual < 50) return { corBadge: "bg-emerald-100 text-emerald-600", devePiscar: false };
    if (percentual < 70) return { corBadge: "bg-yellow-100 text-yellow-600", devePiscar: false };
    if (percentual < 80) return { corBadge: "bg-orange-100 text-orange-600", devePiscar: false };
    return { corBadge: "bg-rose-100 text-rose-600", devePiscar: true }; // crítico, vai piscar
  }, [percentual]);

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${corBadge} ${
        devePiscar ? "animate-bounce" : ""
      }`}
      title={`Pedido feito há ${minutosPassados} minuto(s)`}
    >
      {minutosPassados} min
    </span>
  );
};

export default TempoPedidoBadge;
