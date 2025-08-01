import type { NextConfig } from "next";

const cliente = "teste2"

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

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
