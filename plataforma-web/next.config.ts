
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permitir acceso desde la red local durante desarrollo
  allowedDevOrigins: ["192.168.1.3"],

  // Configuración de Next.js
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,

  // Configuración de Tailwind con Turbopack
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
