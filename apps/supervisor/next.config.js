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
      { protocol: "https", hostname: "teste2.mensuraapi.com.br", pathname: "/**" },
      { protocol: "https", hostname: "image.mensuraapi.com.br", pathname: "/**" },
    ],
  },


};

module.exports = withPWA(nextConfig);
