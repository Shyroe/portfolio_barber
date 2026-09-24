import { cn } from "@/lib/utils";
import { CheckCircleFillIcon } from "../components/icons";

const paraQuemCopy = {
  badge: "#GENTLEMANBARBER",
  items: [
    { id: "ja-trabalha", text: "Para quem já trabalha na área e quer se atualizar" },
    {
      id: "comecando-do-zero",
      text: "Para quem está começando do zero e nunca teve contato com o mundo da barbearia",
    },
    {
      id: "profissionalizar",
      text: "Para quem quer se profissionalizar e conquistar o seu sucesso nesse mercado que só cresce!",
    },
    { id: "ja-trabalha-repetido", text: "Para quem já trabalha na área e quer se atualizar" },
    {
      id: "profissionalizar-repetido",
      text: "Para quem quer se profissionalizar e conquistar o seu sucesso nesse mercado que só cresce!",
    },
  ],
  title: "PARA QUEM É O",
};

export function ParaQuemSection() {
  return (
    <section
      aria-labelledby="para-quem-title"
      className="relative isolate overflow-hidden"
      id="para-quem"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[url('/media/derived/para-quem-bg-mobile.webp')] bg-no-repeat lg:bg-[url('/media/derived/para-quem-bg-desktop.webp')]"
        style={{ backgroundSize: "100% 100%" }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-scrim/50" />

      <div className="container-page px-5 xl:px-0">
        <div className="pt-10 pb-5 lg:py-[50px]">
          <div className="flex flex-col gap-5 p-[10px] lg:w-[570px]">
            <h2
              className="font-display text-display-30 font-extrabold text-highlight lg:text-display-47"
              id="para-quem-title"
            >
              {paraQuemCopy.title}
            </h2>

            <p className="font-display text-display-22 font-extrabold text-white lg:text-display-35">
              {paraQuemCopy.badge}
            </p>

            {/*
             * O teto de 550px é a largura da lista no frame desktop. Sem ele, em
             * 768 a lista ia a 708px e as frases ficavam com quase o dobro da
             * medida de leitura do design. `lg:mx-0` preserva o alinhamento à
             * esquerda do frame (o `mx-auto` só vale na faixa intermediária).
             */}
            <ul
              // biome-ignore lint/a11y/noRedundantRoles: o Safari descarta o papel implícito do `ul` com `list-style: none` (preflight) e `display: grid/flex`
              role="list"
              className="mx-auto flex w-full max-w-[550px] flex-col gap-[5.5px] lg:mx-0"
            >
              {paraQuemCopy.items.map((item) => (
                <li
                  className={cn(
                    "flex items-center",
                    item.id !== paraQuemCopy.items.at(-1)?.id && "pb-[5.5px]",
                  )}
                  key={item.id}
                >
                  <span className="flex h-[26px] w-[27.5px] shrink-0 justify-center">
                    <CheckCircleFillIcon className="size-6 text-highlight" />
                  </span>
                  <p className="w-[303px] shrink-0 pl-[5px] text-body-15 leading-normal text-white lg:w-[522.5px] lg:text-body-18">
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
