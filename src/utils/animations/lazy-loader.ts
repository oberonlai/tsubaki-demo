/**
 * Lazy animation loader.
 *
 * Uses IntersectionObserver + dynamic import() to defer loading and running
 * GSAP animations until elements scroll into the viewport.
 * Reduces initial JS parse cost for below-fold animations.
 * SSR-safe — no window access at import time.
 *
 * Usage (inside Astro <script> tag):
 *   import { lazyAnimate, createLazyObserver } from '@codotx/animations/lazy-loader';
 *
 *   document.addEventListener('astro:page-load', () => {
 *     lazyAnimate('.stats-section', async (el) => {
 *       const { gsap } = await import('gsap');
 *       gsap.from(el.querySelectorAll('.stat'), { autoAlpha: 0, y: 30, stagger: 0.1 });
 *     });
 *   });
 */

import type { LazyAnimationOptions } from './types';

/**
 * Observes target elements and runs an animation callback when each enters the viewport.
 * The callback is only invoked once per element by default.
 *
 * @param options - LazyAnimationOptions configuration.
 * @returns Cleanup function that disconnects the observer.
 */
export function createLazyObserver(options: LazyAnimationOptions): () => void {
  const {
    targets,
    onEnter,
    rootMargin = '0px 0px -10% 0px',
    threshold = 0.1,
    once = true,
  } = options;

  const elements = Array.from(document.querySelectorAll(targets));

  if (elements.length === 0) {
    return () => undefined;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        onEnter(entry.target);
        if (once) {
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin, threshold },
  );

  elements.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}

/**
 * Shorthand for creating a lazy-loaded GSAP animation for a set of elements.
 * Dynamically imports GSAP only when the first target enters the viewport.
 *
 * @param targets - CSS selector string for elements to animate.
 * @param callback - Async animation callback receiving the intersecting element.
 * @param rootMargin - IntersectionObserver root margin. Default: "0px 0px -10% 0px".
 * @returns Cleanup function that disconnects the observer.
 */
export function lazyAnimate(
  targets: string,
  callback: (el: Element) => void | Promise<void>,
  rootMargin = '0px 0px -10% 0px',
): () => void {
  return createLazyObserver({
    targets,
    onEnter: (el) => void callback(el),
    rootMargin,
    once: true,
  });
}

/**
 * Batch lazy loader — applies a single animation to all matching elements once
 * the first element enters the viewport.
 * Useful for animating groups (e.g., card grids) together on entry.
 *
 * @param targets - CSS selector string for elements to batch-animate.
 * @param callback - Async animation callback receiving all matched elements.
 * @param rootMargin - IntersectionObserver root margin. Default: "0px 0px -10% 0px".
 * @returns Cleanup function that disconnects the observer.
 */
export function lazyAnimateBatch(
  targets: string,
  callback: (elements: Element[]) => void | Promise<void>,
  rootMargin = '0px 0px -10% 0px',
): () => void {
  const elements = Array.from(document.querySelectorAll(targets));

  if (elements.length === 0) {
    return () => undefined;
  }

  let fired = false;

  const observer = new IntersectionObserver(
    (entries) => {
      const anyVisible = entries.some((e) => e.isIntersecting);
      if (anyVisible && !fired) {
        fired = true;
        void callback(elements);
        observer.disconnect();
      }
    },
    { rootMargin, threshold: 0.1 },
  );

  // Only observe the first element to trigger the batch.
  observer.observe(elements[0]);

  return () => observer.disconnect();
}
