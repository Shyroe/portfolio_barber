const bonusCopy = {
  /*
   * O design (e a própria página publicada) traz Lorem ipsum no corpo dos 4 cards.
   * O texto abaixo foi **gerado** a partir do título de cada bônus, a pedido do
   * produto, para a peça ficar pronta para o portfólio — não veio do cliente e
   * deve ser revisado por ele antes de publicar. Os títulos são copy literal. O 4º card reusa a imagem do 2º no
   * design (como o destaque repete a 4ª foto na 6ª), por isso cada card tem `id`
   * estável: chave derivada de `src`+`alt` colidiria.
   */
  cards: [
    {
      body: "Como organizar a agenda, atrair clientes fiéis e oferecer serviços extras sem parecer insistente com ninguém.",
      id: "gestao",
      image: "/media/derived/bonus-card-gestao.webp",
      title: "Gestão e vendas",
    },
    {
      body: "O básico para abrir o CNPJ, emitir nota fiscal e manter a barbearia em dia com as obrigações do fisco.",
      id: "contabilidade",
      image: "/media/derived/bonus-card-contabilidade.webp",
      title: "Contabilidade e gestão fiscal",
    },
    {
      body: "O que postar para atrair cliente no seu bairro: antes e depois, reels e uma bio que realmente converte.",
      id: "marketing",
      image: "/media/derived/bonus-card-marketing.webp",
      title: "Marketing para redes sociais",
    },
    {
      body: "Uma planilha pronta para descobrir o custo real de cada corte e o lucro que sobra em cada serviço.",
      id: "planilha",
      image: "/media/derived/bonus-card-contabilidade.webp",
      title: "Planilha de cálculo de margem de lucro",
    },
  ],
  subtitle: "E AINDA TEM MAIS! OLHA SÓ O QUE VOCÊ VAI LEVAR COMPLETAMENTE GRÁTIS.",
  title: "Bônus Exclusivos",
} as const;

const BG_DESKTOP = "/media/derived/bonus-bg-desktop.webp";
const BG_MOBILE = "/media/derived/bonus-bg-mobile.webp";

/**
 * Seção 8 do design (`Yv9Le` no desktop, `XMw53` no mobile): os 4 bônus.
 *
 * A geometria saiu do runtime do pen.dev e do render exportado, não do `.pen` — ele
 * usa auto-layout. O que importa aqui:
 *
 * - **A grade tem altura fixa** (550 no desktop, 1500 no mobile) e as linhas são
 *   **centralizadas** nela: no desktop os cards ficam em y=25,97 e y=290,97 dentro
 *   dos 550, e o passo entre linhas é 265 para cards de 233,05 (ou seja, gap 31,95).
 *   Sem a altura fixa e o `content-center`, a primeira linha encostaria no topo.
 * - **A largura do card não é declarada**: ela sai da grade — 2 colunas de 548,8 com
 *   gap 22,39 dentro dos 1120. É a mesma conta da seção de módulos.
 * - No desktop o card é **linha** (imagem 125,41×173,05 + coluna de texto de 348,39,
 *   gap 15) e no mobile é **coluna** com tudo centralizado. A coluna de texto é
 *   **centralizada na vertical** dentro da linha, não alinhada ao topo: ela mede
 *   104,6px (8 de padding + título 27,6 + gap 6 + corpo de 3 linhas de 21) numa linha
 *   de 173,05, e o design a coloca 34,2px abaixo do topo — exatamente (173,05 − 104,6)/2.
 *   Com `items-start` o texto subia 34px contra o design.
 * - O fundo do card é o token `--panel` (`#2b2a2a`), que o CSS já descreve como
 *   "painel/card dentro do fundo escuro (Módulos, Bônus)".
 */
export function BonusSection() {
  return (
    <section
      aria-labelledby="bonus-title"
      className="relative isolate overflow-hidden bg-brand px-5 xl:px-0"
      id="bonus"
    >
      <picture>
        <source media="(min-width: 1024px)" srcSet={BG_DESKTOP} />
        <img
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full object-fill opacity-[0.19]"
          height={1744}
          src={BG_MOBILE}
          width={390}
        />
      </picture>

      <div className="container-page flex flex-col gap-5 py-10 lg:py-[90px]">
        <h2
          className="text-center font-display text-display-35 font-extrabold leading-none text-white"
          id="bonus-title"
        >
          {bonusCopy.title}
        </h2>

        <p className="text-center font-sans text-body-18 font-medium leading-none text-white">
          {bonusCopy.subtitle}
        </p>

        <div className="w-full px-[10px]">
          <ul
            // biome-ignore lint/a11y/noRedundantRoles: o Safari descarta o papel implícito do `ul` com `list-style: none` (preflight) e `display: grid/flex`
            role="list"
            className="flex h-[1500px] flex-col justify-center gap-[23.6px] py-[10px] md:grid md:h-auto md:grid-cols-2 md:content-center md:justify-normal lg:h-[550px] lg:grid-cols-2 lg:content-center lg:justify-normal lg:gap-x-[22.39px] lg:gap-y-[31.95px] lg:py-0"
          >
            {bonusCopy.cards.map((card) => (
              <li
                data-reveal-jello
                className="flex flex-col items-center gap-[14px] rounded-[5px] bg-panel p-[30px] shadow-[0_6px_10px_#00000047] lg:flex-row lg:items-center lg:gap-[15px]"
                key={card.id}
              >
                {/*
                  `alt=""`: a imagem é ilustrativa e o `h3` ao lado já nomeia o
                  bônus, então descrevê-la repetiria a mesma informação. Sem
                  `aria-hidden` junto — `alt=""` sozinho já tira a imagem da
                  árvore de acessibilidade.
                */}
                <img
                  alt=""
                  className="h-[134.11px] w-[97.19px] object-fill lg:h-[173.05px] lg:w-[125.41px]"
                  decoding="async"
                  height={345}
                  loading="lazy"
                  src={card.image}
                  width={250}
                />

                <div className="flex flex-col items-center gap-[6px] lg:w-[348.39px] lg:items-start lg:pt-[8px]">
                  <h3 className="text-center font-sans text-body-23 font-semibold text-white lg:text-left">
                    {card.title}
                  </h3>
                  <p className="text-center font-sans text-body-14 text-panel-foreground lg:text-left">
                    {card.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
