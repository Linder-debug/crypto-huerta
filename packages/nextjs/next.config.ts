import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  // Causa raíz: @coinbase/cdp-sdk (dependencia transitiva del conector de
  // Coinbase Wallet en RainbowKit) intenta importar opcionalmente los
  // paquetes @x402/* (protocolo de pagos x402) que no están instalados y
  // que este proyecto no usa. En build de producción, Next.js hace análisis
  // estático completo y falla si no puede resolverlos, aunque esa rama de
  // código nunca se ejecute. Esta función le dice a webpack: cualquier
  // import que empiece con "@x402/" (cualquier subpath) se trata como
  // módulo externo vacío en vez de intentar resolverlo en el bundle.
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
