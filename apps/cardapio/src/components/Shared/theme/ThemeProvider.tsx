"use client";

import { useEffect } from "react";
import { useQueryEmpresaPublic } from "@cardapio/services/empresa";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";

/**
 * Extrai os valores de uma cor oklch
 * @param oklchString - String no formato "oklch(L C H)" ou "oklch(L C H / alpha)"
 * @returns Objeto com L, C, H ou null se inválido
 */
function parseOklch(oklchString: string): { L: number; C: number; H: number } | null {
  const match = oklchString.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (!match) return null;
  
  return {
    L: parseFloat(match[1]),
    C: parseFloat(match[2]),
    H: parseFloat(match[3]),
  };
}

/**
 * Calcula a cor primary-foreground baseada na cor primária
 * Usa uma cor escura para garantir contraste quando a primária é clara
 */
function calculatePrimaryForeground(primary: string): string {
  const parsed = parseOklch(primary);
  if (!parsed) return "oklch(0.421 0.095 57.708)"; // fallback
  
  // Se a cor primária é clara (L > 0.7), usa uma cor escura para o foreground
  // Caso contrário, usa uma cor mais clara
  if (parsed.L > 0.7) {
    return `oklch(${Math.max(0.2, parsed.L - 0.4)} ${parsed.C * 0.6} ${parsed.H})`;
  }
  return `oklch(${Math.min(0.95, parsed.L + 0.3)} ${parsed.C * 0.3} ${parsed.H})`;
}

/**
 * Calcula a cor ring baseada na cor primária
 * Ring geralmente é uma versão ligeiramente mais escura/clara da primária
 */
function calculateRing(primary: string): string {
  const parsed = parseOklch(primary);
  if (!parsed) return "oklch(0.795 0.184 86.047)"; // fallback
  
  // Ring é uma versão ligeiramente ajustada da primária
  return `oklch(${Math.max(0.3, parsed.L - 0.05)} ${parsed.C * 0.9} ${parsed.H})`;
}

export function ThemeProvider() {
  const empresaId = getEmpresaId();
  const { data: empresa } = useQueryEmpresaPublic(true, empresaId);

  useEffect(() => {
    const tema = empresa?.cardapio_tema?.trim();

    // Se o tema existir e não estiver vazio, usa o tema; caso contrário, usa o fallback
    const primary = (tema && tema.length > 0) ? tema : "oklch(0.80 0.16 86)";

    // Calcula cores derivadas baseadas na cor primária
    const primaryForeground = calculatePrimaryForeground(primary);
    const ring = calculateRing(primary);

    // Aplica as cores nas variáveis CSS do :root
    // Isso garante que o layout respeite a cor --primary que vem de get empresa
    document.documentElement.style.setProperty("--primary", primary);
    document.documentElement.style.setProperty("--primary-foreground", primaryForeground);
    document.documentElement.style.setProperty("--ring", ring);
  }, [empresa?.cardapio_tema]);

  return null;
}
