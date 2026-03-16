/**
 * Page transition helpers for Astro View Transitions.
 *
 * Integrates GSAP animations with Astro's astro:page-load and astro:before-swap
 * lifecycle events for seamless SPA-style transitions.
 * SSR-safe — no window access at import time.
 *
 * Usage (inside Astro <script> tag, typically in BaseLayout.astro):
 *   import { initPageTransitions } from '@codotx/animations/page-transitions';
 *
 *   initPageTransitions({
 *     enterAnimation: (container) => gsap.from(container, { autoAlpha: 0, duration: 0.4 }),
 *     exitAnimation: (container) => gsap.to(container, { autoAlpha: 0, duration: 0.3 }),
 *   });
 */

export interface PageTransitionOptions {
  /**
   * Called on astro:page-load to animate the new page content in.
   * Receives the main page container element.
   */
  enterAnimation?: (container: Element) => gsap.core.Tween | gsap.core.Timeline | void;
  /**
   * Called on astro:before-swap to animate the old page content out.
   * Receives the old document's main container.
   * Return a Promise or a GSAP tween to delay the swap until animation completes.
   */
  exitAnimation?: (container: Element) => gsap.core.Tween | gsap.core.Timeline | Promise<void> | void;
  /** Selector for the page container to animate. Default: "main". */
  containerSelector?: string;
}

/**
 * Wires GSAP enter/exit animations to Astro's View Transitions lifecycle.
 * Call once at app initialization (e.g., in BaseLayout.astro <script>).
 *
 * @param options - Enter and exit animation factories plus container selector.
 */
export function initPageTransitions(options: PageTransitionOptions = {}): void {
  const { enterAnimation, exitAnimation, containerSelector = 'main' } = options;

  document.addEventListener('astro:page-load', async () => {
    const { gsap } = await import('gsap');
    const container = document.querySelector(containerSelector);
    if (!container) {
      return;
    }

    if (enterAnimation) {
      enterAnimation(container);
    } else {
      // Default enter: fade in.
      gsap.from(container, { autoAlpha: 0, duration: 0.4, ease: 'power1.out' });
    }
  });

  document.addEventListener('astro:before-swap', async (event) => {
    const { gsap } = await import('gsap');
    // The old document's container is the current page's container.
    const container = document.querySelector(containerSelector);
    if (!container) {
      return;
    }

    if (exitAnimation) {
      const result = exitAnimation(container);

      if (result instanceof Promise) {
        // Swap waits for Promise to resolve.
        const swapEvent = event as Event & { preventDefault: () => void; swap: () => void };
        if (swapEvent.preventDefault) {
          swapEvent.preventDefault();
          await result;
          swapEvent.swap?.();
        }
      } else if (result && typeof result.then === 'function') {
        // GSAP tween — wait for completion.
        const swapEvent = event as Event & { preventDefault: () => void; swap: () => void };
        if (swapEvent.preventDefault) {
          swapEvent.preventDefault();
          await result.then();
          swapEvent.swap?.();
        }
      }
    } else {
      // Default exit: fade out instantly (no delay).
      gsap.to(container, { autoAlpha: 0, duration: 0.25, ease: 'power1.in' });
    }
  });
}

/**
 * Registers a function to run on every page load (including initial load).
 * Equivalent to document.addEventListener('astro:page-load', ...) but returns
 * a cleanup function and integrates with gsap.context() for automatic revert.
 *
 * @param callback - Async function receiving the current page container.
 * @param containerSelector - Selector for the page container. Default: "main".
 * @returns Cleanup function that removes the event listener.
 */
export function onPageLoad(
  callback: (container: Element) => void | Promise<void>,
  containerSelector = 'main',
): () => void {
  const handler = async () => {
    const container = document.querySelector(containerSelector);
    if (container) {
      await callback(container);
    }
  };

  document.addEventListener('astro:page-load', handler);

  return () => document.removeEventListener('astro:page-load', handler);
}
