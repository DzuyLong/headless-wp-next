'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getMaxScrollY() {
  const doc = document.documentElement;
  return Math.max(0, doc.scrollHeight - window.innerHeight);
}

function normalizeDeltaY(event: WheelEvent) {
  if (event.deltaMode === 1) return event.deltaY * 16; // lines -> px-ish
  if (event.deltaMode === 2) return event.deltaY * window.innerHeight; // pages -> px-ish
  return event.deltaY;
}

function isScrollable(element: HTMLElement) {
  const style = window.getComputedStyle(element);
  const overflowY = style.overflowY;
  if (overflowY !== 'auto' && overflowY !== 'scroll') return false;
  return element.scrollHeight > element.clientHeight + 1;
}

function canScrollInDirection(element: HTMLElement, deltaY: number) {
  if (deltaY > 0) {
    return element.scrollTop + element.clientHeight < element.scrollHeight - 1;
  }

  if (deltaY < 0) {
    return element.scrollTop > 0;
  }

  return false;
}

function hasScrollableAncestor(target: EventTarget | null, deltaY: number) {
  let node = target instanceof HTMLElement ? target : null;

  while (node && node !== document.body) {
    if (isScrollable(node) && canScrollInDirection(node, deltaY)) return true;
    node = node.parentElement;
  }

  return false;
}

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    let tween: { kill?: () => void } | null = null;
    let isTweening = false;

    let targetY = window.scrollY;
    const proxy = { y: targetY };

    const setup = () => {
      const syncFromWindow = () => {
        if (isTweening) return;
        targetY = window.scrollY;
        proxy.y = targetY;
      };

      const scrollToProxy = () => {
        window.scrollTo(0, proxy.y);
        ScrollTrigger.update();
      };

      const animateToTarget = () => {
        tween?.kill?.();
        isTweening = true;
        tween = gsap.to(proxy, {
          y: targetY,
          duration: 0.75,
          ease: 'power3.out',
          overwrite: true,
          onUpdate: scrollToProxy,
          onComplete: () => {
            isTweening = false;
            syncFromWindow();
          },
        }) as { kill?: () => void };
      };

      const onWheel = (event: WheelEvent) => {
        if (event.defaultPrevented) return;
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        if (document.body?.dataset?.lightboxOpen === '1') return;

        const deltaY = normalizeDeltaY(event);
        if (deltaY === 0) return;

        if (hasScrollableAncestor(event.target, deltaY)) return;

        const maxScrollY = getMaxScrollY();
        const nextTarget = clamp(targetY + deltaY, 0, maxScrollY);
        if (nextTarget === targetY) return;

        event.preventDefault();
        targetY = nextTarget;
        animateToTarget();
      };

      const onScroll = () => syncFromWindow();
      const onResize = () => {
        targetY = clamp(targetY, 0, getMaxScrollY());
        proxy.y = clamp(proxy.y, 0, getMaxScrollY());
        ScrollTrigger.refresh();
      };

      window.addEventListener('wheel', onWheel, { passive: false });
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize, { passive: true });

      return () => {
        window.removeEventListener('wheel', onWheel as EventListener);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        tween?.kill?.();
      };
    };

    const teardown = setup();

    return () => {
      teardown();
    };
  }, []);

  return <>{children}</>;
}
