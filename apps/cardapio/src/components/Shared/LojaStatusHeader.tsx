"use client";

import { useMemo, useState, useEffect } from "react";
import { verificarLojaAberta } from "@cardapio/lib/empresa/verificarLojaAberta";
import type { HorarioDia } from "@cardapio/services/empresa/types";
import { Circle, Clock } from "lucide-react";
import { useLojaAberta } from "@cardapio/hooks/useLojaAberta";
import { obterProximoHorario, formatarProximoHorario } from "@cardapio/lib/empresa/obterProximoHorario";
import { obterHorarioFechamento, formatarMensagemFechamento } from "@cardapio/lib/empresa/obterHorarioFechamento";
import Image from "next/image";

interface LojaStatusHeaderProps {
  horarios?: HorarioDia[] | null | undefined;
  nomeLoja?: string;
  logo?: string | null;
}

/**
 * Cabeçalho que exibe o status da loja (aberta/fechada).
 * Aparece na home e em páginas de categoria quando redireciona_categoria = true.
 * 
 * NOTA: Quando redireciona_categoria = true, a página de categoria vira uma landing page
 * e funciona como a nova "home" do site. Por isso este cabeçalho também aparece lá.
 */
export function LojaStatusHeader({ horarios, nomeLoja, logo }: LojaStatusHeaderProps) {
  const { estaAberta, isLoading, horarios: horariosFromHook } = useLojaAberta();
  const [agora, setAgora] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Usar horários passados como prop ou do hook
  const horariosParaUsar = horarios ?? horariosFromHook;

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

  const statusAberta = useMemo(() => {
    if (!agora || !isMounted || !horariosParaUsar) return null;
    return verificarLojaAberta(horariosParaUsar, undefined, agora);
  }, [horariosParaUsar, agora, isMounted]);

  const proximoHorario = useMemo(() => {
    if (!agora || !isMounted || !horariosParaUsar || statusAberta) return null;
    return obterProximoHorario(horariosParaUsar, agora);
  }, [horariosParaUsar, agora, isMounted, statusAberta]);

  const horarioFechamento = useMemo(() => {
    if (!agora || !isMounted || !horariosParaUsar || !statusAberta) return null;
    return obterHorarioFechamento(horariosParaUsar, agora);
  }, [horariosParaUsar, agora, isMounted, statusAberta]);

  // Se não há horários configurados, não exibir
  if (!horariosParaUsar || horariosParaUsar.length === 0) {
    return null;
  }

  // Se ainda está carregando, não exibir
  if (!isMounted || !agora || isLoading) {
    return null;
  }

  const proximoHorarioTexto = formatarProximoHorario(proximoHorario);
  const mensagemFechamento = formatarMensagemFechamento(horarioFechamento);

  // Normalizar URL do logo
  const logoUrl = logo 
    ? (logo.startsWith('http://') || logo.startsWith('https://') 
        ? logo 
        : `https://${logo}`)
    : null;

  return (
    <div className="w-full bg-gradient-to-r from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 border-b border-primary/20 px-4 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Logo da loja com bolinha de status */}
          {logoUrl ? (
            <div className="flex-shrink-0 relative">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white dark:bg-primary/10 border-2 border-primary/20 shadow-sm relative">
                <Image
                  src={logoUrl}
                  alt={nomeLoja || "Logo da loja"}
                  fill
                  sizes="48px"
                  className="object-cover"
                  unoptimized={logoUrl.includes('mensuraapi.com.br')}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.parentElement) {
                      target.parentElement.style.display = 'none';
                    }
                  }}
                />
              </div>
              {/* Bolinha de status sobreposta */}
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-background border-2 border-background flex items-center justify-center">
                <Circle
                  className={`w-2.5 h-2.5 transition-colors ${
                    statusAberta 
                      ? "fill-green-500 text-green-500" 
                      : "fill-amber-500 text-amber-500"
                  }`}
                />
              </div>
            </div>
          ) : (
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 border-2 border-primary/20 flex items-center justify-center relative">
              <Circle
                className={`w-6 h-6 transition-colors ${
                  statusAberta 
                    ? "fill-green-500 text-green-500" 
                    : "fill-amber-500 text-amber-500"
                }`}
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {statusAberta ? (
                <span className="text-green-700 dark:text-green-400">
                  {nomeLoja ? `${nomeLoja} está aberta` : "Loja aberta"}
                </span>
              ) : (
                <span className="text-amber-700 dark:text-amber-400">
                  {nomeLoja ? `${nomeLoja} está fechada` : "Loja fechada"}
                </span>
              )}
            </p>
            {statusAberta && mensagemFechamento && (
              <p className={`text-xs flex items-center gap-1 mt-0.5 ${
                horarioFechamento && horarioFechamento.minutosRestantes < 30
                  ? "text-amber-600 dark:text-amber-400 font-semibold"
                  : "text-muted-foreground"
              }`}>
                <Clock className="h-3 w-3" />
                <span>{mensagemFechamento}</span>
              </p>
            )}
            {!statusAberta && proximoHorario && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Clock className="h-3 w-3" />
                <span>Próxima abertura: {proximoHorarioTexto}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
