/**
 * Text split animation utility.
 *
 * Character / word / line split reveals for headings.
 * Uses GSAP SplitText (now free as of April 2025 post-Webflow acquisition).
 * Falls back to word-by-word wrapping if SplitText is unavailable.
 * SSR-safe — no window access at import time.
 *
 * Usage (inside Astro <script> tag):
 *   import { splitReveal } from '@codotx/animations/text-split';
 *
 *   document.addEventListener('astro:page-load', async () => {
 *     await splitReveal({ targets: 'h1, h2', type: 'words' });
 *   });
 */

import type { TextSplitOptions } from './types';

/** Wraps each word in a span manually for fallback splitting. */
function splitWordsManual(el: Element): Element[] {
  const text = el.textContent ?? '';
  el.textContent = '';
  return text.split(/\s+/).map((word) => {
    const span = document.createElement('span');
    span.style.display = 'inline-block';
    span.style.overflow = 'hidden';
    span.textContent = word + '\u00a0';
    el.appendChild(span);
    return span;
  });
}

/** Wraps each character in a span manually for fallback splitting. */
function splitCharsManual(el: Element): Element[] {
  const text = el.textContent ?? '';
  el.textContent = '';
  return [...text].map((char) => {
    const span = document.createElement('span');
    span.style.display = 'inline-block';
    span.textContent = char === ' ' ? '\u00a0' : char;
    el.appendChild(span);
    return span;
  });
}

/**
 * Reveals text by animating split characters, words, or lines into view.
 * Attempts to use GSAP SplitText plugin first; falls back to manual DOM splitting.
 *
 * @param options - Configuration for the text split animation.
 * @returns Cleanup function that reverts animation and restores original text.
 */
export async function splitReveal(options: TextSplitOptions): Promise<() => void> {
  const {
    targets,
    type = 'words',
    duration = 0.6,
    stagger = 0.03,
    y = 20,
    ease = 'power2.out',
    delay = 0,
  } = options;

  const { gsap } = await import('gsap');

  const cleanups: (() => void)[] = [];

  const ctx = gsap.context(async () => {
    const elements =
      typeof targets === 'string'
        ? gsap.utils.toArray<Element>(targets)
        : Array.isArray(targets)
          ? targets
          : [targets];

    if (elements.length === 0) {
      return;
    }

    // Attempt to use GSAP SplitText if available.
    let splitInstances: Array<{ revert: () => void; chars: Element[]; words: Element[]; lines: Element[] } | null> = [];

    try {
      const { SplitText } = await import('gsap/SplitText');
      gsap.registerPlugin(SplitText);

      splitInstances = elements.map((el) => {
        const split = new SplitText(el, { type });
        return split as unknown as { revert: () => void; chars: Element[]; words: Element[]; lines: Element[] };
      });

      const splitTargets = splitInstances.flatMap((s) => {
        if (s === null) {
          return [];
        }
        if (type === 'chars') {
          return s.chars;
        }
        if (type === 'lines') {
          return s.lines;
        }
        return s.words;
      });

      gsap.set(splitTargets, { autoAlpha: 0, y });
      gsap.to(splitTargets, { autoAlpha: 1, y: 0, duration, stagger, ease, delay });

      cleanups.push(() => splitInstances.forEach((s) => s && s.revert()));
    } catch {
      // SplitText not available; fall back to manual DOM splitting.
      const allSplitEls: Element[] = [];
      const originalContents: Array<{ el: Element; html: string }> = [];

      elements.forEach((el) => {
        const htmlElement = el as HTMLElement;
        originalContents.push({ el, html: htmlElement.innerHTML });

        const parts = type === 'chars' ? splitCharsManual(el) : splitWordsManual(el);
        allSplitEls.push(...parts);
      });

      gsap.set(allSplitEls, { autoAlpha: 0, y });
      gsap.to(allSplitEls, { autoAlpha: 1, y: 0, duration, stagger, ease, delay });

      cleanups.push(() => {
        originalContents.forEach(({ el, html }) => {
          (el as HTMLElement).innerHTML = html;
        });
      });
    }
  });

  return () => {
    ctx.revert();
    cleanups.forEach((fn) => fn());
  };
}

/**
 * Reveals heading lines one at a time with a clip-path effect.
 * Ideal for bold hero headings.
 *
 * @param options - Configuration (type is forced to "lines").
 * @returns Cleanup function.
 */
export async function lineReveal(
  options: Omit<TextSplitOptions, 'type'>,
): Promise<() => void> {
  return splitReveal({ ...options, type: 'lines', y: options.y ?? 30, stagger: options.stagger ?? 0.08 });
}
