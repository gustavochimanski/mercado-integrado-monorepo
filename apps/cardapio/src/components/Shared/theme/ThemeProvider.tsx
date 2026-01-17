"use client";

import { useEffect } from "react";
import { useQueryEmpresaPublic } from "@cardapio/services/empresa";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";

export function ThemeProvider() {
  const empresaId = getEmpresaId();
  const { data: empresa } = useQueryEmpresaPublic(true, empresaId);

  useEffect(() => {
    const tema = empresa?.cardapio_tema?.trim();

    // Se o tema existir e não estiver vazio, usa o tema; caso contrário, usa o fallback
    const primary = (tema && tema.length > 0) ? tema : "oklch(0.80 0.16 86)";

    // Aplica a cor na variável CSS --primary do :root
    // Isso garante que o layout respeite a cor --primary que vem de get empresa
    document.documentElement.style.setProperty("--primary", primary);
  }, [empresa?.cardapio_tema]);

  return null;
}
