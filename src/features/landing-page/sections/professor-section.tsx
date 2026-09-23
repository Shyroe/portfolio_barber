const professorCopy = {
  /*
   * Bio literal do design, incluindo os desvios de digitação dele ("marcelo"
   * minúsculo, "as vender", o espaço antes da vírgula em "estrutura de vendas ,").
   * É copy aprovada — não corrijo.
   */
  bio: [
    "Olá, muito prazer meu nome é marcelo Carvalho, sou formado em administração, e trabalhei como gerente no banco do brasil por 10 anos e a 5, larguei tudo para empreender.",
    "No começo não foi fácil, quebrei muito a cabeça, joguei muito “dinheiro fora” até conseguir dominar o mercado. Hoje vivo inteiramente da minha estrutura de vendas , faturando mais de 3 milhões mensais.",
    "Meu canal de YouTube é indiscutivelmente um dos maiores canais focados em empreendedorismo do país em número de inscritos.",
    "Eu amo Vender Online e acredito que as vender é o melhor caminho para começar um negócio de sucesso na internet.",
  ],
  eyebrow: "CONHEÇA SEU PROFESSOR",
  name: "MARCELO CARVALHO",
} as const;

const BG_DESKTOP = "/media/derived/professor-bg-desktop.webp";
const BG_MOBILE = "/media/derived/professor-bg-mobile.webp";
const FOTO_DESKTOP = "/media/derived/professor-foto-desktop.webp";
const FOTO_MOBILE = "/media/derived/professor-foto-mobile.webp";

/**
 * Seção 9 do design (`Kk3oF` no desktop, `ttuR8` no mobile): a bio do professor.
 *
 * **Aqui o fundo entra em opacidade cheia**, não a 19% como nas seções 6 e 8: o
 * frame tem `fill` de imagem e é ele que pinta a seção. O retrato é um segundo
 * bitmap, sobre o fundo.
 *
 * Geometria do runtime do pen.dev: no desktop a linha tem 570 (texto) + 570
 * (retrato com 9px de respiro de cada lado) = **1140**, o container do projeto, com
 * `pad` de 50 no topo — e 50 + 667 = os 717 da seção. O bloco de texto tem 667 de
 * altura e **`justifyContent: center`**, então o conteúdo é centralizado na vertical
 * e a posição dele depende da altura total (é por isso que a sobra do bloco de
 * parágrafos importa, veja abaixo).
 *
 * No mobile a pilha é `pad` de 40 no topo + texto (598,06) + retrato (422,91)
 * = 1.060,98, com a seção a 1.061.
 */
export function ProfessorSection() {
  return (
    <section
      aria-labelledby="professor-title"
      className="relative isolate overflow-hidden bg-brand px-5 xl:px-0"
      id="professor"
    >
      <picture>
        <source media="(min-width: 1024px)" srcSet={BG_DESKTOP} />
        <img
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full object-fill"
          height={1061}
          src={BG_MOBILE}
          width={390}
        />
      </picture>

      <div className="container-page flex flex-col gap-[0.01px] pt-10 lg:flex-row lg:gap-0 lg:pt-[50px]">
        <div className="mx-auto flex w-full max-w-[552px] flex-col gap-5 p-[10px] lg:mx-0 lg:min-h-[667px] lg:w-1/2 lg:max-w-none lg:shrink-0 lg:justify-center">
          <p className="font-sans text-body-18 font-semibold leading-none text-white">
            {professorCopy.eyebrow}
          </p>

          <h2
            className="font-display text-display-40 font-extrabold leading-none text-highlight"
            id="professor-title"
          >
            {professorCopy.name}
          </h2>

          {/*
            Os 14,39px são a sobra de import do design (ele declara 282,56 no
            desktop e 440,06 no mobile para conteúdos de 268,17 e 425,67 — a mesma
            diferença nos dois). Aqui ela entra como `padding-bottom`, e não como
            `min-height`: com altura mínima, o bloco guardava 440px mesmo no tablet,
            onde os parágrafos encurtam, e sobravam ~194px de espaço vazio antes do
            retrato.
          */}
          <div className="flex flex-col gap-[14.39px] pb-[14.39px]">
            {professorCopy.bio.map((paragrafo) => (
              /*
               * `text-body-15` é o valor **declarado** no design (15px, `lineHeight:
               * 1.5` = 22,5px). O render do pen.dev arredonda para 23px por linha e
               * deixa a última transbordar a caixa, mas reproduzir isso exige fixar a
               * altura de cada parágrafo — e aí o texto corta em qualquer largura que
               * não seja a do design. A caixa natural acompanha o conteúdo e a
               * diferença fica na tinta da última linha (~2px), que é a mesma classe
               * de artefato de rasterização aceita nas outras seções.
               */
              <p className="font-sans text-body-15 font-normal text-white" key={paragrafo}>
                {paragrafo}
              </p>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-[552px] lg:mx-0 lg:w-1/2 lg:max-w-none lg:px-[9px]">
          <picture>
            <source media="(min-width: 1024px)" srcSet={FOTO_DESKTOP} />
            <img
              alt="Marcelo Carvalho, professor do curso Gentleman Barber"
              className="aspect-[350/422.91] w-full object-fill lg:aspect-[552/667] lg:w-full"
              decoding="async"
              height={667}
              loading="lazy"
              src={FOTO_MOBILE}
              width={552}
            />
          </picture>
        </div>
      </div>
    </section>
  );
}
