/**
 * Shared type definitions for GSAP animation utilities.
 * All utilities are SSR-safe — no window access at import time.
 */

export interface ScrollRevealOptions {
  /** Target selector or element(s). */
  targets: string | Element | Element[];
  /** Animation duration in seconds. Default: 0.8. */
  duration?: number;
  /** Stagger delay between elements in seconds. Default: 0.1. */
  stagger?: number;
  /** Y offset to animate from in pixels. Default: 40. */
  y?: number;
  /** X offset to animate from in pixels. Default: 0. */
  x?: number;
  /** ScrollTrigger start position. Default: "top 85%". */
  start?: string;
  /** Easing function. Default: "power2.out". */
  ease?: string;
  /** Delay before animation starts in seconds. Default: 0. */
  delay?: number;
}

export interface TextSplitOptions {
  /** Target selector or element(s). */
  targets: string | Element | Element[];
  /** Split type: "chars", "words", or "lines". Default: "words". */
  type?: 'chars' | 'words' | 'lines';
  /** Animation duration per element in seconds. Default: 0.6. */
  duration?: number;
  /** Stagger delay between split elements in seconds. Default: 0.03. */
  stagger?: number;
  /** Y offset to animate from in pixels. Default: 20. */
  y?: number;
  /** Easing function. Default: "power2.out". */
  ease?: string;
  /** Delay before animation starts in seconds. Default: 0. */
  delay?: number;
}

export interface NumberCounterOptions {
  /** Target selector or element(s) containing a numeric value. */
  targets: string | Element | Element[];
  /** Duration of count animation in seconds. Default: 2. */
  duration?: number;
  /** Start value override. Defaults to 0. */
  from?: number;
  /** Rounding function. Default: Math.round. */
  round?: (n: number) => number;
  /** Optional suffix appended after number (e.g. "%", "+"). */
  suffix?: string;
  /** Optional prefix prepended before number (e.g. "$"). */
  prefix?: string;
  /** Easing function. Default: "power1.inOut". */
  ease?: string;
  /** ScrollTrigger start position. Default: "top 85%". */
  start?: string;
}

export interface LazyAnimationOptions {
  /** Target selector(s) for elements to observe. */
  targets: string;
  /** Callback invoked when element enters viewport. */
  onEnter: (el: Element) => void;
  /** IntersectionObserver root margin. Default: "0px 0px -10% 0px". */
  rootMargin?: string;
  /** IntersectionObserver threshold. Default: 0.1. */
  threshold?: number;
  /** Whether to unobserve after first intersection. Default: true. */
  once?: boolean;
}

export interface GsapContextWrapper {
  /** The gsap.Context instance (typed as unknown to avoid peer dependency at import time). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctx: any;
  /** Reverts all animations and cleans up. */
  revert: () => void;
}
