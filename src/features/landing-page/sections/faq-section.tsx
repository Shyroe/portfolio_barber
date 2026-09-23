import { FaqAccordion, type FaqItem } from "./faq-accordion";

/**
 * Seção 10 do design (`DPrWM` no desktop, `B0aelU` no mobile): o FAQ.
 *
 * **As respostas não existem no design** (nem na página publicada, que também está
 * em Lorem ipsum): a seção só desenha o acordeão fechado. As respostas abaixo foram
 * **geradas** a pedido do produto, para a peça ficar pronta para o portfólio, e
 * apenas reformulam o que a própria página já afirma (certificado de 70 horas,
 * acesso vitalício, parcelamento no boleto). Não vieram do cliente: revisar antes
 * de publicar.
 *
 * As 6 perguntas são copy literal do design, incluindo "vitalicio" sem acento.
 */
const faqCopy = {
  items: [
    {
      answer:
        "Você recebe o curso online completo, o certificado de 70 horas na área restrita e os quatro bônus de gestão, marketing e finanças.",
      question: "O que eu Vou Receber?",
    },
    {
      answer:
        "O acesso é vitalício: depois da matrícula as aulas ficam disponíveis na área do aluno, sem prazo para terminar.",
      question: "Posso acessar o curso por quanto tempo?",
    },
    {
      answer:
        "Sim. Além do pagamento à vista, o checkout oferece o boleto parcelado — as opções aparecem na hora da compra.",
      question: "Dá para parcelar no boleto?",
    },
    {
      answer:
        "O certificado de 70 horas é liberado na área restrita quando você conclui as aulas, sem nenhum custo adicional.",
      question: "Como eu recebo o certificado?",
    },
    {
      answer:
        "Você fala com o suporte do curso pela própria área do aluno e tira dúvidas de técnica nos comentários das aulas.",
      question: "E se eu tiver dúvidas?",
    },
    {
      answer:
        "Sim, o acesso é vitalício: a compra é única e passa a incluir também as aulas novas que entrarem no conteúdo.",
      question: "O acesso ao curso é vitalicio?",
    },
  ] satisfies readonly FaqItem[],
  subtitle: "PERGUNTAS FREQUENTES",
  title: "FAQ",
} as const;

export function FaqSection() {
  return (
    <section
      aria-labelledby="faq-title"
      className="relative isolate overflow-hidden bg-brand px-5 xl:px-0"
      id="faq"
    >
      <div className="container-page flex flex-col gap-5 py-10 lg:h-[721px] lg:py-[90px]">
        <h2
          className="text-center font-display text-display-40 font-extrabold leading-none text-highlight"
          id="faq-title"
        >
          {faqCopy.title}
        </h2>

        <p className="text-center font-sans text-body-18 font-semibold leading-none text-white">
          {faqCopy.subtitle}
        </p>

        <FaqAccordion items={faqCopy.items} />
      </div>
    </section>
  );
}
