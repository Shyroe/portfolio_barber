"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /**
   * `fade-in` para blocos e títulos, `jello` para o que deve chamar atenção
   * (CTAs e cards). São exatamente as duas animações que a referência declara nos
   * `data-settings` do Elementor, com a mesma duração (1,25 s).
   */
  animation?: "fade-in" | "jello";
};

/**
 * Animação de entrada, como na referência.
 *
 * A página publicada marca 33 widgets com `elementor-invisible` e aplica
 * `.animated` (1,25 s) quando cada um cruza a dobra: `fadeIn` nos títulos e
 * `jello` nos CTAs, nos 9 cards de Módulos e nos 4 de Bônus. Aqui o mesmo
 * contrato, sem jQuery: o CSS esconde o bloco com `opacity: 0` e este componente
 * liga `data-visible` no primeiro cruzamento, o que dispara a animação.
 *
 * Três regras que vieram das seções anteriores e continuam valendo:
 * o estado oculto é `opacity: 0` e **nunca** `visibility: hidden`, para o conteúdo
 * seguir na árvore de acessibilidade; `prefers-reduced-motion` mostra tudo de
 * imediato (bloco global em `globals.css`); e o estado oculto só existe sob
 * `html.js`, marcado por um script inline no `<body>` — sem JavaScript, ou com o
 * chunk falhando, nada é escondido, porque a página não pode ficar em branco por
 * causa de uma animação.
 *
 * O hero não passa por aqui: ele é o LCP e não pode esperar a hidratação
 * (`landing-page.tsx`).
 */
export function Reveal({ animation = "fade-in", children, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Sem `IntersectionObserver` (jsdom, navegador antigo) revela na hora.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn("reveal", className)}
      data-animation={animation}
      data-reveal
      data-visible={visible ? "" : undefined}
      ref={ref}
    >
      {children}
    </div>
  );
}
