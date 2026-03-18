---
title: "Implementing Scroll Animations with GSAP"
titleEn: "Implementing Scroll Animations with GSAP"
description: "How to add beautiful scroll-reveal animations to your Astro blog using GSAP ScrollTrigger."
date: 2026-03-10
tags: ["GSAP", "Animation", "Development"]
draft: false
---

## GSAP and ScrollTrigger

GSAP (GreenSock Animation Platform) is the industry-standard library for web animations.

The Tsubaki theme uses the following animation patterns:

## Scroll Reveal

Article cards and headings fade in and slide up as they enter the viewport on scroll.

```javascript
import { loadGsapWithScrollTrigger } from '../utils/animations';

const { gsap, ScrollTrigger } = await loadGsapWithScrollTrigger();

gsap.fromTo(
  '[data-reveal]',
  { opacity: 0, y: 24 },
  {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '[data-reveal]',
      start: 'top 88%',
    },
  },
);
```

## Hero Animation

Hero elements animate immediately on page load, without delay:

```javascript
gsap.fromTo(
  '.hero__title-ja, .hero__title-en, .hero__lead',
  { opacity: 0, y: 30 },
  {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out',
    delay: 0.4,
  },
);
```

## Performance Considerations

- Check `typeof window === 'undefined'` in SSR environments
- GSAP is lazy-loaded via dynamic imports
- A native `IntersectionObserver` fallback is also provided

```typescript
export async function loadGsap() {
  if (typeof window === 'undefined') return null;
  const { gsap } = await import('gsap');
  return gsap;
}
```

This ensures that basic content remains visible even when JavaScript is disabled.
