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
    remotePatterns: [
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
