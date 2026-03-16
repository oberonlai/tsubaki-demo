/**
 * Scroll reveal animation utility.
 *
 * Reusable scroll-triggered fade-in / slide-up animations using GSAP ScrollTrigger.
 * SSR-safe — no window access at import time.
 *
 * Usage (inside Astro <script> tag):
 *   import { scrollReveal } from '@codotx/animations/scroll-reveal';
 *
 *   document.addEventListener('astro:page-load', async () => {
 *     await scrollReveal({ targets: '.reveal', y: 40, stagger: 0.15 });
 *   });
 */

import type { ScrollRevealOptions } from './types';

/**
 * Animates elements into view as they scroll into the viewport.
 * Elements start hidden (autoAlpha: 0) and slide up from a Y offset.
 *
 * @param options - Configuration for the scroll reveal animation.
 * @returns Cleanup function that reverts the animation.
 */
export async function scrollReveal(options: ScrollRevealOptions): Promise<() => void> {
  const {
    targets,
    duration = 0.8,
    stagger = 0.1,
    y = 40,
    x = 0,
    start = 'top 85%',
    ease = 'power2.out',
    delay = 0,
  } = options;

  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  const ctx = gsap.context(() => {
    const elements =
      typeof targets === 'string'
        ? gsap.utils.toArray<Element>(targets)
        : Array.isArray(targets)
          ? targets
          : [targets];

    if (elements.length === 0) {
      return;
    }

    // Set initial hidden state using autoAlpha for accessibility.
    gsap.set(elements, { autoAlpha: 0, y, x });

    gsap.to(elements, {
      autoAlpha: 1,
      y: 0,
      x: 0,
      duration,
      stagger,
      ease,
      delay,
      scrollTrigger: {
        trigger: elements[0] as Element,
        start,
      },
    });
  });

  return () => ctx.revert();
}

/**
 * Applies scroll reveal to each target independently with its own ScrollTrigger.
 * Use when elements are far apart on the page and should trigger individually.
 *
 * @param options - Configuration for the scroll reveal animation.
 * @returns Cleanup function that reverts all animations.
 */
export async function scrollRevealEach(options: ScrollRevealOptions): Promise<() => void> {
  const {
    targets,
    duration = 0.8,
    y = 40,
    x = 0,
    start = 'top 85%',
    ease = 'power2.out',
    delay = 0,
  } = options;

  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  const ctx = gsap.context(() => {
    const elements =
      typeof targets === 'string'
        ? gsap.utils.toArray<Element>(targets)
        : Array.isArray(targets)
          ? targets
          : [targets];

    elements.forEach((el) => {
      gsap.set(el, { autoAlpha: 0, y, x });

      gsap.to(el, {
        autoAlpha: 1,
        y: 0,
        x: 0,
        duration,
        ease,
        delay,
        scrollTrigger: {
          trigger: el,
          start,
        },
      });
    });
  });

  return () => ctx.revert();
}
