"use client";

import { useEffect, useState } from "react";

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type DepoimentosCarouselProps = {
  slides: readonly string[];
  src: string;
};

/**
 * Faixa de depoimentos com o `Carousel` do shadcn (embla), que é o primitive do
 * projeto para isso — antes era um `<ul>` com `overflow-x-auto` e `scroll-snap`
 * feito à mão, sem nenhum controle programático sobre a posição.
 *
 * **Os bullets são contados a partir do embla, não do array de slides.** A conta
 * é `posições = itens − visíveis + 1`, então o número de bullets depende do
 * viewport: com os 6 depoimentos de `depoimentosCopy.slides` o desktop (3
 * visíveis) tem 4 posições e o mobile (1 visível) tem 6. É essa conta que faz os
 * 4 bullets do design terem destino no desktop — com 4 itens existiam só 2
 * posições, e clicar no 3º e no 4º não mexia na faixa.
 *
 * `loop: true` foi tentado e não ajuda a fechar essa conta: o próprio embla
 * rebaixa o loop para `false` quando `slideLooper.canLoop()` falha, o que
 * acontecia com 4 itens (repetir slides exige conteúdo para preencher a janela
 * duas vezes — 1017,24px de conteúdo para 763,02px de janela).
 *
 * As setas do primitive não entram porque o design não tem seta; a navegação por
 * teclado vem do `onKeyDownCapture` do `Carousel`.
 */
export function DepoimentosCarousel({ slides, src }: DepoimentosCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [snaps, setSnaps] = useState(0);

  useEffect(() => {
    if (!api) return;

    const sync = () => {
      setCurrent(api.selectedScrollSnap());
      setSnaps(api.scrollSnapList().length);
    };

    sync();
    api.on("select", sync);
    api.on("reInit", sync);

    return () => {
      api.off("select", sync);
      api.off("reInit", sync);
    };
  }, [api]);

  return (
    <Carousel
      aria-label="Depoimentos em vídeo de alunos"
      className="w-full pb-[5px] lg:min-w-0 lg:flex-1"
      opts={{ align: "start" }}
      setApi={setApi}
    >
      <CarouselContent className="ml-0">
        {slides.map((alt) => (
          <CarouselItem
            className="shrink-0 basis-[329.98px] cursor-pointer pb-[6px] pl-0 lg:basis-[254.31px]"
            key={alt}
          >
            <img
              alt={alt}
              className="h-[631.66px] w-full object-fill lg:h-[486.81px]"
              decoding="async"
              height={691}
              fetchPriority="low"
              loading="lazy"
              src={src}
              width={361}
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="mt-px flex justify-center gap-3 pt-[3px] pb-[6px]">
        {slides.slice(0, snaps).map((alt, index) => (
          <button
            aria-current={index === current ? "true" : undefined}
            aria-label={`Ir para a posição ${index + 1} de ${snaps}`}
            className={cn(
              "size-[15px] cursor-pointer rounded-full p-0 transition-colors",
              index === current ? "bg-highlight" : "bg-highlight/27 hover:bg-highlight/45",
            )}
            key={alt}
            onClick={() => api?.scrollTo(index)}
            type="button"
          />
        ))}
      </div>
    </Carousel>
  );
}
