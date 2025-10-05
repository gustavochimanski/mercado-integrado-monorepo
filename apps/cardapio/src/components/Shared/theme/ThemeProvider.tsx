"use client";

import { useEffect } from "react";
import { useQueryMensuraEmpresaClient } from "@cardapio/services/useQueryMensuraEmpresaClient";

// Define as cores dos temas disponíveis Conforme o Css Global oklch
const TEMAS_CORES: Record<string, string> = {
  padrao: "oklch(0.80 0.16 86)", // Amarelo (padrão atual)
  azul: "oklch(0.65 0.18 260)",
  roxo: "oklch(0.65 0.2 300)",
  vermelho: "oklch(0.65 0.2 25)",
  verde: "oklch(0.65 0.2 150)",
  laranja: "oklch(0.70 0.18 50)",
};

export function ThemeProvider() {
  const { data: empresa } = useQueryMensuraEmpresaClient();

  useEffect(() => {
    if (empresa?.cardapio_tema) {
      // Pega a cor do tema ou usa o padrão
      const corTema = TEMAS_CORES[empresa.cardapio_tema] || TEMAS_CORES.padrao;

      // Aplica a cor na variável CSS --primary do :root
      document.documentElement.style.setProperty("--primary", corTema);
    }
  }, [empresa?.cardapio_tema]);

  return null;
}
