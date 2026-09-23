import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { siteConfig } from "@/config/site";
import { LandingPage } from "./landing-page";

/**
 * These tests guard the *contract* of the page, not its content or its pixels.
 *
 * They are written to survive the landing-page rebuild: they iterate over
 * whatever is on the page instead of naming the demo sections, so every new
 * section is covered automatically and this file does not need to change when
 * the design changes. Only structural regressions fail here.
 *
 * Visual fidelity and behaviour live in `e2e/`.
 */
describe("LandingPage", () => {
  it("renders exactly one h1", () => {
    render(<LandingPage />);

    const headings = screen.getAllByRole("heading", { level: 1 });

    expect(headings).toHaveLength(1);
  });

  it("exposes the main landmark targeted by the skip link", () => {
    render(<LandingPage />);

    const main = screen.getByRole("main");

    expect(main.id).toBe("conteudo-principal");
  });

  it("names every section for assistive technology", () => {
    render(<LandingPage />);

    const sections = Array.from(document.querySelectorAll("section"));

    // A page with no section at all would make this test pass vacuously.
    expect(sections.length).toBeGreaterThan(0);

    for (const section of sections) {
      const labelledBy = section.getAttribute("aria-labelledby");

      expect(labelledBy, `section #${section.id || "(sem id)"} must be labelled`).toBeTruthy();
      expect(
        document.getElementById(String(labelledBy)),
        `aria-labelledby="${labelledBy}" points at nothing`,
      ).not.toBeNull();
    }
  });

  it("gives every section an id, so it can be an anchor target", () => {
    render(<LandingPage />);

    for (const section of Array.from(document.querySelectorAll("section"))) {
      expect(section.id, "every section needs an id for in-page navigation").not.toBe("");
    }
  });

  it("points every in-page anchor at an element that exists", () => {
    render(<LandingPage />);

    const anchors = Array.from(document.querySelectorAll("a[href^='#']")).map(
      (anchor) => anchor.getAttribute("href") ?? "",
    );

    expect(anchors.length).toBeGreaterThan(0);

    for (const href of new Set(anchors)) {
      // `#` is the placeholder the product approved for the checkout CTA inside
      // the offer section: the design specifies no destination
      // (`PROJECT_SPEC` §4). Every other in-page anchor has to resolve.
      if (href === "#") {
        continue;
      }

      expect(
        document.getElementById(href.slice(1)),
        `missing anchor target for ${href} — update siteConfig.nav or the section id`,
      ).not.toBeNull();
    }
  });

  /**
   * O caminho de conversão da página é o salto até a oferta: decisão de produto
   * de 2026-09-19 (`PROJECT_SPEC` §4). Quem leva até lá são os CTAs de Hero,
   * Módulos, Depoimentos e Rodapé — todos pelo mesmo `siteConfig.primaryCta`.
   */
  it("leads every path CTA to the offer section", () => {
    render(<LandingPage />);

    const inbound = Array.from(document.querySelectorAll("a[href='#oferta']"));

    expect(document.getElementById("oferta")).not.toBeNull();
    expect(inbound.length).toBeGreaterThanOrEqual(4);

    for (const cta of inbound) {
      expect(
        cta.textContent?.trim().length,
        "a CTA sem rótulo não é clicável por nome",
      ).toBeGreaterThan(0);
    }
  });

  /**
   * Só a conversão em si fica sem destino: o design não traz telefone, e-mail nem
   * link, então `#` é o placeholder aprovado. Se um `#` aparecer fora da oferta, o
   * caminho de conversão ganhou um CTA morto.
   */
  it("keeps the placeholder anchor inside the offer section", () => {
    render(<LandingPage />);

    const placeholders = Array.from(document.querySelectorAll("a[href='#']"));

    expect(placeholders).toHaveLength(1);
    expect(document.getElementById("oferta")?.contains(placeholders[0] ?? null)).toBe(true);
  });

  it("resolves every navigation entry", () => {
    render(<LandingPage />);

    for (const item of siteConfig.nav) {
      expect(item.href.startsWith("#"), `${item.href} must be an in-page anchor`).toBe(true);
      expect(
        document.getElementById(item.href.slice(1)),
        `missing target for ${item.href}`,
      ).not.toBeNull();
    }
  });

  it("opens every external link safely", () => {
    render(<LandingPage />);

    const externalLinks = Array.from(
      document.querySelectorAll("a[href^='http'], a[href^='mailto:'], a[href^='tel:']"),
    );

    for (const link of externalLinks) {
      if (link.getAttribute("target") === "_blank") {
        expect(link.getAttribute("rel"), "target=_blank requires rel=noopener").toContain(
          "noopener",
        );
      }
    }
  });

  /**
   * The design has no header (no `nav`/`header`/`menu` node in `lp-barber.pen`),
   * so the page must not grow one back by accident: a `<header>` here would be a
   * fidelity regression, not a feature.
   */
  it("renders without a header, matching the design", () => {
    render(<LandingPage />);

    expect(screen.queryByRole("banner")).toBeNull();
  });

  it("exposes the primary call to action in the hero", () => {
    render(<LandingPage />);

    const hero = document.getElementById("inicio");
    const cta = screen.getAllByRole("link", { name: siteConfig.primaryCta.label });

    expect(hero).not.toBeNull();
    expect(cta.length).toBeGreaterThan(0);
    expect(hero?.contains(cta[0] ?? null)).toBe(true);
  });

  // O design do rodapé não tem navegação nem contato: tem aviso legal, CTA, logo e
  // copyright. A via de conversão dele é o CTA.
  it("exposes the footer call to action and the legal notice", () => {
    render(<LandingPage />);

    const footer = screen.getByRole("contentinfo");

    expect(within(footer).getByRole("link", { name: /QUERO ME TORNAR UM BARBEIRO/ })).toBeDefined();
    expect(within(footer).getByText(/Nenhuma informação contida neste produto/)).toBeDefined();
    expect(within(footer).getByText(/Todos os direitos reservados/)).toBeDefined();
  });
});
