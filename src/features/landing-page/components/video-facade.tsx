"use client";

import { type ReactNode, useState } from "react";

import { cn } from "@/lib/utils";

type VideoFacadeProps = {
  /** `alt` do pôster; é também o nome acessível do botão. */
  alt: string;
  /**
   * Badge de play da própria seção: o hero usa o do vídeo do Elementor (o
   * retângulo arredondado de 58 × 44) e os Depoimentos usam o círculo de 47 × 47
   * do design. Cada um é o do seu nó no `.pen`.
   */
  badge: ReactNode;
  className?: string;
  /** `width`/`height` intrínsecos do pôster (evitam salto de layout). */
  height: number;
  imageClassName?: string;
  /** O pôster do hero é o LCP: carrega com prioridade alta. */
  priority?: boolean;
  /**
   * Variante AVIF do pôster para telas estreitas. Existe porque no mobile o
   * pôster é o elemento de LCP e o slot é bem menor que o do desktop: servir a
   * imagem grande ali custava ~23 KB no recurso que decide a métrica.
   */
  posterAvifMobile?: string;
  posterSrc: string;
  /** Id do vídeo no YouTube, como a referência declara em `youtube_url`. */
  videoId: string;
  width: number;
};

/**
 * Vídeo com fachada: o pôster e o badge são o estado inicial (renderizados no
 * servidor) e o `<iframe>` do YouTube só é criado **no clique**.
 *
 * Por que assim: a referência publicada toca o vídeo inline — o clique cria um
 * `iframe` de `youtube.com/embed/XHOmBV4js_E`, tanto no hero quanto nos seis cards
 * de Depoimentos. Reproduzir isso com o embed no HTML violaria o requisito do
 * projeto de **zero domínio de terceiro no carregamento** (a spec, §7), que é o
 * que sustenta o LCP da página. A fachada dá o mesmo comportamento depois do
 * clique e mantém o load limpo; é o padrão recomendado para embed de vídeo.
 *
 * Sem JavaScript o botão não faz nada e o pôster continua legível — nenhum
 * conteúdo depende da ilha.
 */
export function VideoFacade({
  alt,
  badge,
  className,
  height,
  imageClassName,
  posterAvifMobile,
  posterSrc,
  priority = false,
  videoId,
  width,
}: VideoFacadeProps) {
  const [tocando, setTocando] = useState(false);

  if (tocando) {
    return (
      <div className={cn("relative aspect-video w-full overflow-hidden", className)}>
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={alt}
        />
      </div>
    );
  }

  return (
    <button
      className={cn(
        "group relative block w-full cursor-pointer overflow-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-brand focus-visible:outline-none",
        className,
      )}
      onClick={() => setTocando(true)}
      type="button"
    >
      {/* `display: contents`: o `<picture>` não cria caixa, então o `<img>` segue
          sendo o elemento de layout (e de LCP) que já era. */}
      <picture className="contents">
        {posterAvifMobile ? (
          <source media="(max-width: 639px)" srcSet={posterAvifMobile} type="image/avif" />
        ) : null}
        <img
          alt={alt}
          className={cn("aspect-video w-full object-cover", imageClassName)}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          height={height}
          loading={priority ? "eager" : "lazy"}
          src={posterSrc}
          width={width}
        />
      </picture>
      {badge}
    </button>
  );
}
