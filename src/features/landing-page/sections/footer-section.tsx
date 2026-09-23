import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const rodapeCopy = {
  cta: "QUERO ME TORNAR UM BARBEIRO PROFISSIONAL",
  legal:
    "“Nenhuma informação contida neste produto deve ser interpretada como uma afirmação da obtenção de resultados. Qualquer referência ao desempenho passado ou potencial de uma estratégia abordada no conteúdo não é, e não deve ser interpretada como uma recomendação ou como garantia de qualquer resultado específico.”",
  rights: "© Todos os direitos reservados",
  title: "Gentleman Barber",
} as const;

const BG_DESKTOP = "/media/derived/rodape-bg-desktop.webp";
const BG_MOBILE = "/media/derived/rodape-bg-mobile.webp";
const LOGO = "/media/derived/hero-logo.webp";

/**
 * Seção 11 do design (`sOBhr` no desktop, `NU9av` no mobile): o rodapé.
 *
 * O design **não tem navegação nem canais de contato** — o rodapé provisório do
 * boilerplate trazia os dois e foram removidos para seguir a referência. Fica o que o
 * design desenha: aviso legal (Montserrat 16/1), CTA (o mesmo padrão de botão das
 * outras seções), logo e copyright.
 *
 * O ano é o **atual**, e não o "2024" do design: `new Date().getFullYear()` num Server
 * Component resolve no build — o export é estático, então o valor sai no HTML e não há
 * divergência de hidratação.
 *
 * O logo é o mesmo bitmap do hero, que já tem proveniência registrada: o design usa
 * 623×709 nos dois lugares.
 *
 * No mobile o botão tem `pb-5` (20px) e **não** os 22px do design: o `.pen` fecha o botão em
 * 84px (20 de topo + 42 de texto + 22 de base) e desenha o `stroke` de 2px *dentro* desses
 * 22px de base, enquanto `border-b-2` com `box-sizing: border-box` e altura automática soma
 * a borda **fora** do padding (86px). 20 + 42 + 2 = 84, e a borda cai nas mesmas duas
 * últimas linhas. No desktop a altura é fixa em 63px, então o padding não altera a caixa e
 * os 22px do design seguem valendo.
 */
export function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-brand px-5 xl:px-0" id="rodape">
      <picture>
        <source media="(min-width: 1024px)" srcSet={BG_DESKTOP} />
        <img
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full object-fill opacity-[0.19]"
          height={527}
          src={BG_MOBILE}
          width={390}
        />
      </picture>

      <div className="container-page flex flex-col items-center gap-5 pt-10 pb-5 lg:h-[496.73px] lg:justify-center lg:py-[90px]">
        <p className="text-center font-sans text-body-16 text-white">{rodapeCopy.legal}</p>

        <Button
          asChild
          className="h-auto w-full rounded-lg border-b-2 border-surface/34 px-10 pt-5 pb-5 text-center font-accent text-cta-21 font-bold leading-none whitespace-normal shadow-none lg:h-[63px] lg:w-auto lg:self-center lg:whitespace-nowrap lg:pb-[22px]"
          variant="highlight"
        >
          <a data-reveal-jello href={siteConfig.primaryCta.href}>
            {rodapeCopy.cta}
          </a>
        </Button>

        <img
          alt="Gentleman Barber"
          className="h-auto w-[129.5px] lg:w-[114px]"
          decoding="async"
          height={709}
          loading="lazy"
          src={LOGO}
          width={623}
        />

        <p className="text-center font-sans text-body-16 text-white">
          {rodapeCopy.title} {year} {rodapeCopy.rights}
        </p>
      </div>
    </footer>
  );
}
