import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { VideoFacade } from "@/features/landing-page/components/video-facade";

import { DepoimentosCarousel } from "./depoimentos-carousel";

const depoimentosCopy = {
  cta: "QUERO ME TORNAR UM BARBEIRO PROFISSIONAL",
  /*
   * Seis depoimentos, e não quatro, por causa da aritmética dos bullets: o
   * desktop mostra 3 cards por vez, então o número de posições é `itens − 3 + 1`.
   * Com 4 itens são 2 posições e dois dos 4 bullets do design ficariam sem
   * destino; com 6 itens são exatamente 4 posições. Os dois últimos usam o mesmo
   * asset dos primeiros (o design faz igual: desenha 7 figuras com a mesma
   * imagem), e os textos alternativos são placeholders no mesmo estilo até o
   * cliente mandar os depoimentos reais.
   */
  slides: [
    "Depoimento de aluna sobre faturamento mensal",
    "Depoimento de aluno sobre evolução no curso",
    "Depoimento de aluno sobre primeiros clientes",
    "Depoimento de aluna sobre resultados no mês",
    "Depoimento de aluno sobre organização da agenda",
    "Depoimento de aluna sobre clientes fiéis",
  ],
  /*
   * O `h3` ("Confira também alguns dos resultados de alunos:") não está aqui de
   * propósito: as quebras dele são do design e mudam por viewport, então as
   * palavras vivem no JSX, junto dos `<br>`. Havia duas constantes
   * (`subHeadingLead`/`subHeadingHighlight`) descrevendo esse texto sem nunca
   * serem renderizadas — foram removidas.
   */
  videos: [
    "Prévia em vídeo do módulo de cortes masculinos",
    "Prévia em vídeo do módulo de barba e navalha",
    "Prévia em vídeo do módulo de coloração",
    "Prévia em vídeo do módulo de atendimento e precificação",
    "Prévia em vídeo do módulo de degradê",
    "Prévia em vídeo do módulo de sobrancelha",
  ],
} as const;

/**
 * Link dos 6 cards de vídeo. É o vídeo de demonstração do Elementor, usado
 * como placeholder até os depoimentos reais existirem — trocar por um por card
 * (ou por um campo em `depoimentosCopy.videos`) quando o cliente enviar as URLs.
 */
const VIDEO_ID = "XHOmBV4js_E";

const VIDEO_SRC = "/media/derived/depoimentos-video.webp";
const SLIDE_SRC = "/media/derived/depoimentos-card.webp";

/**
 * Escala do badge de play. O `.pen` traz o retângulo num `viewBox` de 512 de
 * largura e o triângulo num de 182,19; no frame eles ocupam 47px e 16,725px. As
 * duas proporções dão exatamente o mesmo fator (47/512 = 16,725/182,19…), então
 * existe **uma** escala para as duas formas — era o que o `preserveAspectRatio`
 * dos SVGs aninhados do desenho anterior fingia resolver sem precisar.
 */
const PLAY_BADGE_SCALE = 47 / 512;

/** Raio dos cantos do retângulo, declarado na escala de origem (o `viewBox` de 512). */
const PLAY_BADGE_RADIUS = 50.2731 * PLAY_BADGE_SCALE;

const PLAY_BADGE_TRIANGLE =
  "M0 198.35507l0-185.90895c0.00029-4.46863 2.396-8.59419 6.27698-10.80928 3.88098-2.21509 8.65157-2.17976 12.49931 0.09259l157.30757 92.95448c3.78629 2.24025 6.10874 6.31287 6.10874 10.71228 0 4.3994-2.32245 8.472-6.10874 10.71227l-157.30758 92.95447c-3.84637 2.27154-8.61507 2.30774-12.49546 0.09478-3.88039-2.21295-6.27736-6.33557-6.28082-10.80264";

/**
 * Botão de play do design (`szvY9`): retângulo `--destructive` de 47×35,655 com
 * cantos de raio 50,2731 (na escala de origem) e triângulo branco de
 * 16,725×19,35, a 80% de opacidade.
 *
 * Um `<svg>` só: o retângulo é um retângulo de cantos arredondados de raio
 * uniforme, então sai como `<rect rx>` no lugar dos 400 caracteres de `d`, e o
 * triângulo leva o `transform` que mapeia o `viewBox` dele para os 16,725px do
 * frame. Nada de `svg` dentro de `svg`.
 *
 * O design centra uma caixa de 53px no card e encosta o ícone de 47px no topo
 * dela — o resultado é o ícone 3px acima do centro, que é o que o `-mt-[3px]`
 * reproduz sem precisar da caixa (o `.pen` mede 74,3 num card de 201,59).
 *
 * É decoração: o texto alternativo do card já nomeia o vídeo, então o ícone fica
 * fora da árvore de acessibilidade e não recebe foco. Fica **sem**
 * `pointer-events-none` de propósito — sem isso, inspecionar o ícone no DevTools
 * cai sempre na imagem do card.
 */
function PlayBadge() {
  return (
    <svg
      aria-hidden="true"
      className="absolute top-1/2 left-1/2 -mt-[3px] size-[47px] -translate-x-1/2 -translate-y-1/2 text-destructive opacity-80"
      viewBox="0 0 47 47"
    >
      <rect fill="currentColor" height="35.655" rx={PLAY_BADGE_RADIUS} width="47" x="0" y="5.672" />
      <path
        className="text-brand-foreground"
        d={PLAY_BADGE_TRIANGLE}
        fill="currentColor"
        transform={`translate(17.017 13.824) scale(${PLAY_BADGE_SCALE})`}
      />
    </svg>
  );
}

/** Path único do chevron: as duas setas do design são a mesma forma. */
const RESULTS_CHEVRON_PATH =
  "M237.24799 146.72l-128-128c-24.92801-24.96-65.568-24.96-90.49601 0-12.09598 12.06401-18.75198 28.16001-18.75198 45.24801 0 17.08799 6.65601 33.184 18.752 45.24799l82.752 82.752-82.752 82.752c-12.09599 12.09601-18.752 28.16-18.752 45.24802 0 17.08801 6.65601 33.15201 18.752 45.24798 12.09599 12.09598 28.15999 18.75202 45.248 18.75202 17.08801 0 33.15201-6.65601 45.24799-18.75202l128-128c12.096-12.06399 18.75201-28.16 18.75201-45.248 0-17.088-6.65601-33.184-18.75201-45.248m-22.624 67.87201l-128 128c-12.12799 12.09601-33.11999 12.09601-45.24801 0-12.48-12.48001-12.48-32.768 0-45.24802l105.376-105.376-105.376-105.37601c-6.04801-6.048-9.37601-14.08-9.37601-22.624 0-8.544 3.328-16.576 9.37601-22.624 5.99353-6.01089 14.13559-9.38518 22.62402-9.37597 8.48163-0.00668 16.61899 3.35415 22.62399 9.344l128 128c6.04801 6.08 9.37601 14.112 9.37601 22.65601 0 8.544-3.328 16.57599-9.37601 22.62399";

/** Mesmo caso do badge: 26,667px no frame sobre um `viewBox` de 256. */
const RESULTS_CHEVRON_SCALE = 26.667 / 256;

/**
 * Chevron duplo laranja do design (`jYMSb`): duas setas idênticas de
 * 26,667×39,997, a da direita deslocada 23,333px.
 *
 * A mesma forma duas vezes, com `transform` — um `<svg>` só, sem os dois SVGs
 * aninhados que vinham do desenho anterior.
 *
 * Substitui o antigo selo de "conteúdo verificado" (círculo laranja com check),
 * que não existe em nenhum nó do design — era invenção, não tradução.
 */
function ResultsChevron() {
  return (
    <svg aria-hidden="true" className="size-[50px] text-highlight" viewBox="0 0 50 50">
      <path
        d={RESULTS_CHEVRON_PATH}
        fill="currentColor"
        transform={`translate(0 5.002) scale(${RESULTS_CHEVRON_SCALE})`}
      />
      <path
        d={RESULTS_CHEVRON_PATH}
        fill="currentColor"
        transform={`translate(23.333 5.002) scale(${RESULTS_CHEVRON_SCALE})`}
      />
    </svg>
  );
}

export function DepoimentosSection() {
  return (
    <section
      aria-labelledby="depoimentos-title"
      className="relative isolate overflow-hidden bg-brand px-5 xl:px-0"
      id="depoimentos"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[url('/media/derived/depoimentos-bg-mobile.webp')] bg-no-repeat opacity-[0.19] lg:bg-[url('/media/derived/depoimentos-bg-desktop.webp')]"
        style={{ backgroundSize: "100% 100%" }}
      />

      <div className="container-page flex flex-col items-center gap-5 py-10 lg:py-[90px]">
        <h2
          className="w-full text-center font-display text-display-31 font-extrabold leading-none text-white lg:text-display-35"
          id="depoimentos-title"
        >
          Confira Alguns <br className="lg:hidden" />
          <span className="text-highlight">Depoimentos</span> de <br className="lg:hidden" />
          Alunos
        </h2>

        {/*
          `pb-[30px]` no desktop é o respiro de 30px que separa o fim da grade do
          início do bloco seguinte no design (o frame declara 558px para 528px de
          conteúdo). Sem ele a seção fecha 30px mais curta que a referência.
        */}
        <div className="w-full px-[10px] pb-[30px] lg:pt-[36.2px] lg:pb-[66.2px]">
          <ul
            // biome-ignore lint/a11y/noRedundantRoles: o Safari descarta o papel implícito do `ul` com `list-style: none` (preflight) e `display: grid/flex`
            role="list"
            className="grid grid-cols-1 justify-items-center py-[10px] sm:grid-cols-2 sm:gap-y-[26px] lg:grid-cols-3 lg:gap-x-[22.39px] lg:gap-y-[52.41px] lg:py-0"
          >
            {depoimentosCopy.videos.map((alt) => (
              <li className="relative w-full lg:h-[201.59px]" key={alt}>
                {/*
                  O card inteiro é o link do vídeo, então o badge de play fica
                  **dentro** do `<a>`: fora dele, o clique no ícone — que é o alvo
                  óbvio — cairia no vazio. O `overflow-hidden` e o raio passaram do
                  `<li>` para o `<a>` de propósito: o anel de foco global é
                  desenhado 2px fora da caixa e seria recortado por um
                  `overflow-hidden` no elemento pai.
                */}
                <VideoFacade
                  alt={alt}
                  badge={<PlayBadge />}
                  className="h-full rounded-lg shadow-[0_9px_14px_#00000080]"
                  height={201}
                  imageClassName="object-fill lg:h-full"
                  posterSrc={VIDEO_SRC}
                  videoId={VIDEO_ID}
                  width={358}
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full px-[10px] pb-[30px]">
          {/*
            No desktop o design é uma **linha**: texto à esquerda (336.98px) e
            carrossel à direita (763.02px), com o texto centralizado na vertical.
            Empilhado, a seção fechava 246px mais alta e o carrossel mostrava 4
            cards em vez de 3.
          */}
          <div className="flex flex-col items-center gap-5 py-[10px] lg:flex-row">
            <div className="flex w-full flex-col gap-5 p-[10px] lg:w-[336.98px] lg:shrink-0">
              <h3 className="w-full text-center font-display text-display-25 font-extrabold leading-none text-white lg:w-[316.98px] lg:text-left lg:text-display-38">
                Confira
                <br className="hidden lg:inline" /> também
                <br /> alguns dos
                <br /> <span className="text-highlight">resultados</span>
                <br className="hidden lg:inline" /> <span className="text-highlight">de</span>{" "}
                <br className="lg:hidden" /> <span className="text-highlight">alunos:</span>
              </h3>

              {/*
                `items-start`: no design a caixa tem 56px e o SVG de 50px encosta no
                topo dela, então o ícone não fica no centro vertical (3px acima).
              */}
              <span className="flex h-14 w-full items-start justify-center">
                <ResultsChevron />
              </span>
            </div>

            <DepoimentosCarousel slides={depoimentosCopy.slides} src={SLIDE_SRC} />
          </div>
        </div>

        <Button
          asChild
          className="h-[78px] w-full rounded-lg border-b-2 border-surface/34 px-10 pt-5 pb-[22px] text-center font-accent text-cta-18 font-bold leading-none whitespace-normal shadow-none lg:h-[63px] lg:w-auto lg:self-center lg:text-cta-21 lg:whitespace-nowrap"
          variant="highlight"
        >
          <a data-reveal-jello href={siteConfig.primaryCta.href}>
            {depoimentosCopy.cta}
          </a>
        </Button>
      </div>
    </section>
  );
}
