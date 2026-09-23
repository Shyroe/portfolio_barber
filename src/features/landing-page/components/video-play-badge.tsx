/**
 * Badge de play do vídeo do hero.
 *
 * Os dois `path` são o SVG publicado pela referência (widget de vídeo do
 * Elementor, `elementor-custom-embed-play`), com `viewBox="0 0 58 44"` — o
 * retângulo arredondado em `--destructive` (o `#dd352e` do design) e o triângulo
 * branco. O `.pen` desenha a mesma forma em 55 × 41,72 (55/58 = 0,948), então
 * fixar a largura em 55px reproduz o design sem aproximar nada.
 *
 * É decorativo por contrato: quem descreve o vídeo é o `alt` do pôster e o
 * `aria-label` do link que envolve os dois.
 */
export function VideoPlayBadge({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      height={41.72}
      viewBox="0 0 58 44"
      width={55}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M52.305,44H5.695C2.55,44,0,41.45,0,38.305V5.695C0,2.55,2.55,0,5.695,0h46.61C55.45,0,58,2.55,58,5.695v32.61C58,41.45,55.45,44,52.305,44z"
        fill="var(--destructive)"
      />
      <path
        d="M21,32.53V11.47c0-1.091,1.187-1.769,2.127-1.214l17.82,10.53c0.923,0.546,0.923,1.882,0,2.427l-17.82,10.53C22.187,34.299,21,33.621,21,32.53z"
        fill="#ffffff"
      />
    </svg>
  );
}
