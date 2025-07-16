const path = require("path");
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  reactStrictMode: true,

  experimental: {
    externalDir: true,
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "gerente.mensuraapi.com.br", pathname: "/**" },
      { protocol: "https", hostname: "imagens.mensuraapi.com.br", pathname: "/**" },
    ],
  },


};

module.exports = withPWA(nextConfig);
