import { expect, test } from "@playwright/test";

/**
 * Landing-page behaviour and resilience tests.
 *
 * They run against the static export served by `scripts/build/serve-static.mjs`
 * (see `playwright.config.ts`), so they exercise the exact bytes Cloudflare
 * would serve — including the absence of `next start`.
 *
 * Playwright roda com `reducedMotion: "reduce"` (ver `playwright.config.ts`), o
 * que torna o salto de âncora e as transições determinísticos.
 *
 * Scope note: these are page-level invariants that must hold in every version of
 * the landing page. Per-section tests (a specific FAQ, a specific carousel) are
 * added next to the section that introduces them — see `docs/TESTING.md`.
 */

/**
 * `lg` é 1024 e o design só define 1366: é entre os dois que a largura copiada do
 * frame transborda. 1100 fica no meio dessa faixa sem valor redondo de
 * breakpoint, que é justamente onde a conferência manual pegou os defeitos.
 */
const viewports = [
  { name: "compact", width: 320, height: 640 },
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "lg-start", width: 1024, height: 1024 },
  { name: "design-gap", width: 1100, height: 1024 },
  { name: "desktop", width: 1440, height: 1000 },
  { name: "ultrawide", width: 2560, height: 1440 },
] as const;

test.describe("layout", () => {
  for (const viewport of viewports) {
    test(`renders without horizontal overflow at ${viewport.name} (${viewport.width}px)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/", { waitUntil: "domcontentloaded" });

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      // One pixel of tolerance absorbs sub-pixel rounding on scaled displays.
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
    });
  }
});

test.describe("document contract", () => {
  test("exposes one h1, the landmarks and at least one named section", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("main")).toHaveAttribute("id", "conteudo-principal");
    // The design has no header (no nav/header/menu node in `lp-barber.pen`), so
    // a banner here would be a fidelity regression, not a missing feature.
    await expect(page.getByRole("banner")).toHaveCount(0);
    await expect(page.getByRole("contentinfo")).toBeVisible();

    // Section-agnostic: whatever sections exist must be labelled and anchored.
    const sections = await page.evaluate(() =>
      Array.from(document.querySelectorAll("section")).map((section) => ({
        id: section.id,
        labelledBy: section.getAttribute("aria-labelledby"),
        labelExists: section.getAttribute("aria-labelledby")
          ? document.getElementById(String(section.getAttribute("aria-labelledby"))) !== null
          : false,
      })),
    );

    expect(sections.length).toBeGreaterThan(0);

    for (const section of sections) {
      expect(section.id, "every section needs an id").not.toBe("");
      expect(section.labelledBy, `#${section.id} must be labelled`).toBeTruthy();
      expect(section.labelExists, `#${section.id} labels a missing element`).toBe(true);
    }
  });

  test("resolves every in-page anchor to a real target", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const broken = await page.evaluate(() =>
      Array.from(document.querySelectorAll("a[href^='#']"))
        .map((anchor) => anchor.getAttribute("href") ?? "")
        .filter((href) => href.length > 1 && document.getElementById(href.slice(1)) === null),
    );

    expect(broken).toEqual([]);
  });

  test("keeps the social preview and metadata wired to real files", async ({ page, request }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");

    expect(ogImage).toBeTruthy();

    // `metadataBase` makes the tag absolute, so the crawler-facing URL points at
    // the production domain. Fetch only its path: this asserts the file really
    // exists in the export without depending on DNS resolving in the test env.
    const ogImagePath = new URL(String(ogImage)).pathname;
    const response = await request.get(ogImagePath);

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image");

    const sitemap = await request.get("/sitemap.xml");

    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain("<urlset");

    const robots = await request.get("/robots.txt");

    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain("Sitemap:");
  });

  // O export é estático e nenhuma seção esconde conteúdo atrás de JavaScript: com
  // scripting desligado a página inteira tem de estar no HTML — o aviso legal fica
  // na última seção, então vê-lo prova que a página foi até o fim.
  test("renders its content without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText(/Nenhuma informação contida neste produto/)).toBeVisible();

    // O FAQ é o único acordeão, e as 6 perguntas do design são botões no HTML.
    await expect(page.locator("#faq button")).toHaveCount(6);

    // Se uma seção voltar a esconder conteúdo atrás de um efeito de cliente, a
    // altura dela colapsa aqui.
    const collapsed = await page.evaluate(() =>
      Array.from(document.querySelectorAll("section"))
        .filter((section) => section.getBoundingClientRect().height < 100)
        .map((section) => section.id),
    );

    expect(collapsed).toEqual([]);

    await context.close();
  });
});

test.describe("navigation", () => {
  test("scrolls to the section behind a header link", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const target = await page.evaluate(() => {
      const anchor = document.querySelector('header a[href^="#"]:not([aria-label])');
      return anchor?.getAttribute("href") ?? null;
    });

    // Skip the assertion when a derived landing page starts with no nav links.
    test.skip(!target || target === "#", "no in-page header link to verify");

    await page.getByRole("banner").locator(`a[href="${target}"]`).first().click();

    const box = await page.locator(String(target)).boundingBox();

    expect(box).not.toBeNull();
    // `scroll-margin-top` keeps the section clear of the 64px sticky header.
    expect(box?.y ?? -1).toBeGreaterThanOrEqual(0);
    expect(box?.y ?? 9999).toBeLessThanOrEqual(160);
  });

  test("opens and closes the mobile menu with the keyboard", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const toggle = page.getByRole("button", { name: /abrir menu/i });

    test.skip((await toggle.count()) === 0, "no mobile menu in this configuration");

    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();

    await expect(page.getByRole("button", { name: /fechar menu/i })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await expect(page.getByRole("navigation", { name: /mobile/i })).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(page.getByRole("navigation", { name: /mobile/i })).toBeHidden();
    // Escape must not drop focus on the floor.
    await expect(page.getByRole("button", { name: /abrir menu/i })).toBeFocused();
  });

  test("closes the mobile menu after choosing a destination", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const toggle = page.getByRole("button", { name: /abrir menu/i });

    test.skip((await toggle.count()) === 0, "no mobile menu in this configuration");

    await toggle.click();

    const mobileNav = page.getByRole("navigation", { name: /mobile/i });
    const firstLink = mobileNav.getByRole("link").first();
    const href = await firstLink.getAttribute("href");

    await firstLink.click();

    await expect(mobileNav).toBeHidden();
    await expect(page).toHaveURL(new RegExp(`${String(href).replace("#", "#")}$`));
  });
});

test.describe("conversion paths", () => {
  // Decisão de produto (2026-09-19, `PROJECT_SPEC` §4): a página tem um caminho de
  // conversão — todo CTA de caminho leva à seção de oferta (Hero, Módulos,
  // Depoimentos e Rodapé). Só o CTA de dentro da própria oferta fica pendente do
  // canal, e é o único `#` da página.
  test("leads every path CTA to the offer section", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator("a[href='#oferta']")).toHaveCount(4);
    await expect(page.locator("a[href='#']")).toHaveCount(1);
    await expect(page.locator("#oferta a[href='#']")).toHaveCount(1);
  });

  test("scrolls from the hero CTA to the offer", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const cta = page
      .locator("#inicio")
      .getByRole("link", { name: /quero começar agora/i })
      .first();

    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "#oferta");

    await cta.click();

    // O contexto global roda com `reducedMotion: "reduce"`, então o
    // `scroll-behavior: smooth` está desligado e o salto é imediato.
    await expect(page.locator("#oferta")).toBeInViewport();
  });

  test("keeps every external link safe to open", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const unsafe = await page.evaluate(() =>
      Array.from(document.querySelectorAll("a[target='_blank']"))
        .filter((anchor) => !(anchor.getAttribute("rel") ?? "").includes("noopener"))
        .map((anchor) => anchor.getAttribute("href") ?? ""),
    );

    expect(unsafe).toEqual([]);
  });

  // O design do rodapé não tem navegação nem canais de contato: tem aviso legal, CTA,
  // logo e copyright. A via de conversão do rodapé é o CTA — a asserção antiga exigia
  // `tel:`/`mailto:`, que só existiam no rodapé provisório do boilerplate.
  test("exposes the footer call to action and the legal notice", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const footer = page.getByRole("contentinfo");

    await expect(footer.getByRole("link", { name: /QUERO ME TORNAR UM BARBEIRO/ })).toHaveAttribute(
      "href",
      "#oferta",
    );
    await expect(footer.getByText(/Nenhuma informação contida neste produto/)).toBeVisible();
    await expect(footer.getByText(/Todos os direitos reservados/)).toBeVisible();
  });
});
