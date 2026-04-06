'use client';

import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function useToursHorizontalScroll(
  wrapperRef: React.RefObject<HTMLElement | null>,
  deps: unknown[]
) {
  const refreshRafRef = useRef<number | null>(null);

  const scheduleRefresh = useMemo(() => {
    return () => {
      if (typeof window === 'undefined') return;
      if (refreshRafRef.current !== null) return;

      refreshRafRef.current = window.requestAnimationFrame(() => {
        refreshRafRef.current = null;
        ScrollTrigger.refresh();
      });
    };
  }, []);

  useEffect(() => {
    if (!wrapperRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const refreshHandlers: Array<() => void> = [];
    const context = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('.tour-horizontal-section');

      sections.forEach((section: HTMLElement) => {
        const track = section.querySelector<HTMLElement>('.tour-horizontal-track');
        if (!track) return;

        const panel1 = section.querySelector<HTMLElement>('[data-panel="1"]');
        const viewportTop =
          panel1?.querySelector<HTMLElement>('[data-gallery-viewport="top"]') || null;
        const viewportBottom =
          panel1?.querySelector<HTMLElement>('[data-gallery-viewport="bottom"]') || null;
        const rowTop =
          panel1?.querySelector<HTMLElement>('[data-gallery-row="top"]') || null;
        const rowBottom =
          panel1?.querySelector<HTMLElement>('[data-gallery-row="bottom"]') || null;

        const getGalleryDistance = (viewport: HTMLElement, row: HTMLElement) =>
          Math.max(0, row.scrollWidth - viewport.clientWidth);

        let timeline: gsap.core.Timeline | null = null;

        const build = () => {
          timeline?.scrollTrigger?.kill();
          timeline?.kill();

          gsap.set(track, { x: 0, xPercent: 0 });

          const horizontalDistance = Math.max(0, track.scrollWidth - section.offsetWidth);
          const galleryDistanceTop =
            viewportTop && rowTop ? getGalleryDistance(viewportTop, rowTop) : 0;
          const galleryDistanceBottom =
            viewportBottom && rowBottom ? getGalleryDistance(viewportBottom, rowBottom) : 0;
          const galleryDistance = Math.max(galleryDistanceTop, galleryDistanceBottom);

          if (rowBottom && viewportBottom) {
            gsap.set(rowBottom, { x: -galleryDistanceBottom });
          }

          const galleryDuration = galleryDistance;
          const horizontalDuration = horizontalDistance;

          timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => {
                const gTop =
                  viewportTop && rowTop ? getGalleryDistance(viewportTop, rowTop) : 0;
                const gBottom =
                  viewportBottom && rowBottom
                    ? getGalleryDistance(viewportBottom, rowBottom)
                    : 0;
                const g = Math.max(gTop, gBottom);
                const h = Math.max(0, track.scrollWidth - section.offsetWidth);
                return `+=${g + h}`;
              },
              scrub: 0.9,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          if (viewportTop && rowTop && viewportBottom && rowBottom && galleryDistance > 0) {
            timeline.to(rowTop, { x: -galleryDistanceTop, duration: galleryDuration }, 0);
            timeline.to(rowBottom, { x: 0, duration: galleryDuration }, 0);
          }

          if (horizontalDistance > 0) {
            timeline.to(
              track,
              { x: -horizontalDistance, duration: horizontalDuration },
              galleryDuration
            );
          }
        };

        build();
        ScrollTrigger.addEventListener('refreshInit', build);
        refreshHandlers.push(() => ScrollTrigger.removeEventListener('refreshInit', build));
      });

      ScrollTrigger.refresh();
    }, wrapperRef.current);

    return () => {
      refreshHandlers.forEach((dispose) => dispose());
      context.revert();
      if (refreshRafRef.current !== null) {
        window.cancelAnimationFrame(refreshRafRef.current);
        refreshRafRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { scheduleRefresh };
}

