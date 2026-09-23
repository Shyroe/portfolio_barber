import localFont from "next/font/local";

/**
 * Fonts are vendored under `src/styles/fonts/` and self-hosted by `next/font`:
 * no runtime request to a third-party font CDN, no layout shift, and a
 * reproducible build with no build-time network access.
 *
 * These are the families the design uses (see `design/SECTIONS.md`). All three
 * are libre and cleared for commercial use — provenance, licences and hashes are
 * in `docs/ASSET_PROVENANCE.md`:
 *
 *   - **Montserrat** (variable 100–900) — body copy, the workhorse of the page
 *   - **Slackey** (400) — display headings
 *   - **Poppins** (700) — accent text
 *
 * Only the `latin` subset is committed, which covers every accented character
 * used in pt-BR.
 */

export const montserrat = localFont({
  src: [
    {
      path: "../styles/fonts/montserrat-normal-variable-latin.woff2",
      style: "normal",
      weight: "100 900",
    },
  ],
  display: "swap",
  variable: "--font-montserrat",
  // O corpo do texto **não** é o elemento de LCP (é o poster do vídeo, no hero):
  // pré-carregar 26,6 KB de Montserrat só fazia o corpo competir por banda com o
  // recurso que decide a métrica. Sem preload ele chega pelo `@font-face` e o
  // texto pinta com a fonte de fallback (métricas ajustadas pelo `next/font`, sem
  // CLS) até a troca.
  preload: false,
});

export const slackey = localFont({
  src: [
    {
      path: "../styles/fonts/slackey-normal-400-latin.woff2",
      style: "normal",
      weight: "400",
    },
  ],
  display: "swap",
  variable: "--font-slackey",
  // Display headings sit in the first viewport too. The design sets Slackey at
  // weight 800; the family only ships 400, so the browser synthesises the bold —
  // kept as-is to match the reference rather than substituting a family.
  preload: true,
});

export const poppins = localFont({
  src: [
    {
      path: "../styles/fonts/poppins-normal-700-latin.woff2",
      style: "normal",
      weight: "700",
    },
  ],
  display: "swap",
  variable: "--font-poppins",
  // Accent text appears further down the page, so preloading it would only
  // compete with the hero for bandwidth.
  preload: false,
});
