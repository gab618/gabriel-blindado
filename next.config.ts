import type { NextConfig } from "next";

const galeriaBase = process.env.NEXT_PUBLIC_GALERIA_IMAGE_BASE_URL?.replace(/\/?$/, "/");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  typedRoutes: true,
  images: {
    remotePatterns: galeriaBase ? [new URL("**", galeriaBase)] : [],
    qualities: [75, 85],
    minimumCacheTTL: 2678400, // 31 dias: as imagens são imutáveis
  },
  experimental: {
    globalNotFound: true,
    agentUpgrade: "security",
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/pt",
        permanent: true,
      },
      {
        source: "/:lang/escritos",
        destination: "/:lang/posts",
        permanent: true,
      },
      {
        source: "/:lang/escritos/:path*",
        destination: "/:lang/posts/:path*",
        permanent: true,
      },
      {
        source: "/:lang/diario",
        destination: "/:lang/posts",
        permanent: true,
      },
      {
        source: "/:lang/diario/:path*",
        destination: "/:lang/posts",
        permanent: true,
      },
      {
        source: "/:lang/notas",
        destination: "/:lang/posts",
        permanent: true,
      },
      {
        source: "/:lang/notas/:path*",
        destination: "/:lang/posts",
        permanent: true,
      },
      {
        source: "/:lang/tags",
        destination: "/:lang/posts",
        permanent: true,
      },
      {
        source: "/:lang/tags/:path*",
        destination: "/:lang/posts",
        permanent: true,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
