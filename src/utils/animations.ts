/**
 * GSAP animation helpers for Tsubaki Astro components.
 * All functions guard against SSR (no window).
 */

/** Dynamically import GSAP core. */
export async function loadGsap() {
  if (typeof window === 'undefined') return null;
  const { gsap } = await import('gsap');
  return gsap;
}

/** Dynamically import GSAP + ScrollTrigger. */
export async function loadGsapWithScrollTrigger() {
  if (typeof window === 'undefined') return null;
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}
