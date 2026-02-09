import type { NextConfig } from "next";
import path from "path";

const cliente = "teste2";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Monorepo: evita o warning de múltiplos lockfiles e ajuda o tracing do Next
  // a usar a raiz correta do workspace.
  outputFileTracingRoot: path.join(__dirname, "..", ".."),

  images: {
    // Desativa o otimizador do next/image (útil quando o deploy/edge do Vercel trava no optimizer).
    // As imagens serão servidas "como estão", sem transformação.
    // Habilita o otimizador do Next/Vercel (/_next/image).
    // Se precisar desabilitar por limites do plano, ajuste para `true`.
    unoptimized: false,
    remotePatterns: [
      // Permite qualquer subdomínio do domínio mensuraapi (ex.: gustavo.mensuraapi.com.br)
      {
        protocol: "https",
        hostname: "**.mensuraapi.com.br",
        pathname: "/**",
      },
      // Mantém domínios específicos
      {
        protocol: "https",
        hostname: `${cliente}.mensuraapi.com.br`,
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "image.mensuraapi.com.br",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
