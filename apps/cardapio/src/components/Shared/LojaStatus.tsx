"use client";

import { useMemo, useState, useEffect } from "react";
import { verificarLojaAberta } from "@cardapio/lib/empresa/verificarLojaAberta";
import type { HorarioDia } from "@cardapio/services/empresa/types";
import { Circle } from "lucide-react";

interface LojaStatusProps {
  horarios: HorarioDia[] | null | undefined;
  timezone?: string;
}

/**
 * Componente discreto para exibir o status da loja (aberta/fechada).
 * Mostra um pequeno indicador visual no canto superior direito.
 * Atualiza automaticamente a cada minuto para refletir mudanças de status.
 */
export function LojaStatus({ horarios, timezone }: LojaStatusProps) {
  const [agora, setAgora] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Garantir que só renderize no cliente para evitar erro de hidratação
  useEffect(() => {
    setIsMounted(true);
    setAgora(new Date());
  }, []);

  // Atualizar a cada minuto para refletir mudanças de status
  useEffect(() => {
    if (!isMounted) return;

    const interval = setInterval(() => {
      setAgora(new Date());
    }, 60000); // Atualizar a cada minuto

    return () => clearInterval(interval);
  }, [isMounted]);

  const estaAberta = useMemo(() => {
    if (!agora || !isMounted) return false; // Durante SSR ou antes da montagem, retorna false
    return verificarLojaAberta(horarios, timezone, agora);
  }, [horarios, timezone, agora, isMounted]);

  // Se não há horários configurados, não exibe nada
  if (!horarios || horarios.length === 0) {
    return null;
  }

  // Não renderizar até estar montado no cliente (evita erro de hidratação)
  if (!isMounted || !agora) {
    return null;
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Circle
        className={`w-2 h-2 transition-colors ${
          estaAberta ? "fill-green-500 text-green-500" : "fill-gray-400 text-gray-400"
        }`}
      />
      <span className="hidden sm:inline">
        {estaAberta ? "Aberta" : "Fechada"}
      </span>
    </div>
  );
}
