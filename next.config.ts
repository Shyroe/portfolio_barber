import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,

  // Static export keeps the deploy on Cloudflare Workers assets (`wrangler.jsonc`
  // publishes `./out`) with no runtime compute, no cold start and nothing to
  // scale — the right trade-off for a landing page that is 100% static markup.
  //
  // Consequence: there is no Next image optimizer at runtime, so `next/image`
  // runs unoptimized and every source must point at a pre-generated derivative
  // produced by `pnpm run assets:derivatives` (ImageMagick, no runtime image
  // service and no extra dependency).
  output: "export",
  images: { unoptimized: true },

  // `radix-ui` e `lucide-react` são pacotes "barril": sem isto o bundle carrega
  // caminhos que a página nunca usa (o PageSpeed Insights media 52,9 KiB de
  // JavaScript não usado no deploy).
  //
  // `experimental.inlineCss` foi testado e **descartado**: com o CSS embutido o
  // Lighthouse local deu 96 contra 99 do `<link>`, por TBT (230 ms contra 50 ms
  // — o CSS inline entra no parse da main thread) e sem ganho de LCP (1,8 s
  // contra 1,9 s, dentro do ruído). Só no `<link>` o CSS é cacheado entre
  // visitas. O que resolveu de verdade foi o `@source` restrito em
  // `globals.css`: a folha caiu de 74 KB para 43 KB (9,1 KB gzip).
  experimental: {
    optimizePackageImports: ["lucide-react", "radix-ui"],
  },
};

export default nextConfig;
