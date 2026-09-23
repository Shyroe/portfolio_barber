/**
 * Single source of truth for the site identity.
 *
 * Everything here comes from the design (`design/README.md`,
 * `docs/specs/PROJECT_SPEC.md`): the product name, the promise used as the
 * document title, the canonical origin and the two CTAs.
 *
 * There is no header, no `nav` rendering and no contact: the design has none
 * (`PROJECT_SPEC` §5). The footer's copy — legal notice included — lives in the
 * footer section itself, next to the layout that shows it, because it is that
 * section's content and not site identity.
 */

export const siteConfig = {
  /** Short product name. Used in the title template, the hero logo alt and the footer. */
  name: "Gentleman Barber",

  /** Default document title, from the hero's promise. */
  title: "Gentleman Barber — Aprenda a se tornar um barbeiro profissional",

  /** Meta description, assembled from the design's own copy (150-160 characters). */
  description:
    "Curso online de barbearia: torne-se um barbeiro profissional, conquiste seus clientes e receba o certificado de 70 horas, com acesso vitalício.",

  /**
   * Canonical origin, without a trailing slash. Used as `metadataBase`, in the
   * canonical link, in the sitemap and by `robots.ts`.
   */
  url: "https://barber.leonardocamargo.dev.br",

  locale: "pt-BR",

  /** Social preview image. Replace the source art and run `assets:derivatives`. */
  ogImage: "/media/derived/og-cover.jpg",

  /**
   * In-page navigation. Each `href` must match a section `id` on the page — the
   * unit test `points every in-page anchor at an element that exists` fails if
   * one does not. Nothing renders this list: the design has no nav, so it stands
   * only as the declared anchor contract the unit test reads.
   */
  nav: [{ label: "Início", href: "#inicio" }],

  /**
   * The page's path action: every CTA that is not the checkout itself scrolls to
   * the offer section — that is the product decision of 2026-09-19 and the
   * page's conversion path (`PROJECT_SPEC` §4). The four sections that use it are
   * the hero, Módulos, Depoimentos and the footer.
   */
  primaryCta: { label: "QUERO COMEÇAR AGORA", href: "#oferta" },

  /**
   * The checkout action, used only inside the offer section — the conversion
   * itself. `href` is `#` on purpose: the design specifies no destination (no
   * phone, e-mail or link in any of its 144 strings), so the product approved a
   * placeholder until the channel is defined (`PROJECT_SPEC` §4). It is the only
   * `#` anchor on the page, and the unit test holds that invariant.
   */
  checkoutCta: { href: "#" },
} as const;

export type SiteConfig = typeof siteConfig;
export type NavItem = SiteConfig["nav"][number];
