const professorCopy = {
  /*
   * Bio do design, **localizada para a versão independente do portfólio**. O
   * texto original era literal do design e descrevia o personagem da referência
   * (ex-gerente de banco, canal de YouTube de empreendedorismo, 3 milhões por
   * mês) — credenciais que não são de um professor de barbearia e que ficariam
   * atribuídas a um nome fictício. A localização mantém a estrutura (4
   * parágrafos) e as **linhas renderizadas** de cada um nos dois viewports
   * (desktop 3/3/2/2, mobile 5/5/4/3), porque a altura do bloco entra na
   * geometria da seção.
   */
  bio: [
    "Olá, muito prazer, meu nome é Rafael Moreira. Sou barbeiro há 18 anos: comecei atendendo em casa, aluguei minha primeira cadeira e hoje tenho três unidades próprias.",
    "No começo não foi fácil: faltou cliente, sobrou insegurança e eu errei muito até entender o que fideliza de verdade. Hoje vivo da agenda cheia e formo novos barbeiros.",
    "Meu canal no YouTube é onde eu mostro, na prática, as técnicas que uso na cadeira todos os dias e as contas de uma barbearia que dá lucro.",
    "Eu acredito que barbearia é ofício e negócio ao mesmo tempo: técnica sem gestão não paga o aluguel.",
  ],
  eyebrow: "CONHEÇA SEU PROFESSOR",
  name: "RAFAEL MOREIRA",
} as const;

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
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[url('/media/derived/professor-bg-mobile.webp')] bg-no-repeat lg:bg-[url('/media/derived/professor-bg-desktop.webp')]"
        style={{ backgroundSize: "100% 100%" }}
      />

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
