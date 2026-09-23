import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The design ships its own type scale (`--text-*` in `src/styles/globals.css`:
 * `text-body-15`, `text-display-35`, `text-cta-21`, …). tailwind-merge cannot
 * tell a token like `text-cta-21` from a text **colour**, so it left the
 * competing `text-sm` from the primitive's base classes in place and the default
 * won — the hero CTA rendered at 14px instead of the design's 21px.
 *
 * Teaching it the naming convention is what makes `className` overrides work on
 * top of the shadcn primitives. A validator (rather than a list) keeps this in
 * sync with the tokens by construction.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [(value: string) => /^(body|display|price|cta)-\d+$/.test(value)],
        },
      ],
    },
  },
});

/**
 * Merges conditional class names and resolves conflicting Tailwind utilities,
 * so a `className` prop can always override a component default.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
