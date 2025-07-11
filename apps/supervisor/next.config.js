/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Desativa em dev
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Permite usar <Image src="http://mensuraapi.com.br:1001/…" />
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

module.exports = withPWA(nextConfig);
