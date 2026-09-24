const certificadoCopy = {
  /*
   * A quebra depois de "com" é do design: no `.pen` o parágrafo é **um** nó de
   * texto com `\n` no meio (18/500, `lineHeight: 1`), não duas linhas por quebra
   * automática. No mobile ele ainda quebra sozinho dentro dos 350px, chegando nas
   * 5 linhas (90px) que o design declara para o bloco.
   */
  body: [
    "Após concluir o Curso de GENTLEMAN BARBER você irá baixar um maravilhoso certificado com",
    "70 Horas, direto de sua área restrita, sem custo adicional.",
  ],
  title: "Certificado de Conclusão",
} as const;

const DOC_DESKTOP = "/media/derived/certificado-documento-desktop.webp";
const DOC_MOBILE = "/media/derived/certificado-documento-mobile.webp";

/**
 * Seção 6 do design (`mZBJO` no desktop, `g1Mk04` no mobile): o certificado de
 * conclusão.
 *
 * A geometria vem do runtime do pen.dev, não do arquivo: o `.pen` usa auto-layout
 * e só o editor calcula as posições. O container é `1140×715` com
 * `justifyContent: center`, `alignItems: center`, gap 20 e padding `[50, 0]` — a
 * coluna é centralizada nos dois eixos dentro dos 715px, e é isso que
 * `justify-center` + `lg:h-[715px]` reproduzem. No mobile o container tem 626px
 * com padding `[40, 0]`.
 *
 * Os dois bitmaps do certificado têm exatamente a proporção da caixa em que são
 * desenhados (552×386,39 no desktop, 350×245,17 no mobile), então o `object-fill`
 * do design não distorce nada aqui — diferente do fundo da seção de depoimentos,
 * cuja textura é esticada de 1366×650 para 1469px de altura.
 *
 * A seção não tem CTA: o design não desenha nenhum, e um link só para leitor de
 * tela seria um tab stop invisível, não uma fidelidade.
 */
export function CertificadoSection() {
  return (
    <section
      aria-labelledby="certificado-title"
      className="relative isolate overflow-hidden bg-brand px-5 xl:px-0"
      id="certificado"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[url('/media/derived/certificado-bg-mobile.webp')] bg-no-repeat opacity-[0.19] lg:bg-[url('/media/derived/certificado-bg-desktop.webp')]"
        style={{ backgroundSize: "100% 100%" }}
      />

      {/*
        Altura fixa nos dois viewports, mas com o `justify` **diferente** em cada
        um: no desktop o runtime do pen.dev declara `justifyContent: center` dentro
        dos 715px; no mobile o container também tem altura fixa (626px), porém o
        conteúdo encosta no padding de cima. Isso está no render exportado — no
        mobile a primeira faixa de tinta do título começa em y=43, o que só fecha
        com o bloco começando em y=40 (o padding); centralizado daria 50,4. Sem a
        altura fixa a seção fechava 526px contra os 626 do design.
      */}
      <div className="container-page flex h-[626px] flex-col items-center justify-start gap-5 py-10 lg:h-[715px] lg:justify-center lg:py-[50px]">
        <h2
          className="text-center font-display text-display-35 font-extrabold leading-none text-white"
          id="certificado-title"
        >
          {certificadoCopy.title}
        </h2>

        <p className="text-center font-sans text-body-18 font-medium leading-none text-white">
          {certificadoCopy.body[0]}
          <br />
          {certificadoCopy.body[1]}
        </p>

        {/*
          O dimensionamento fica no `<picture>`, não no `<img>`: o `<picture>` é o
          item flex e é inline, então `w-full` no filho vira dependência circular
          (100% de um pai que se dimensiona pelo próprio filho) e a imagem colapsa
          para 0×0 — foi o que o browser real mostrou. Com a proporção no
          `<picture>`, a altura acompanha a largura e a imagem nunca distorce:
          abaixo de 390px a caixa encolhe proporcionalmente em vez de manter
          245,17px de altura com largura menor.
        */}
        <picture className="aspect-[350/245.17] w-full max-w-[350px] lg:aspect-[552/386.39] lg:max-w-[552px]">
          <source media="(min-width: 1024px)" srcSet={DOC_DESKTOP} />
          <img
            alt="Certificado de conclusão do curso Gentleman Barber, de 70 horas"
            className="h-full w-full object-fill"
            decoding="async"
            height={245}
            fetchPriority="low"
            loading="lazy"
            src={DOC_MOBILE}
            width={350}
          />
        </picture>
      </div>
    </section>
  );
}
