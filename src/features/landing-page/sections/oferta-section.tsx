import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const ofertaCopy = {
  attention: "ATENÇÃO, AS VAGAS SÃO LIMITADAS!",
  cta: "QUERO COMEÇAR AGORA",
  guarantee:
    "Ainda não tem certeza? Não se preocupe.Se o conteúdo descrito acima não for o mesmo que você receber, você tem 07 dias de garantia e vamos devolver a quantia paga, sem burocracia!Lembrando que seu acesso a plataforma e VITALÍCIO e nosso curso e constantemente atualizado com novas técnicas e informações que vão fazer de você um Barbeiro de Sucesso.",
  installment: "12X DE 47,14",
  intro:
    "Você vai levar esse curso mega completo, e a oportunidade se tornar, um barbeiro profissional, apenas por:",
  lumpSum: "OU APENAS R$ 499\u200b À VISTA",
  question: "VOCÊ DEVE ESTAR SE PERGUNTANDO:\nQUANTO VAI CUSTAR TUDO ISSO?",
};

export function OfertaSection() {
  return (
    <section
      aria-labelledby="oferta-title"
      className="relative isolate overflow-hidden"
      id="oferta"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[url('/media/derived/oferta-bg-mobile.webp')] bg-no-repeat lg:bg-[url('/media/derived/oferta-bg-desktop.webp')]"
        style={{ backgroundSize: "100% 100%" }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-scrim/50" />

      <div className="container-page px-5 xl:px-0">
        <div className="flex flex-col items-center gap-5 py-10 lg:py-[90px]">
          <h2
            className="text-center text-body-18 font-medium leading-none whitespace-pre-line text-white"
            id="oferta-title"
          >
            {ofertaCopy.question}
          </h2>

          <p className="text-center text-body-18 font-medium leading-none text-white">
            {ofertaCopy.intro}
          </p>

          <p className="text-center text-price-81 font-black leading-none text-highlight lg:text-price-110">
            {ofertaCopy.installment}
          </p>

          <p className="text-center text-body-18 font-medium leading-none text-white">
            {ofertaCopy.lumpSum}
          </p>

          <p className="text-center text-body-18 font-medium leading-none text-white">
            {ofertaCopy.attention}
          </p>

          <Button
            asChild
            className="h-[63px] rounded-lg border-b-2 border-surface/34 px-10 pt-5 pb-[22px] text-center font-accent text-cta-21 font-bold leading-none shadow-none"
            variant="highlight"
          >
            <a data-reveal-jello href={siteConfig.checkoutCta.href}>
              {ofertaCopy.cta}
            </a>
          </Button>

          <img
            alt="Formas de pagamento aceitas"
            className="h-[31.5px] w-[350px] lg:h-9 lg:w-[400px]"
            decoding="async"
            fetchPriority="low"
            height={36}
            loading="lazy"
            src="/media/derived/oferta-pagamento.webp"
            width={400}
          />

          <div className="w-full px-[10px]">
            <div className="flex flex-col items-center gap-5 py-[10px] lg:flex-row">
              <img
                alt="Selo de garantia de 7 dias"
                className="h-[180.27px] w-[207.89px] shrink-0 lg:h-[166.52px] lg:w-[192.03px]"
                decoding="async"
                fetchPriority="low"
                height={444}
                loading="lazy"
                src="/media/derived/oferta-garantia.webp"
                width={512}
              />
              <div className="min-h-[216.89px] w-full lg:min-h-[122.39px] lg:flex-1">
                <p className="text-center text-body-15 font-medium leading-normal text-white lg:text-left lg:text-body-18">
                  {ofertaCopy.guarantee}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
