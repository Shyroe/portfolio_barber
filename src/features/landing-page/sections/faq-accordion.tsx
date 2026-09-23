"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AddIcon, RemoveIcon } from "@/features/landing-page/components/faq-icons";

export type FaqItem = {
  answer: string;
  question: string;
};

/**
 * Acordeão do FAQ com o primitive do shadcn (Radix), que já trata teclado
 * (Enter/Espaço, setas e Home/End) e o `aria-expanded`/`aria-controls`.
 *
 * O design desenha **só o estado fechado**: o item tem 58px, fundo `#5b5a5a`
 * (`--brand-soft`), a pergunta em (20, 18) e o ícone em (1102, 17). O item **cresce**
 * quando a pergunta quebra: no mobile a segunda ("Posso acessar o curso por quanto
 * tempo?") ocupa duas linhas e o item vai a 76px. Por isso nada é posicionado de
 * forma absoluta — a largura vem do fluxo (`pl-5`/`pr-[38px]`), a quebra acontece
 * sozinha e a altura mínima de 58px acompanha.
 *
 * O **ícone** é que fica absoluto, e não por estética: ele tem 22px de altura contra
 * os 18px da pergunta, então em fluxo com `items-start` era ele que ditava a altura
 * do item — 61px em vez de 58. No design o ícone está em (right 16, y 17) e não
 * participa do fluxo, por isso o item fecha em 58 e só cresce quando o **texto**
 * quebra (76px na segunda pergunta no mobile).
 *
 * O "+" é o `Material Symbols Rounded/add` do design. O primitive traz um chevron
 * embutido no gatilho; ele fica escondido por `[&>svg]:hidden` (o ícone próprio vai
 * dentro de um `<span>`, então o seletor de filho direto não o alcança).
 */
export function FaqAccordion({ items }: { items: readonly FaqItem[] }) {
  /*
   * A referência usa o widget de toggle do Elementor, que **não** fecha o item
   * anterior: clicar em duas perguntas deixa as duas abertas (`aria-expanded`
   * true nas duas, medido na página publicada). Por isso `type="multiple"`, e não
   * `single collapsible`.
   */
  return (
    <Accordion className="flex w-full flex-col gap-[19px]" type="multiple">
      {items.map((item) => (
        <AccordionItem
          className="relative w-full border-0 bg-brand-soft data-[state=open]:pb-5"
          key={item.question}
          value={item.question}
        >
          <AccordionTrigger className="relative min-h-[58px] w-full flex-none items-start rounded-none pt-[18px] pr-[38px] pb-[22px] pl-5 hover:no-underline focus-visible:ring-ring/50 [&>svg]:hidden">
            <span className="text-left font-sans text-body-18 font-medium leading-none text-brand-foreground">
              {item.question}
            </span>
            <span className="absolute top-[17px] right-4 text-brand-foreground">
              {/*
                A referência troca o `+` por um `−` no item aberto; o design só
                desenha o estado fechado. O `data-state` vem do trigger do Radix.
              */}
              <AddIcon className="size-[22px] [[data-state=open]_&]:hidden" />
              <RemoveIcon className="hidden size-[22px] [[data-state=open]_&]:block" />
            </span>
          </AccordionTrigger>

          <AccordionContent className="px-5 pt-0 pb-0">
            <p className="font-sans text-body-15 text-brand-foreground">{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
