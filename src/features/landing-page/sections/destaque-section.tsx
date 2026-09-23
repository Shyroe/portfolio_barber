const destaqueCopy = {
  /*
   * `id` existe porque o design repete a 4ª foto na 6ª — mesmo `src` e mesmo
   * `alt`. Sem ele a chave da lista colide (o React avisa a cada render e, com
   * chave repetida, o comportamento da lista é indefinido) e a alternativa seria
   * indexar por posição, que o Biome reprova com razão.
   */
  gallery: [
    {
      alt: "Profissional finalizando a sobrancelha de um cliente com navalha",
      id: "sobrancelha",
      src: "/media/derived/destaque-sobrancelha.webp",
    },
    {
      alt: "Barbeiro alisando o cabelo de um cliente",
      id: "alisamentos",
      src: "/media/derived/destaque-alisamentos.webp",
    },
    {
      alt: "Corte de cabelo masculino finalizado com tesoura",
      id: "corte",
      src: "/media/derived/destaque-corte.webp",
    },
    {
      alt: "Barba sendo aparada com navalha",
      id: "barba",
      src: "/media/derived/destaque-barba.webp",
    },
    {
      alt: "Degradê sendo finalizado com máquina",
      id: "degrade",
      src: "/media/derived/destaque-degrade.webp",
    },
    {
      alt: "Barba sendo aparada com navalha",
      id: "barba-repetida",
      src: "/media/derived/destaque-barba.webp",
    },
  ],
  support: "VEJA UM POUCO DO QUE TE AGUARDA NO TREINAMENTO",
  titleLines: ["CONQUISTE SEUS CLIENTES", "COM TÉCNICAS PROFISSIONAIS"],
} as const;

export function DestaqueSection() {
  return (
    <section
      aria-labelledby="destaque-title"
      className="relative isolate overflow-hidden bg-brand py-10 lg:py-[100px]"
      id="destaque"
    >
      <picture>
        <source media="(min-width: 1024px)" srcSet="/media/derived/destaque-pattern-desktop.webp" />
        <img
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full object-fill opacity-[0.19]"
          height={1600}
          src="/media/derived/destaque-pattern-mobile.webp"
          width={328}
        />
      </picture>

      {/*
       * O design **não** dá padding horizontal a esta seção no mobile (`pad=[40,0]`):
       * o título e o subtítulo ocupam os 390 e a galeria entra 10px de cada lado
       * (`pad=[0,10]`), com 370 por imagem. Com o respiro de 20px que as outras
       * seções usam, a imagem cai para 330 e o subtítulo quebra uma palavra antes
       * do design — o layout fecha em altura e mente na largura. O `lg:px-5` existe
       * para a faixa de 1024–1279, onde a viewport é menor que o container.
       */}
      <div className="container-page px-0 lg:px-5 xl:px-0 flex flex-col items-center gap-5">
        <h2
          className="text-center font-display text-display-30 font-extrabold text-brand-foreground lg:text-display-35"
          id="destaque-title"
        >
          {destaqueCopy.titleLines[0]}
          <br />
          {destaqueCopy.titleLines[1]}
        </h2>

        <p className="text-center text-body-18 font-medium text-brand-foreground">
          {destaqueCopy.support}
        </p>

        <ul
          // biome-ignore lint/a11y/noRedundantRoles: o Safari descarta o papel implícito do `ul` com `list-style: none` (preflight) e `display: grid/flex`
          role="list"
          className="grid w-full grid-cols-1 gap-5 px-[10px] py-[10px] sm:grid-cols-2 lg:grid-cols-3 lg:px-0"
        >
          {destaqueCopy.gallery.map((item) => (
            <li key={item.id}>
              <picture>
                {/* O AVIF é derivado do mesmo caminho pelo pipeline
                    (`destaque-x.webp` -> `destaque-x.avif`); o `<img>` segue
                    como fallback e o teste de derivados cobre os dois. */}
                <source srcSet={item.src.replace(/\.webp$/, ".avif")} type="image/avif" />
                <img
                  alt={item.alt}
                  className="aspect-square w-full rounded-lg object-cover"
                  decoding="async"
                  height={740}
                  fetchPriority="low"
                  loading="lazy"
                  src={item.src}
                  width={740}
                />
              </picture>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
