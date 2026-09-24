/**
 * Declarative manifest for the image pipeline.
 *
 * `output: "export"` means there is no Next image optimizer at runtime, so
 * every bitmap the page serves is generated here, at build time, and committed
 * under `public/media/derived/`. Keeping the list declarative means the
 * derivatives are reviewable in a diff instead of being whatever the last
 * manual conversion produced.
 *
 * Entry fields
 * ------------
 * source   path relative to `sourceDir` (the committed original)
 * output   path relative to `outputDir` (what the app actually references)
 * width    target width in px; height is derived from the aspect ratio
 * height   optional; combined with `crop: true` it forces an exact box
 * quality  1-100, format-specific
 * format   "webp" | "jpeg" | "png"
 * crop     true = cover-crop to width x height, false/omitted = resize to width
 * purpose  short human note that ends up in the report
 *
 * Add one entry per responsive tier you actually reference with
 * `<picture>` / `sizes`. Generating tiers nobody requests only inflates the
 * repository.
 */

export default {
  sourceDir: "public/media/source",
  outputDir: "public/media/derived",

  derivatives: [
    // The social preview is the one derivative every landing page needs: it is
    // fetched by crawlers, not by the browser, so it must be a real JPEG.
    {
      source: "og-cover-source.png",
      output: "og-cover.jpg",
      width: 1200,
      height: 630,
      quality: 82,
      format: "jpeg",
      crop: true,
      purpose: "Open Graph / Twitter cover",
    },

    // ---- Hero (fatia 1) -------------------------------------------------
    // The hero paints the photo full-bleed behind a 71%-opaque `#020202` scrim,
    // so it needs pixels for a wide viewport but no more: the committed source
    // is 1715px and upscaling it would only add bytes.
    {
      source: "hero-background.png",
      output: "hero-background.webp",
      width: 1715,
      quality: 78,
      format: "webp",
      purpose: "hero background, full-bleed (desktop)",
    },
    {
      // O fundo é o maior bitmap acima da dobra e disputava o caminho crítico com
      // o LCP: o AVIF corta ~50% dos bytes e o webp fica de fallback.
      source: "hero-background.png",
      output: "hero-background.avif",
      width: 1715,
      quality: 45,
      format: "avif",
      purpose: "hero background AVIF (desktop), com o webp de fallback",
    },
    {
      source: "hero-background-mobile.webp",
      output: "hero-background-mobile.avif",
      width: 730,
      quality: 42,
      format: "avif",
      purpose: "hero background AVIF (mobile — composição retrato do design)",
    },
    {
      source: "hero-background-mobile.webp",
      output: "hero-background-mobile.webp",
      width: 730,
      quality: 76,
      format: "webp",
      purpose: "hero background, full-bleed (mobile — composição retrato do design)",
    },
    {
      source: "hero-logo.png",
      output: "hero-logo.webp",
      width: 114,
      quality: 88,
      format: "webp",
      purpose: "Gentleman Barber logo (rendered at 56.66px, DPR 2)",
    },
    {
      source: "hero-video-poster.png",
      output: "hero-video-poster.webp",
      width: 1134,
      quality: 80,
      format: "webp",
      purpose: "hero video poster (rendered at 566.58px, DPR 2)",
    },
    {
      // O poster é o elemento de LCP no mobile e o slot lá tem 352px (DPR 2,625
      // no Moto G Power do PageSpeed = 924px). AVIF no tamanho certo corta ~23 KB
      // do recurso que decide o LCP; o webp de 1134 fica como fallback.
      source: "hero-video-poster.png",
      output: "hero-video-poster-mobile.avif",
      width: 924,
      // AVIF em q40 fica em 14,7 KB contra 38,3 KB do webp de 1134px, com 1,7%
      // de RMSE contra ele — num poster de vídeo isso é invisível, e o recurso é
      // o elemento de LCP no mobile.
      quality: 40,
      format: "avif",
      purpose: "hero video poster no mobile (slot de 352px, DPR 2,625)",
    },
    {
      // Already a 400px webp: the design renders it at 400x36, so there is
      // nothing to gain by resizing it.
      source: "hero-seals.webp",
      output: "hero-seals.webp",
      width: 400,
      quality: 88,
      format: "webp",
      purpose: "hero seals strip (payment/certification)",
    },

    // Seção 2 (destaque): o design serve as mesmas fotos num grid 2x3 de
    // 366,67px no desktop e numa coluna de 370px no mobile, então 740px cobre
    // os dois em DPR 2 sem carregar o original de 1080px.
    {
      source: "destaque-sobrancelha.webp",
      output: "destaque-sobrancelha.webp",
      width: 740,
      quality: 80,
      format: "webp",
      purpose: "destaque gallery: sobrancelha",
    },
    {
      source: "destaque-alisamentos.webp",
      output: "destaque-alisamentos.webp",
      width: 740,
      quality: 80,
      format: "webp",
      purpose: "destaque gallery: alisamentos",
    },
    {
      source: "destaque-corte.webp",
      output: "destaque-corte.webp",
      width: 740,
      quality: 80,
      format: "webp",
      purpose: "destaque gallery: corte",
    },
    {
      source: "destaque-barba.webp",
      output: "destaque-barba.webp",
      width: 740,
      quality: 80,
      format: "webp",
      purpose: "destaque gallery: barba",
    },
    {
      source: "destaque-degrade.webp",
      output: "destaque-degrade.webp",
      width: 740,
      quality: 80,
      format: "webp",
      purpose: "destaque gallery: degradê",
    },
    {
      // Sexta foto da galeria. O design (e a referência) repetiam a 4ª na 6ª
      // posição — o mesmo `destaque-barba.webp` com o mesmo `alt`, dois cards
      // idênticos no grid. Esta é a imagem que fecha a série do produto e que a
      // referência deixou de fora (`4.png`, o "PENTEADOS" entre o "CORTE" e o
      // "DEGRADÊ"), então o grid passa a ter seis fotos distintas.
      source: "destaque-penteado.webp",
      output: "destaque-penteado.webp",
      width: 740,
      quality: 80,
      format: "webp",
      purpose: "destaque gallery: penteado",
    },
    // As seis fotos da galeria somam 85 KB em webp e, com o limiar de
    // `loading="lazy"` do Chromium em conexão lenta, entram no caminho crítico
    // mesmo estando abaixo da dobra — o AVIF corta ~50% e devolve banda ao LCP.
    {
      source: "destaque-sobrancelha.webp",
      output: "destaque-sobrancelha.avif",
      width: 740,
      quality: 42,
      format: "avif",
      purpose: "galeria: sobrancelha (AVIF)",
    },
    {
      source: "destaque-alisamentos.webp",
      output: "destaque-alisamentos.avif",
      width: 740,
      quality: 42,
      format: "avif",
      purpose: "galeria: alisamentos (AVIF)",
    },
    {
      source: "destaque-corte.webp",
      output: "destaque-corte.avif",
      width: 740,
      quality: 42,
      format: "avif",
      purpose: "galeria: corte (AVIF)",
    },
    {
      source: "destaque-barba.webp",
      output: "destaque-barba.avif",
      width: 740,
      quality: 42,
      format: "avif",
      purpose: "galeria: barba (AVIF)",
    },
    {
      source: "destaque-degrade.webp",
      output: "destaque-degrade.avif",
      width: 740,
      quality: 42,
      format: "avif",
      purpose: "galeria: degradê (AVIF)",
    },
    {
      source: "destaque-penteado.webp",
      output: "destaque-penteado.avif",
      width: 740,
      quality: 42,
      format: "avif",
      purpose: "galeria: penteado (AVIF)",
    },
    {
      // A textura é pintada a 19% de opacidade e esticada na seção inteira, o
      // que esconde qualquer perda de nitidez: não vale pagar mais bytes.
      source: "destaque-pattern-desktop.webp",
      output: "destaque-pattern-desktop.webp",
      width: 1366,
      quality: 70,
      format: "webp",
      purpose: "destaque background texture (desktop)",
    },
    {
      // 328px é o próprio original; ampliar para os 390px do viewport só
      // inventaria pixels.
      source: "destaque-pattern-mobile.webp",
      output: "destaque-pattern-mobile.webp",
      width: 328,
      quality: 70,
      format: "webp",
      purpose: "destaque background texture (mobile)",
    },

    // Seção 3 (para quem é): o design usa `mode: "stretch"` e os dois arquivos já
    // vêm no tamanho exato da seção — 1366×502 no desktop, 390×509 no mobile —
    // então a passagem pelo gerador é um re-encode 1:1, sem reescalonamento.
    {
      source: "para-quem-bg-desktop.webp",
      output: "para-quem-bg-desktop.webp",
      width: 1366,
      quality: 85,
      format: "webp",
      purpose: "para quem é: foto de fundo (desktop)",
    },
    {
      source: "para-quem-bg-mobile.webp",
      output: "para-quem-bg-mobile.webp",
      width: 390,
      quality: 85,
      format: "webp",
      purpose: "para quem é: foto de fundo (mobile)",
    },
    {
      source: "oferta-bg-desktop.webp",
      output: "oferta-bg-desktop.webp",
      width: 1102,
      quality: 85,
      format: "webp",
      purpose: "oferta: foto de fundo (desktop)",
    },
    {
      source: "oferta-bg-mobile.webp",
      output: "oferta-bg-mobile.webp",
      width: 590,
      quality: 85,
      format: "webp",
      purpose: "oferta: foto de fundo (mobile)",
    },
    {
      source: "oferta-pagamento.webp",
      output: "oferta-pagamento.webp",
      width: 400,
      quality: 90,
      format: "webp",
      purpose: "oferta: faixa de formas de pagamento",
    },
    {
      source: "oferta-garantia.webp",
      output: "oferta-garantia.webp",
      width: 208,
      quality: 90,
      format: "webp",
      purpose: "oferta: selo de garantia de 7 dias",
    },
    {
      source: "depoimentos-bg-desktop.webp",
      output: "depoimentos-bg-desktop.webp",
      width: 1366,
      quality: 85,
      format: "webp",
      purpose: "depoimentos: textura de fundo (desktop)",
    },
    {
      source: "depoimentos-bg-mobile.webp",
      output: "depoimentos-bg-mobile.webp",
      width: 328,
      quality: 85,
      format: "webp",
      purpose: "depoimentos: textura de fundo (mobile)",
    },
    {
      source: "depoimentos-video.webp",
      output: "depoimentos-video.webp",
      width: 358,
      quality: 88,
      format: "webp",
      purpose: "depoimentos: miniatura de video com botao de play",
    },
    {
      source: "depoimentos-card.webp",
      output: "depoimentos-card.webp",
      width: 361,
      quality: 90,
      format: "webp",
      purpose: "depoimentos: card de depoimento (captura de conversa)",
    },
    {
      source: "certificado-bg-desktop.webp",
      output: "certificado-bg-desktop.webp",
      width: 1366,
      quality: 85,
      format: "webp",
      purpose: "certificado: textura de fundo (desktop, esticada para 715px de altura)",
    },
    {
      source: "certificado-bg-mobile.webp",
      output: "certificado-bg-mobile.webp",
      width: 390,
      quality: 85,
      format: "webp",
      purpose: "certificado: textura de fundo (mobile)",
    },
    {
      source: "certificado-documento-desktop.webp",
      output: "certificado-documento-desktop.webp",
      width: 552,
      quality: 90,
      format: "webp",
      purpose: "certificado: imagem do certificado (desktop, 552x386,39)",
    },
    {
      source: "certificado-documento-mobile.webp",
      output: "certificado-documento-mobile.webp",
      width: 350,
      quality: 90,
      format: "webp",
      purpose: "certificado: imagem do certificado (mobile, 350x245,17)",
    },
    {
      source: "bonus-bg-desktop.webp",
      output: "bonus-bg-desktop.webp",
      width: 1366,
      quality: 85,
      format: "webp",
      purpose: "bonus: textura de fundo (desktop, esticada para 823px de altura)",
    },
    {
      source: "bonus-bg-mobile.webp",
      output: "bonus-bg-mobile.webp",
      width: 390,
      quality: 85,
      format: "webp",
      purpose: "bonus: textura de fundo (mobile, esticada para 1744px)",
    },
    {
      source: "bonus-card-gestao.webp",
      output: "bonus-card-gestao.webp",
      width: 250,
      quality: 88,
      format: "webp",
      purpose: "bonus: card 'Gestao e vendas' (renderizado a 125,41px, DPR 2)",
    },
    {
      source: "bonus-card-contabilidade.webp",
      output: "bonus-card-contabilidade.webp",
      width: 250,
      quality: 88,
      format: "webp",
      purpose: "bonus: card 'Contabilidade e gestao fiscal' e o 4o card (125,41px, DPR 2)",
    },
    {
      source: "bonus-card-marketing.webp",
      output: "bonus-card-marketing.webp",
      width: 250,
      quality: 88,
      format: "webp",
      purpose: "bonus: card 'Marketing para redes sociais' (125,41px, DPR 2)",
    },
    {
      source: "professor-bg-desktop.webp",
      output: "professor-bg-desktop.webp",
      width: 1366,
      quality: 85,
      format: "webp",
      purpose: "professor: fundo da secao (desktop, opacidade cheia)",
    },
    {
      source: "professor-bg-mobile.webp",
      output: "professor-bg-mobile.webp",
      width: 390,
      quality: 85,
      format: "webp",
      purpose: "professor: fundo da secao (mobile, opacidade cheia)",
    },
    {
      source: "professor-foto.webp",
      output: "professor-foto-desktop.webp",
      width: 552,
      quality: 88,
      format: "webp",
      purpose: "professor: retrato (desktop, 552x667 - a origem ja e 552, sem reescalar)",
    },
    {
      source: "professor-foto.webp",
      output: "professor-foto-mobile.webp",
      width: 350,
      quality: 88,
      format: "webp",
      purpose: "professor: retrato (mobile, 350x422,91)",
    },
    {
      source: "rodape-bg-desktop.webp",
      output: "rodape-bg-desktop.webp",
      width: 1366,
      quality: 85,
      format: "webp",
      purpose: "rodape: textura de fundo (desktop, esticada para 496,73px de altura)",
    },
    {
      source: "rodape-bg-mobile.webp",
      output: "rodape-bg-mobile.webp",
      width: 390,
      quality: 85,
      format: "webp",
      purpose: "rodape: textura de fundo (mobile, esticada para 527,38px)",
    },

    // Example responsive tiers — uncomment once the real art is committed under
    // `public/media/source/` and referenced from a section:
    //
    // {
    //   source: "hero.png",
    //   output: "hero.webp",
    //   width: 1920,
    //   quality: 80,
    //   format: "webp",
    //   purpose: "hero background (desktop)",
    // },
    // {
    //   source: "hero.png",
    //   output: "hero-compact.webp",
    //   width: 833,
    //   quality: 78,
    //   format: "webp",
    //   purpose: "hero background (compact phones, DPR 1.75)",
    // },
  ],
};
