/**
 * Tsubaki theme — page-level animation initialiser.
 *
 * Exports a single initAnimations() function that wires GSAP animations
 * for every page in the theme.  Call this once from BaseLayout.astro.
 *
 * All GSAP imports are dynamic to ensure SSR safety.
 */

/** Sets up subtle fade + slide-up page entrance via Astro View Transitions. */
export async function initAnimations(): Promise<void> {
  const { initPageTransitions } = await import('@utils/animations');
  const { gsap } = await import('gsap');

  initPageTransitions({
    containerSelector: 'main',
    enterAnimation: (container: Element) => {
      return gsap.from(container, {
        autoAlpha: 0,
        y: 8,
        duration: 0.35,
        ease: 'power1.out',
        clearProps: 'all',
      });
    },
  });
}
