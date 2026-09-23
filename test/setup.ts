/**
 * jsdom polyfills.
 *
 * O carrossel de depoimentos usa o `Carousel` do shadcn (embla 8.6), e o embla lê
 * `ResizeObserver`, `IntersectionObserver` e `matchMedia` durante o init — o
 * `ResizeHandler`, o `SlidesInView` e o breakpoint de slides por vez. Nenhuma das
 * três APIs existe no jsdom: sem elas o render da página inteira estoura com
 * `ReferenceError` e todos os testes de contrato caem juntos.
 *
 * O stub do `IntersectionObserver` chama o callback com `isIntersecting: true`
 * num macrotask, e **não** dentro do `observe()`: o callback do embla emite o
 * evento `slidesInView`, que durante a construção do engine ainda não tem handler
 * registrado.
 */

if (typeof window !== "undefined") {
  if (!window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => false,
      }),
    });
  }

  if (!("ResizeObserver" in window)) {
    class ResizeObserverStub implements ResizeObserver {
      observe() {
        return undefined;
      }

      unobserve() {
        return undefined;
      }

      disconnect() {
        return undefined;
      }
    }

    Object.defineProperty(window, "ResizeObserver", {
      writable: true,
      value: ResizeObserverStub,
    });
  }

  if (!("IntersectionObserver" in window)) {
    class IntersectionObserverStub implements IntersectionObserver {
      readonly root = null;
      readonly rootMargin = "0px";
      readonly thresholds: readonly number[] = [];
      private readonly callback: IntersectionObserverCallback;
      private disconnected = false;

      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
      }

      observe(target: Element) {
        window.setTimeout(() => {
          if (this.disconnected) {
            return;
          }

          this.callback(
            [
              {
                boundingClientRect: target.getBoundingClientRect(),
                intersectionRatio: 1,
                intersectionRect: target.getBoundingClientRect(),
                isIntersecting: true,
                rootBounds: null,
                target,
                time: 0,
              },
            ],
            this,
          );
        }, 0);
      }

      unobserve() {
        return undefined;
      }

      disconnect() {
        this.disconnected = true;
      }

      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
    }

    Object.defineProperty(window, "IntersectionObserver", {
      writable: true,
      value: IntersectionObserverStub,
    });
  }
}
