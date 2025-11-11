"use client";

import { useEffect } from "react";
import { useQueryEmpresaPublic } from "@cardapio/services/useQueryEmpresaPublic";

export function ThemeProvider() {
  const { data: empresa } = useQueryEmpresaPublic(true, 1);

  useEffect(() => {
    const tema = empresa?.cardapio_tema?.trim();

    const primary = tema || "oklch(0.80 0.16 86)"; // fallback para o padrão atual

    // Aplica a cor na variável CSS --primary do :root
    document.documentElement.style.setProperty("--primary", primary);
  }, [empresa?.cardapio_tema]);

  return null;
}
