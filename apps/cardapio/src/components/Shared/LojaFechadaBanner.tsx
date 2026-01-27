"use client";

import { useMemo, useState, useEffect } from "react";
import { verificarLojaAberta } from "@cardapio/lib/empresa/verificarLojaAberta";
import { obterProximoHorario, formatarProximoHorario } from "@cardapio/lib/empresa/obterProximoHorario";
import { formatarHorarios } from "@cardapio/lib/empresa/formatarHorarios";
import type { HorarioDia } from "@cardapio/services/empresa/types";
import { Clock, AlertCircle, Calendar, Lock } from "lucide-react";
import Image from "next/image";

interface LojaFechadaBannerProps {
  horarios: HorarioDia[] | null | undefined;
  timezone?: string;
  nomeLoja?: string;
  logo?: string | null;
}

/**
 * Componente de banner destacado para exibir quando a loja está fechada.
 * Mostra mensagem clara, próximo horário de abertura e horários de funcionamento.
 */
export function LojaFechadaBanner({ horarios, timezone, nomeLoja, logo }: LojaFechadaBannerProps) {
  const [agora, setAgora] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setAgora(new Date());
  }, []);

  // Atualizar a cada minuto
  useEffect(() => {
    if (!isMounted) return;

    const interval = setInterval(() => {
      setAgora(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, [isMounted]);

  const estaAberta = useMemo(() => {
    if (!agora || !isMounted || !horarios) return false;
    return verificarLojaAberta(horarios, timezone, agora);
  }, [horarios, timezone, agora, isMounted]);

  const proximoHorario = useMemo(() => {
    if (!agora || !isMounted || !horarios) return null;
    return obterProximoHorario(horarios, agora);
  }, [horarios, agora, isMounted]);

  // Se não há horários, não exibir
  if (!horarios || horarios.length === 0) {
    return null;
  }

  // Durante SSR ou antes da montagem, não renderizar nada para evitar hydration mismatch
  // O componente só será renderizado após a montagem no cliente
  if (!isMounted || !agora) {
    return null;
  }

  // Se está aberta, não exibir
  if (estaAberta) {
    return null;
  }

  const horariosFormatados = formatarHorarios(horarios);
  const proximoHorarioTexto = formatarProximoHorario(proximoHorario);

  // Normalizar URL do logo
  const logoUrl = logo 
    ? (logo.startsWith('http://') || logo.startsWith('https://') 
        ? logo 
        : `https://${logo}`)
    : null;

  return (
    <div className="mx-4 mb-6 rounded-lg border-2 border-amber-500/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 shadow-lg overflow-hidden">
      <div className="p-5 space-y-4">
        {/* Header com logo */}
        <div className="flex items-start gap-4">
          {/* Logo da loja - redonda igual ao header */}
          {logoUrl ? (
            <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden bg-white dark:bg-amber-900/30 border-2 border-amber-200 dark:border-amber-800 shadow-sm relative">
              <Image
                src={logoUrl}
                alt={nomeLoja || "Logo da loja"}
                fill
                sizes="64px"
                className="object-cover"
                unoptimized={logoUrl.includes('mensuraapi.com.br')}
                onError={(e) => {
                  // Se a imagem falhar, esconder o container
                  const target = e.target as HTMLImageElement;
                  if (target.parentElement) {
                    target.parentElement.style.display = 'none';
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/50 border-2 border-amber-200 dark:border-amber-800 shadow-sm flex items-center justify-center">
              <Lock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100">
                Loja Fechada
              </h3>
            </div>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              {nomeLoja ? `${nomeLoja} está fechada no momento` : "Estamos fechados no momento"}
            </p>
          </div>
        </div>

        {/* Próximo horário */}
        {proximoHorario && (
          <div className="flex items-start gap-3 p-3 rounded-md bg-white/60 dark:bg-amber-900/20">
            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Próxima abertura
              </p>
              <p className="text-base font-semibold text-amber-900 dark:text-amber-100">
                {proximoHorarioTexto}
              </p>
            </div>
          </div>
        )}

        {/* Horários de funcionamento */}
        <div className="flex items-start gap-3 p-3 rounded-md bg-white/60 dark:bg-amber-900/20">
          <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
              Horários de funcionamento
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed break-words">
              {horariosFormatados}
            </p>
          </div>
        </div>

        {/* Aviso sobre carrinho */}
        <div className="pt-3 border-t border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
              Você pode visualizar nosso cardápio, mas não será possível adicionar itens ao carrinho até que a loja esteja aberta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
