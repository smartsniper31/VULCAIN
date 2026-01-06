import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // On supprime la section rewrites pour stopper la boucle 508
};

export default nextConfig;
