import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Cette option remplace `outputFileTracingRoot` avec Turbopack.
  // Elle indique à Next.js de considérer la racine du projet (le dossier VULCAIN)
  // lors de la création du build "standalone", ce qui assure que les chemins sont corrects.
  turbopack: {
    root: path.join(__dirname, ".."),
  },
};

export default nextConfig;
