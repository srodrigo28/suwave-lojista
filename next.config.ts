import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Ativa a integração do React ViewTransition: navegações entre rotas
    // ganham um crossfade suave nativo (ver globals.css). Sem suporte do
    // navegador, a navegação funciona normalmente, só não anima.
    viewTransition: true,
  },
};

export default nextConfig;
