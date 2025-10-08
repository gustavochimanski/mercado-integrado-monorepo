import type { NextConfig } from "next";

const nextConfig: NextConfig = {  
  turbopack: {
    root: __dirname,
  },  
  reactStrictMode: true,  
  poweredByHeader: false,  
  experimental: {
    externalDir: true, 
  },  
  images: {
    
    // Domínios permitidos para servir imagens
    remotePatterns: [
      {
        protocol: "https",
        hostname: "teste2.mensuraapi.com.br",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "image.mensuraapi.com.br",
        pathname: "/**",
      },
    ],    
    formats: ["image/avif", "image/webp"],
  },  

  // HEADERS DE SEGURANÇA  
  async headers() {
    return [
      {
        // Aplica para todas as rotas
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN", 
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff", 
          },
        ],
      },
    ];
  },
};

export default nextConfig;
