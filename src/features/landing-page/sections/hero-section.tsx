import { preload } from "react-dom";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { VideoFacade } from "@/features/landing-page/components/video-facade";
import { VideoPlayBadge } from "@/features/landing-page/components/video-play-badge";

const heroCopy = {
  headline: {
    before: "APRENDA COMO SE TORNAR UM ",
    highlights: ["BARBEIRO", "PROFISSIONAL", "30 MIL REAIS"],
    after: " POR MÊS",
    middle: " E FATURE ",
  },
  support: "Mesmo que você seja iniciante e não saiba nada.",
  videoPoster: {
    alt: "Prévia da aula do curso Gentleman Barber",
    src: "/media/derived/hero-video-poster.webp",
    // O poster é o elemento de LCP no mobile: lá o slot tem 352px e este AVIF de
    // 924px (DPR 2,625) chega ~23 KB menor que o webp de 1134px.
    srcAvifMobile: "/media/derived/hero-video-poster-mobile.avif",
  },
  /*
   * Id do vídeo, como a referência declara em `youtube_url`. A `VideoFacade`
   * monta o embed a partir dele **no clique** — o load da página segue sem
   * domínio de terceiro (a spec, §7).
   */
  videoId: "XHOmBV4js_E",
  seals: {
    alt: "Selos de segurança, garantia e formas de pagamento do curso",
    src: "/media/derived/hero-seals.webp",
  },
} as const;

export function HeroSection() {
  const { headline } = heroCopy;

  /*
   * O poster é o elemento de LCP no mobile e o `<picture>` o tira do caminho que
   * o Next pré-carrega sozinho (ele só enxerga `<img>` solto), então o preload é
   * explícito — e só no breakpoint estreito, senão o mobile baixaria também o
   * webp de 1134px e os dois competiriam pela mesma banda.
   */
  preload(heroCopy.videoPoster.srcAvifMobile, {
    as: "image",
    fetchPriority: "high",
    media: "(max-width: 639px)",
    type: "image/avif",
  });
  // O fundo full-bleed é o maior bitmap acima da dobra: sem preload ele entra na
  // mesma fila do resto e o LCP espera por ele.
  preload("/media/derived/hero-background-mobile.avif", {
    as: "image",
    fetchPriority: "high",
    media: "(max-width: 639px)",
    type: "image/avif",
  });
  preload("/media/derived/hero-background.avif", {
    as: "image",
    fetchPriority: "high",
    media: "(min-width: 640px)",
    type: "image/avif",
  });

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-scrim"
      id="inicio"
    >
      {/*
       * O design tem **dois** bitmaps de fundo: um paisagem (1600×1008) no frame
       * desktop e um **retrato** (730×1600) no mobile, com `mode: stretch` nos
       * dois. A proporção do retrato (0,456) é exatamente a da seção mobile
       * (390×855), então `object-cover` entrega o mesmo enquadramento do design
       * sem recorte. Com um único arquivo paisagem em `object-cover object-right`
       * o mobile mostrava um recorte da direita da foto — desalinhado em relação
       * ao design.
       */}
      <picture>
        <source
          media="(min-width: 640px)"
          srcSet="/media/derived/hero-background.avif"
          type="image/avif"
        />
        <source media="(min-width: 640px)" srcSet="/media/derived/hero-background.webp" />
        <source srcSet="/media/derived/hero-background-mobile.avif" type="image/avif" />
        <img
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 size-full object-cover"
          fetchPriority="high"
          height={1600}
          src="/media/derived/hero-background-mobile.webp"
          width={730}
        />
      </picture>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-scrim/71" />

      <div className="container-page relative flex min-h-[855px] flex-col px-5 pt-10 pb-5 lg:min-h-[860px] xl:px-0 lg:py-[50px]">
        <div className="grid w-full flex-1 grid-cols-1 content-start lg:grid-cols-[587fr_553fr]">
          {/*
           * Abaixo de `lg` a coluna de texto ocupa a largura do container: em 768
           * isso deixava o pôster e o CTA com 708px, maiores que os 567px do
           * desktop. O teto de 567px (a largura da coluna no design) mantém a
           * proporção do frame em qualquer largura intermediária, sem tocar em
           * 390 nem em 1366, onde a coluna já é menor ou igual a isso.
           */}
          <div className="mx-auto flex w-full max-w-[567px] flex-col items-center gap-5 p-[10px] text-center lg:max-w-none">
            <img
              alt={siteConfig.name}
              className="h-auto w-[76px] lg:w-[57px]"
              height={130}
              src="/media/derived/hero-logo.webp"
              width={114}
            />

            <h1
              className="max-w-[330px] font-display text-display-30 font-extrabold text-white lg:max-w-[567px] lg:text-display-35"
              id="hero-title"
            >
              {headline.before}
              <span className="text-highlight">{headline.highlights[0]}</span>{" "}
              <span className="text-highlight">{headline.highlights[1]}</span>
              {headline.middle}
              <span className="text-highlight">{headline.highlights[2]}</span>
              {headline.after}
            </h1>

            <p className="text-body-18 font-medium text-white">{heroCopy.support}</p>

            <VideoFacade
              alt={heroCopy.videoPoster.alt}
              badge={
                <VideoPlayBadge className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 group-hover:scale-110" />
              }
              className="rounded-[10px]"
              height={576}
              imageClassName="rounded-[10px]"
              posterAvifMobile={heroCopy.videoPoster.srcAvifMobile}
              posterSrc={heroCopy.videoPoster.src}
              priority
              videoId={heroCopy.videoId}
              width={1024}
            />

            {/*
             * O render do design quebra este rótulo em **duas** linhas no mobile
             * (tinta `184x36`, duas bandas de 21px) e mantém uma no desktop: o
             * texto tem 266px e a caixa do botão tem 250px de conteúdo. O
             * `whitespace-nowrap` do primitive impede a quebra, então o rótulo
             * ficava em uma linha e **estourava o botão** abaixo de ~370px (no 320
             * ele sai 4px de cada lado do laranja). Com `whitespace-normal` e o
             * padding do mobile em 19/0, o botão fecha os mesmos 63px do design com
             * as duas linhas: 42 + 19 + 2 (borda) = 63, e a tinta cai nas mesmas
             * linhas do render (o design encosta o bloco de texto na base do
             * botão, 21px do topo — medido: tinta em y=23..38 e 44..58 nos dois).
             * No desktop o rótulo cabe em uma linha e o padding volta a 20/20.
             */}
            <Button
              asChild
              className="mx-auto h-auto w-full max-w-[400px] rounded-lg border-b-2 border-surface/34 px-10 pt-[19px] pb-0 font-accent text-cta-21 font-bold whitespace-normal shadow-none lg:max-w-none lg:pt-5 lg:pb-5"
              variant="highlight"
            >
              {/*
               * O teto de 250px no rótulo (a caixa de texto do design no mobile)
               * mantém a quebra em duas linhas em **toda** largura abaixo de `lg`:
               * sem ele o rótulo volta a uma linha a partir de ~400px e o padding
               * mobile de 19/0 deixaria o botão com 42px em vez dos 63 do design.
               */}
              <a href={siteConfig.primaryCta.href}>
                <span className="mx-auto block max-w-[250px] lg:max-w-none">
                  {siteConfig.primaryCta.label}
                </span>
              </a>
            </Button>

            <img
              alt={heroCopy.seals.alt}
              className="h-auto w-full max-w-[400px]"
              height={36}
              src={heroCopy.seals.src}
              width={400}
            />
          </div>

          <div aria-hidden="true" className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
