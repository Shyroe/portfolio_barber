import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, test } from "@playwright/test";

/**
 * Accessibility suite (WCAG 2.1 AA as the floor).
 *
 * Axe is only half of it: an automated scan cannot judge focus order, the
 * quality of an accessible name, or whether motion actually stopped. The
 * behavioural tests below cover those.
 *
 * These tests are page-level and section-agnostic on purpose: they keep passing
 * as the landing page is rebuilt, and they fail the moment a new section
 * introduces a contrast, naming or focus regression. When you add a component
 * with its own states (an accordion, a dialog, a carousel), add a scoped Axe run
 * for those states next to it — the pattern is the `.include(selector)` call.
 */

/** Finishes every running animation so the scan sees a settled page. */
async function settleAnimations(locator: Locator) {
  await locator.evaluateAll((elements) => {
    for (const element of elements) {
      for (const animation of element.getAnimations()) {
        animation.finish();
      }
    }
  });
}

test("has no automatically detectable accessibility violations", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  // Nada nesta página esconde conteúdo atrás de animação, mas o scan roda sobre
  // uma página assentada para que uma transição futura não o torne instável.
  await settleAnimations(page.locator("body *"));
  // A entrada por `IntersectionObserver` deixa as seções abaixo da dobra com
  // `opacity: 0` até serem roladas; o Axe ignora texto transparente, então o
  // scan perderia o contraste dessas seções. Revela tudo antes de medir.
  await page.evaluate(() => {
    for (const el of document.querySelectorAll("[data-reveal]")) {
      el.setAttribute("data-visible", "");
    }
  });

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(results.violations).toEqual([]);
});

test("exposes the expected landmarks and a single h1", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  // No banner: the design has no header, so the landmark set is main +
  // contentinfo. Asserting the absence keeps a header from creeping back in.
  await expect(page.getByRole("banner")).toHaveCount(0);
  await expect(page.getByRole("main")).toHaveCount(1);
  await expect(page.getByRole("contentinfo")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
});

test("keeps heading levels in order", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const levels = await page.evaluate(() =>
    Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6")).map((heading) =>
      Number(heading.tagName.slice(1)),
    ),
  );

  // A jump from h1 to h3 breaks the outline that screen-reader users navigate by.
  let previous = 0;

  for (const level of levels) {
    expect(level, `heading jump from h${previous} to h${level}`).toBeLessThanOrEqual(previous + 1);
    previous = level;
  }
});

test("moves focus to the content with the skip link", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await page.keyboard.press("Tab");

  const skipLink = page.getByRole("link", { name: /pular para o conteúdo/i });

  // The skip link must be the first stop and must become visible when focused:
  // an `sr-only` link that never un-hides is useless to sighted keyboard users.
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();

  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#conteudo-principal$/);
});

test("gives the skip link a real outline on focus", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await page.keyboard.press("Tab");

  const skipLink = page.getByRole("link", { name: /pular para o conteúdo/i });

  await expect(skipLink).toBeFocused();

  // The skip link is a plain anchor (no `outline-none`), so the global
  // `:focus-visible` rule is what has to hold here.
  const outlineStyle = await skipLink.evaluate((element) => getComputedStyle(element).outlineStyle);

  expect(outlineStyle).not.toBe("none");
});

test("gives every interactive element a visible focus indicator", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  // A real key press first: Chrome's `:focus-visible` heuristic only engages for
  // programmatic focus when the last interaction was the keyboard.
  await page.keyboard.press("Tab");

  const links = page.locator("header a, main a, footer a");
  const count = await links.count();

  expect(count).toBeGreaterThan(0);

  for (let index = 0; index < count; index += 1) {
    const link = links.nth(index);

    if (!(await link.isVisible())) {
      continue;
    }

    await link.focus();

    // WCAG 2.4.7 needs a visible indicator, not a specific technique. Buttons in
    // this design system use shadcn's `outline-none` plus a `ring` (box-shadow),
    // while plain links fall back to the global `:focus-visible` outline.
    const indicator = await link.evaluate((element) => {
      const { boxShadow, outlineStyle, outlineWidth } = getComputedStyle(element);

      return { boxShadow, outlineStyle, outlineWidth };
    });

    const hasRing = indicator.boxShadow !== "none" && indicator.boxShadow !== "";
    const hasOutline =
      indicator.outlineStyle !== "none" && Number.parseFloat(indicator.outlineWidth) > 0;

    expect(hasRing || hasOutline, `link ${index} paints no focus indicator`).toBe(true);
  }
});
