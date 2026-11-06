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
        source: "/:lang/projetos",
        destination: "/:lang/posts",
        permanent: true,
      },
      {
        source: "/:lang/projetos/:path*",
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
