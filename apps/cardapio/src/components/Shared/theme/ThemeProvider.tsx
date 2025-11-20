"use client";

import { useEffect } from "react";
import { useQueryEmpresaPublic } from "@cardapio/services/empresa";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";

export function ThemeProvider() {
  const empresaId = getEmpresaId();
  const { data: empresa } = useQueryEmpresaPublic(true, empresaId);

  useEffect(() => {
    const tema = empresa?.cardapio_tema?.trim();

    const primary = tema || "oklch(0.80 0.16 86)"; // fallback para o padrão atual

    // Aplica a cor na variável CSS --primary do :root
    document.documentElement.style.setProperty("--primary", primary);
  }, [empresa?.cardapio_tema]);

  return null;
}
