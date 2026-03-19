export async function loadGsap() {
  if (typeof window === 'undefined') return null;
  const { gsap } = await import('gsap');
  return gsap;
}

export async function loadGsapWithScrollTrigger() {
  if (typeof window === 'undefined') return null;
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}

function splitTextNodes(nodes: HTMLElement[]) {
  const cleanups: Array<() => void> = [];

  nodes.forEach((node) => {
    if (node.dataset.splitReady === 'true') return;
    const text = node.textContent?.trim();
    if (!text) return;

    node.dataset.splitReady = 'true';
    node.dataset.originalText = text;
    const words = text.split(/\s+/);
    node.innerHTML = words
      .map(
        (word) =>
          `<span class="split-word"><span class="split-word__inner">${word}</span></span>`,
      )
      .join(' ');

    cleanups.push(() => {
      const original = node.dataset.originalText;
      if (!original) return;
      node.textContent = original;
      delete node.dataset.splitReady;
      delete node.dataset.originalText;
    });
  });

  return cleanups;
}

/** Staggers reveals with slight variance for organic feel. */
function revealDelay(index: number): number {
  return (index % 4) * 0.07;
}

export async function initTsubakiMotion(root: ParentNode = document) {
  const loaded = await loadGsapWithScrollTrigger();
  if (!loaded || typeof window === 'undefined') {
    return () => {};
  }

  const { gsap, ScrollTrigger } = loaded;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const reveals = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
  const splitNodes = Array.from(root.querySelectorAll<HTMLElement>('[data-split]'));
  const parallaxNodes = Array.from(root.querySelectorAll<HTMLElement>('[data-parallax]'));
  const driftNodes = Array.from(root.querySelectorAll<HTMLElement>('[data-drift]'));
  const marqueeTracks = Array.from(root.querySelectorAll<HTMLElement>('[data-marquee-track]'));
  const faqRoots = Array.from(root.querySelectorAll<HTMLElement>('[data-faq-root]'));
  /* Overdrive targets. */
  const springCards = Array.from(root.querySelectorAll<HTMLElement>('[data-spring]'));
  const magnetNodes = Array.from(root.querySelectorAll<HTMLElement>('[data-magnet]'));
  const counterNodes = Array.from(root.querySelectorAll<HTMLElement>('[data-counter]'));
  const scaleRevealNodes = Array.from(root.querySelectorAll<HTMLElement>('[data-scale-reveal]'));

  const contexts: Array<{ revert?: () => void }> = [];
  const splitCleanups = splitTextNodes(splitNodes);

  /* Note: reduceMotion check disabled for demo/preview purposes.
     End users can re-enable by uncommenting the block below. */
  // if (reduceMotion) {
  //   [...reveals, ...splitNodes].forEach((node) => {
  //     node.style.opacity = '1';
  //     node.style.transform = 'none';
  //   });
  //   parallaxNodes.forEach((node) => { node.style.transform = 'none'; });
  //   return () => { splitCleanups.forEach((cleanup) => cleanup()); };
  // }

  /* === Scroll reveals — spring-inspired ease. === */
  if (reveals.length > 0) {

    const ctx = gsap.context(() => {
      reveals.forEach((node, index) => {
        const yOffset = node.dataset.revealY ? Number(node.dataset.revealY) : 36;
        gsap.fromTo(
          node,
          { autoAlpha: 0, y: yOffset },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.05,
            delay: revealDelay(index),
            ease: 'power4.out',
            scrollTrigger: {
              trigger: node,
              start: 'top 84%',
              once: true,
            },
          },
        );
      });
    }, root as Element);
    contexts.push(ctx);
  }

  /* === Split text entrance — word stagger with rotation. === */
  if (splitNodes.length > 0) {
    const ctx = gsap.context(() => {
      splitNodes.forEach((node) => {
        const letters = node.querySelectorAll<HTMLElement>('.split-word__inner');
        gsap.set(node, { autoAlpha: 1 });
        gsap.fromTo(
          letters,
          { autoAlpha: 0, yPercent: 110, rotate: 1.8, skewX: 2 },
          {
            autoAlpha: 1,
            yPercent: 0,
            rotate: 0,
            skewX: 0,
            duration: 1.15,
            stagger: 0.055,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: node,
              start: 'top 87%',
              once: true,
            },
          },
        );
      });
    }, root as Element);
    contexts.push(ctx);
  }

  /* === Parallax — scrub depth from data-parallax attribute. === */
  if (parallaxNodes.length > 0) {
    const ctx = gsap.context(() => {
      parallaxNodes.forEach((node) => {
        const depth = Number(node.dataset.parallax ?? '50');
        gsap.fromTo(node,
          { y: -depth },
          {
            y: depth,
            ease: 'none',
            scrollTrigger: {
              trigger: node,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.9,
            },
          },
        );
      });
    }, root as Element);
    contexts.push(ctx);
  }

  /* === Drift (ambient float animation). === */
  if (driftNodes.length > 0) {
    const ctx = gsap.context(() => {
      driftNodes.forEach((node, index) => {
        gsap.to(node, {
          y: index % 2 === 0 ? -10 : 10,
          x: index % 2 === 0 ? 7 : -7,
          duration: 4.5 + index * 0.6,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });
    }, root as Element);
    contexts.push(ctx);
  }

  /* === Marquee scroll band. === */
  marqueeTracks.forEach((track) => {
    const speed = Number(track.dataset.marqueeSpeed ?? '22');
    const dir = track.dataset.marqueeDir === 'rtl' ? 1 : -1;
    const tween = gsap.to(track, {
      xPercent: dir * 22,
      duration: speed,
      ease: 'none',
      repeat: -1,
      yoyo: true,
    });
    contexts.push({ revert: () => tween.kill() });
  });

  /* === FAQ accordion. === */
  faqRoots.forEach((rootNode) => {
    rootNode.querySelectorAll<HTMLElement>('[data-faq-panel]').forEach((panel) => {
      panel.hidden = true;
      gsap.set(panel, { height: 0, autoAlpha: 0 });
    });

    rootNode.querySelectorAll<HTMLButtonElement>('[data-faq-trigger]').forEach((button) => {
      if (button.dataset.motionReady === 'true') return;
      button.dataset.motionReady = 'true';
      button.addEventListener('click', () => {
        const panel = button.parentElement?.querySelector<HTMLElement>('[data-faq-panel]');
        if (!panel) return;
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!expanded));
        gsap.killTweensOf(panel);

        if (!expanded) {
          panel.hidden = false;
          gsap.fromTo(
            panel,
            { height: 0, autoAlpha: 0 },
            { height: 'auto', autoAlpha: 1, duration: 0.5, ease: 'power3.out' },
          );
        } else {
          gsap.to(panel, {
            height: 0,
            autoAlpha: 0,
            duration: 0.35,
            ease: 'power2.inOut',
            onComplete: () => { panel.hidden = true; },
          });
        }
      });
    });
  });

  /* === OVERDRIVE: Spring card 3D tilt on hover. === */
  if (springCards.length > 0) {
    springCards.forEach((card) => {
      const onEnter = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const xRel = (e.clientX - rect.left) / rect.width - 0.5;
        const yRel = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          rotateX: -yRel * 7,
          rotateY: xRel * 7,
          scale: 1.024,
          duration: 0.55,
          ease: 'power2.out',
          transformPerspective: 900,
          transformOrigin: 'center center',
        });
      };
      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const xRel = (e.clientX - rect.left) / rect.width - 0.5;
        const yRel = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          rotateX: -yRel * 8,
          rotateY: xRel * 8,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      };
      const onLeave = () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.65,
          ease: 'elastic.out(1, 0.55)',
        });
      };
      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      contexts.push({
        revert: () => {
          card.removeEventListener('mouseenter', onEnter);
          card.removeEventListener('mousemove', onMove);
          card.removeEventListener('mouseleave', onLeave);
        },
      });
    });
  }

  /* === OVERDRIVE: Magnetic button pull. === */
  if (magnetNodes.length > 0) {
    magnetNodes.forEach((el) => {
      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const xRel = (e.clientX - (rect.left + rect.width / 2)) * 0.3;
        const yRel = (e.clientY - (rect.top + rect.height / 2)) * 0.3;
        gsap.to(el, { x: xRel, y: yRel, duration: 0.4, ease: 'power2.out' });
      };
      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
      };
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      contexts.push({
        revert: () => {
          el.removeEventListener('mousemove', onMove);
          el.removeEventListener('mouseleave', onLeave);
        },
      });
    });
  }

  /* === OVERDRIVE: Counter number animation. === */
  if (counterNodes.length > 0) {
    const ctx = gsap.context(() => {
      counterNodes.forEach((node) => {
        const target = Number(node.dataset.counter ?? '0');
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => { node.textContent = Math.round(obj.val).toLocaleString(); },
          scrollTrigger: {
            trigger: node,
            start: 'top 85%',
            once: true,
          },
        });
      });
    }, root as Element);
    contexts.push(ctx);
  }

  /* === OVERDRIVE: Iris clip-path scale reveal. === */
  if (scaleRevealNodes.length > 0) {
    const ctx = gsap.context(() => {
      scaleRevealNodes.forEach((node, index) => {
        gsap.fromTo(
          node,
          { clipPath: 'inset(6% 6% 6% 6%)', autoAlpha: 0, scale: 1.06 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            autoAlpha: 1,
            scale: 1,
            duration: 1.2,
            delay: index * 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: node,
              start: 'top 82%',
              once: true,
            },
          },
        );
      });
    }, root as Element);
    contexts.push(ctx);
  }

  ScrollTrigger.refresh();

  return () => {
    contexts.forEach((ctx) => ctx.revert?.());
    splitCleanups.forEach((cleanup) => cleanup());
  };
}
