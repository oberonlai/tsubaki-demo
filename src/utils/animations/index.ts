/**
 * @codotx/animations
 *
 * Shared GSAP animation utility library for Codotx Astro themes.
 *
 * All utilities are:
 *   - SSR-safe (no window access at import time)
 *   - GSAP-peer-dependency aware (gsap is never bundled)
 *   - Compatible with Astro native <script> tags and View Transitions
 *   - Using autoAlpha instead of opacity for accessibility
 *
 * Quick start — add to any Astro <script> tag:
 *
 *   import { scrollReveal, animateCounters } from '@codotx/animations';
 *
 *   document.addEventListener('astro:page-load', async () => {
 *     await scrollReveal({ targets: '.reveal' });
 *     await animateCounters({ targets: '.stat-number' });
 *   });
 *
 * Available modules (also importable individually for code-splitting):
 *
 *   @codotx/animations/scroll-reveal     — ScrollTrigger fade-in / slide-up
 *   @codotx/animations/text-split        — SplitText character/word/line reveals
 *   @codotx/animations/page-transitions  — Astro View Transitions wrappers
 *   @codotx/animations/gsap-context      — SSR-safe context factory helpers
 *   @codotx/animations/lazy-loader       — IntersectionObserver + dynamic import
 *   @codotx/animations/number-counter    — Animated stat counter
 */

export { scrollReveal, scrollRevealEach } from './scroll-reveal';
export { splitReveal, lineReveal } from './text-split';
export { initPageTransitions, onPageLoad } from './page-transitions';
export { createGsapContext, createScrollContext } from './gsap-context';
export { createLazyObserver, lazyAnimate, lazyAnimateBatch } from './lazy-loader';
export { animateCounters } from './number-counter';

export type {
  ScrollRevealOptions,
  TextSplitOptions,
  NumberCounterOptions,
  LazyAnimationOptions,
  GsapContextWrapper,
} from './types';
