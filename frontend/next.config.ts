import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    // Cette option indique à Next.js où se trouve la racine de votre projet (le dossier VULCAIN).
    // Elle est cruciale pour que le build "standalone" copie correctement les dépendances
    // et crée un server.js fonctionnel dans une structure monorepo.
    outputFileTracingRoot: path.join(__dirname, ".."),
  },
};

export default nextConfig;
