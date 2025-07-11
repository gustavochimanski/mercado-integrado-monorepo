import type { NextConfig } from "next";

const cliente = "gerente"

const nextConfig: NextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${cliente}.mensuraapi.com.br`,
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "imagens.mensuraapi.com.br",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
