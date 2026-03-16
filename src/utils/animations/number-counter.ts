/**
 * Number counter animation utility.
 *
 * Animates numeric stat counters from zero (or a custom start value) to a target
 * number when the element scrolls into view.
 * SSR-safe — no window access at import time.
 *
 * Usage (inside Astro <script> tag):
 *   import { animateCounters } from '@codotx/animations/number-counter';
 *
 *   document.addEventListener('astro:page-load', async () => {
 *     await animateCounters({ targets: '.stat-number', duration: 2, suffix: '+' });
 *   });
 *
 * HTML example:
 *   <span class="stat-number" data-count="1500" data-prefix="$" data-suffix="k+">$1,500k+</span>
 */

import type { NumberCounterOptions } from './types';

/**
 * Reads the target numeric value from an element.
 * Checks data-count attribute first, then parses the text content.
 */
function readTargetValue(el: Element): number {
  const dataCount = (el as HTMLElement).dataset.count;
  if (dataCount !== undefined) {
    return parseFloat(dataCount);
  }
  const text = el.textContent ?? '0';
  // Strip non-numeric characters (commas, $, %, etc.) for parsing.
  const numeric = text.replace(/[^\d.-]/g, '');
  return parseFloat(numeric) || 0;
}

/**
 * Animates numeric counters from a start value to the target value.
 * Triggers each counter individually when it enters the viewport.
 *
 * Reads optional per-element overrides from data attributes:
 *   - data-count="1500"   — target value (overrides text content)
 *   - data-prefix="$"     — prefix string (overrides options.prefix)
 *   - data-suffix="k+"    — suffix string (overrides options.suffix)
 *
 * @param options - NumberCounterOptions configuration.
 * @returns Cleanup function that disconnects observers and reverts animations.
 */
export async function animateCounters(options: NumberCounterOptions): Promise<() => void> {
  const {
    targets,
    duration = 2,
    from = 0,
    round = Math.round,
    suffix = '',
    prefix = '',
    ease = 'power1.inOut',
    start = 'top 85%',
  } = options;

  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  const elements =
    typeof targets === 'string'
      ? Array.from(document.querySelectorAll<HTMLElement>(targets))
      : Array.isArray(targets)
        ? (targets as HTMLElement[])
        : [targets as HTMLElement];

  const observers: (() => void)[] = [];

  elements.forEach((el) => {
    const target = readTargetValue(el);
    const elPrefix = el.dataset.prefix ?? prefix;
    const elSuffix = el.dataset.suffix ?? suffix;

    // Set initial display value.
    el.textContent = `${elPrefix}${round(from)}${elSuffix}`;

    const counter = { value: from };

    gsap.to(counter, {
      value: target,
      duration,
      ease,
      scrollTrigger: {
        trigger: el,
        start,
        once: true,
      },
      onUpdate() {
        el.textContent = `${elPrefix}${round(counter.value).toLocaleString()}${elSuffix}`;
      },
      onComplete() {
        // Ensure exact final value is displayed.
        el.textContent = `${elPrefix}${round(target).toLocaleString()}${elSuffix}`;
      },
    });
  });

  return () => {
    observers.forEach((fn) => fn());
    ScrollTrigger.getAll().forEach((st) => {
      if (elements.some((el) => st.trigger === el)) {
        st.kill();
      }
    });
  };
}
