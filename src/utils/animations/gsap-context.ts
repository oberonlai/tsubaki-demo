/**
 * SSR-safe gsap.context() wrapper.
 *
 * Handles cleanup automatically on Astro View Transition navigation.
 * Safe to import at module level — no window access until createGsapContext() is called.
 *
 * Usage (inside Astro <script> tag):
 *   import { createGsapContext } from '@codotx/animations/gsap-context';
 *
 *   document.addEventListener('astro:page-load', () => {
 *     const { revert } = createGsapContext(() => {
 *       // All gsap calls here are tracked by the context.
 *       gsap.to('.hero', { autoAlpha: 1, y: 0, duration: 0.8 });
 *     });
 *
 *     document.addEventListener('astro:before-swap', revert, { once: true });
 *   });
 */

import type { GsapContextWrapper } from './types';

/**
 * Creates a gsap.Context that tracks all animations within the factory function.
 * Automatically registers a one-time astro:before-swap cleanup listener unless
 * autoCleanup is set to false.
 *
 * @param factory - Function containing all GSAP calls to be tracked.
 * @param scope - Optional DOM element scope for selector queries.
 * @param autoCleanup - Whether to auto-revert on astro:before-swap. Default: true.
 * @returns Promise resolving to GsapContextWrapper with ctx and revert.
 */
export async function createGsapContext(
  factory: () => void,
  scope?: Element | string | null,
  autoCleanup = true,
): Promise<GsapContextWrapper> {
  const { gsap } = await import('gsap');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctx: any = scope ? gsap.context(factory, scope) : gsap.context(factory);

  const revert = () => ctx.revert();

  if (autoCleanup) {
    document.addEventListener('astro:before-swap', revert, { once: true });
  }

  return { ctx, revert };
}

/**
 * Registers and runs ScrollTrigger animations inside a managed gsap.Context.
 * Automatically imports ScrollTrigger and registers the plugin.
 *
 * @param factory - Function receiving a ScrollTrigger reference for configuration.
 * @param scope - Optional DOM element scope.
 * @param autoCleanup - Whether to auto-revert on astro:before-swap. Default: true.
 * @returns Promise resolving to GsapContextWrapper with ctx and revert.
 */
export async function createScrollContext(
  factory: (scrollTrigger: unknown) => void,
  scope?: Element | string | null,
  autoCleanup = true,
): Promise<GsapContextWrapper> {
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctx: any = scope
    ? gsap.context(() => factory(ScrollTrigger), scope)
    : gsap.context(() => factory(ScrollTrigger));

  const revert = () => ctx.revert();

  if (autoCleanup) {
    document.addEventListener('astro:before-swap', revert, { once: true });
  }

  return { ctx, revert };
}
