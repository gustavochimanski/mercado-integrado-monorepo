import type { NextConfig } from "next";

const path = require("path");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mensuraapi.com.br",
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
