import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  // ✅ Solución moderna: funciona tanto en Webpack como en Turbopack
  // Le dice a Next.js que NO intente bundlear estos paquetes (son opcionales del SDK de Coinbase)
  serverExternalPackages: [
    "@x402/core",
    "@x402/evm",
    "@x402/svm",
    "@x402/core/client",
    "@x402/evm/exact/client",
    "@x402/evm/upto/client",
    "@x402/svm/exact/client",
  ],
  // Mantenemos el fallback para Webpack (por si alguien hace build local sin Turbopack)
  webpack: config => {
    config.externals = config.externals || [];
    config.externals.push(({ request }: { request?: string }, callback: any) => {
      if (request && /^@x402\//.test(request)) {
        return callback(null, "commonjs " + request);
      }
      callback();
    });
    return config;
  },
  // Turbopack config para ignorar warnings (opcional)
  turbopack: {},
};

const isIpfs = process.env.NEXT_PUBLIC_IPFS_BUILD === "true";

if (isIpfs) {
  nextConfig.output = "export";
  nextConfig.trailingSlash = true;
  nextConfig.images = {
    unoptimized: true,
  };
}

module.exports = nextConfig;
