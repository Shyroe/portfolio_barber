import { Reveal } from "@/features/landing-page/components/reveal";
import { BonusSection } from "@/features/landing-page/sections/bonus-section";
import { CertificadoSection } from "@/features/landing-page/sections/certificado-section";
import { DepoimentosSection } from "@/features/landing-page/sections/depoimentos-section";
import { DestaqueSection } from "@/features/landing-page/sections/destaque-section";
import { FaqSection } from "@/features/landing-page/sections/faq-section";
import { FooterSection } from "@/features/landing-page/sections/footer-section";
import { HeroSection } from "@/features/landing-page/sections/hero-section";
import { ModulosSection } from "@/features/landing-page/sections/modulos-section";
import { OfertaSection } from "@/features/landing-page/sections/oferta-section";
import { ParaQuemSection } from "@/features/landing-page/sections/para-quem-section";
import { ProfessorSection } from "@/features/landing-page/sections/professor-section";

/**
 * Landing page composition.
 *
 * The only file that decides the order of the page: one import and one element
 * per section, following the design's narrative (promessa → mecanismo → prova →
 * objeção → oferta). Sections land here one at a time, in the design's order.
 *
 * Cada seção entra com a animação da referência (`fadeIn` em 1,25 s): a página
 * publicada marca os widgets com `elementor-invisible` e os revela ao cruzar a
 * dobra. O wrapper é um `<div>` neutro para o layout — as seções seguem sendo os
 * alvos das âncoras e o que o teste de contrato mede.
 *
 * There is deliberately **no header**: the design has none — no `nav`/`header`/
 * `menu` node exists anywhere in `lp-barber.pen`, and the hero is only
 * background + content. `SiteHeader` was removed with the decision
 * (`docs/specs/PROJECT_SPEC.md`, seção 5).
 */
export function LandingPage() {
  return (
    <>
      <main id="conteudo-principal">
        {/*
          O hero entra sem `Reveal`: ele é o LCP e a primeira impressão, e a
          revelação só liga depois da hidratação. Medido em 4G lento (1,6 Mbps,
          150 ms, CPU 4x), com a animação no hero a página pintava um viewport
          vazio por 3,2 s e não registrava FCP nem LCP; sem ela o hero pinta
          junto com o CSS.
        */}
        <HeroSection />
        <Reveal>
          <DestaqueSection />
        </Reveal>
        <Reveal>
          <ParaQuemSection />
        </Reveal>
        <Reveal>
          <ModulosSection />
        </Reveal>
        <Reveal>
          <OfertaSection />
        </Reveal>
        <Reveal>
          <DepoimentosSection />
        </Reveal>
        <Reveal>
          <CertificadoSection />
        </Reveal>
        <Reveal>
          <BonusSection />
        </Reveal>
        <Reveal>
          <ProfessorSection />
        </Reveal>
        <Reveal>
          <FaqSection />
        </Reveal>
      </main>

      <Reveal>
        <FooterSection />
      </Reveal>
    </>
  );
}
