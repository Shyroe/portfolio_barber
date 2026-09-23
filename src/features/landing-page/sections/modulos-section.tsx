import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import {
  IconModulo1,
  IconModulo2,
  IconModulo3,
  IconModulo4,
  IconModulo5,
  IconModulo6,
  IconModulo7,
  IconModulo8,
  IconModulo9,
} from "../components/modulos-icons";

const modulosCopy = {
  cta: "QUERO ME TORNAR UM BARBEIRO PROFISSIONAL",
  modules: [
    {
      body: "Postura, higiene e biossegurança: a base de todo corte bem feito, do cuidado com a pele à confiança de quem senta na cadeira.",
      icon: IconModulo1,
      title: "Módulo 1",
    },
    {
      body: "Máquinas, navalhas e tesouras: como escolher, regular e conservar cada ferramenta afiada, segura e durável.",
      icon: IconModulo2,
      title: "Módulo 2",
    },
    {
      body: "Cortes clássicos na tesoura: proporção, ângulos de elevação e o acabamento na régua que fecha o visual do cliente.",
      icon: IconModulo3,
      title: "Módulo 3",
    },
    {
      body: "Degradê na máquina: progressão de pentes, transições sem marca e o acabamento fino que só a navalha entrega.",
      icon: IconModulo4,
      title: "Módulo 4",
    },
    {
      body: "Barba e bigode: desenho no fio, toalha quente e a navalhagem segura, sem irritar nem cortar a pele do cliente.",
      icon: IconModulo5,
      title: "Módulo 5",
    },
    {
      body: "Sobrancelha e acabamentos: pinça, navalha e os detalhes que separam um corte comum de um serviço completo.",
      icon: IconModulo6,
      title: "Módulo 6",
    },
    {
      body: "Atendimento e experiência: consulta, linguagem e o cuidado no salão que fazem o cliente voltar sempre.",
      icon: IconModulo7,
      title: "Módulo 7",
    },
    {
      body: "Precificação e agenda: como calcular o preço de cada corte, encaixar horários e manter a cadeira sempre cheia.",
      icon: IconModulo8,
      title: "Módulo 8",
    },
    {
      body: "Construindo a carreira: portfólio, redes sociais e os passos para conquistar o seu próprio espaço no mercado.",
      icon: IconModulo9,
      title: "Módulo 9",
    },
  ],
  subtitle: "CONFIRA O CONTEÚDO O QUE TE ESPERA NO TREINAMENTO",
  title: "MÓDULOS",
};

export function ModulosSection() {
  return (
    <section
      aria-labelledby="modulos-title"
      className="relative isolate overflow-hidden bg-brand"
      id="modulos"
    >
      <picture>
        <source media="(min-width: 1024px)" srcSet="/media/derived/destaque-pattern-desktop.webp" />
        <img
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-10 size-full object-fill opacity-[0.19]"
          height={2980}
          src="/media/derived/destaque-pattern-mobile.webp"
          width={390}
        />
      </picture>

      <div className="container-page px-5 xl:px-0">
        <div className="flex flex-col gap-5 py-10 lg:py-[90px]">
          <h2
            className="text-center font-display text-display-30 font-extrabold text-highlight lg:text-display-35"
            id="modulos-title"
          >
            {modulosCopy.title}
          </h2>

          <p className="text-center text-body-16 font-medium text-white lg:text-body-18">
            {modulosCopy.subtitle}
          </p>

          <ul
            // biome-ignore lint/a11y/noRedundantRoles: o Safari descarta o papel implícito do `ul` com `list-style: none` (preflight) e `display: grid/flex`
            role="list"
            className="mb-[18px] grid grid-cols-1 gap-[35px] pt-[17px] md:grid-cols-3 lg:mb-0 lg:gap-x-[22.39px] lg:gap-y-0 lg:px-[10px] lg:pt-[21.66px] lg:[grid-template-rows:288.33px_288.33px_286.68px]"
          >
            {modulosCopy.modules.map(({ body, icon: Icon, title }) => (
              <li
                data-reveal-jello
                className="flex h-[265px] flex-col rounded-lg border-highlight border-t-2 bg-linear-to-b from-panel to-brand p-[30px] md:h-auto lg:h-[265px]"
                key={title}
              >
                <div className="flex flex-col gap-[15px]">
                  <span className="flex justify-center">
                    <Icon className="size-[50px] text-highlight" />
                  </span>

                  <div className="flex flex-col gap-4 pt-2">
                    <h3 className="text-center text-body-20 font-semibold text-white">{title}</h3>
                    <p className="text-center text-body-15 text-white">{body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <Button
            asChild
            className="h-[78px] w-full rounded-lg border-b-2 border-surface/34 px-10 pt-5 pb-[22px] text-center font-accent text-cta-18 font-bold leading-none whitespace-normal shadow-none lg:h-[63px] lg:w-auto lg:self-center lg:text-cta-21 lg:whitespace-nowrap"
            variant="highlight"
          >
            <a data-reveal-jello href={siteConfig.primaryCta.href}>
              {modulosCopy.cta}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
