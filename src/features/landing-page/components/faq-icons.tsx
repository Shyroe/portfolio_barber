import type { SVGProps } from "react";

/**
 * O "+" do acordeão do design: `Material Symbols Rounded/add`, 22×22, num `viewBox`
 * de 14. O path saiu do export `html-css` do nó (`data-icon-set`/`data-icon-name`),
 * pelo mesmo caminho dos ícones de Módulos — não é um "+" desenhado à mão.
 */
export function AddIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 14.000015258789062 14"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M6.08057 7.91943l-2.74121 0q-0.37939 0-0.64942-0.27002-0.27002-0.27002-0.27002-0.64941 0-0.37939 0.27002-0.64941 0.27002-0.27002 0.64942-0.27002l2.74121 0 0-2.74121q0-0.37939 0.27002-0.64942 0.27002-0.27002 0.64941-0.27002 0.37939 0 0.64941 0.27002 0.27002 0.27002 0.27002 0.64942l0 2.74121 2.74122 0q0.37939 0 0.64941 0.27002 0.27002 0.27002 0.27002 0.64941 0 0.37939-0.27002 0.64941-0.27002 0.27002-0.64941 0.27002l-2.74122 0 0 2.74122q0 0.37939-0.27002 0.64941-0.27002 0.27002-0.64941 0.27002-0.37939 0-0.64941-0.27002-0.27002-0.27002-0.27002-0.64941l0-2.74122z" />
    </svg>
  );
}

/**
 * O "−" que a referência publicada troca no lugar do "+" quando o item abre
 * (`elementor-toggle-icon-closed`/`-opened`, com `fa-plus`/`fa-minus`). O design
 * só desenha o acordeão fechado, então o glifo vem da **mesma família** do "+":
 * `Material Symbols Rounded/remove`, MIT, de
 * `fonts.gstatic.com/s/i/short-term/release/materialsymbolsrounded/remove/default/24px.svg`
 * (`viewBox` nativo da família, `0 -960 960 960`).
 */
export function RemoveIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 -960 960 960"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M240-440q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h480q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H240Z" />
    </svg>
  );
}
