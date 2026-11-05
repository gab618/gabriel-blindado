import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  typedRoutes: true,
  experimental: {
    globalNotFound: true,
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
        destination: "/:lang/notas",
        permanent: true,
      },
      {
        source: "/:lang/diario/:path*",
        destination: "/:lang/notas/:path*",
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
