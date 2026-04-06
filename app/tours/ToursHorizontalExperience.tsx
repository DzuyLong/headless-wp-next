'use client';

import { useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { TourItem } from '@/lib/api/tour';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type ToursHorizontalExperienceProps = {
  tours: TourItem[];
};

type GalleryRows = {
  top: string[];
  bottom: string[];
};

function buildGalleryRows(tour: TourItem): GalleryRows {
  const images = tour.gallery.filter(Boolean);
  const fallback = tour.featuredImage ? [tour.featuredImage] : [];
  const source = (images.length ? images : fallback).slice(0, 12);

  const top = source.filter((_, index) => index % 2 === 0);
  const bottomRaw = source.filter((_, index) => index % 2 === 1);
  const bottom = bottomRaw.length ? bottomRaw : top;

  // Duplicate so rows are long enough to scroll.
  return { top: [...top, ...top], bottom: [...bottom, ...bottom] };
}

function buildTourSlides(tour: TourItem) {
  const gallery = tour.gallery.slice(0, 2);
  const images = [tour.featuredImage, ...gallery].filter(Boolean);

  if (images.length === 0) {
    return [{ src: '', caption: tour.name }];
  }

  return images.map((src, index) => ({
    src,
    caption: index === 0 ? `${tour.name} · Featured` : `${tour.name} · Gallery ${index}`,
  }));
}

export default function ToursHorizontalExperience({ tours }: ToursHorizontalExperienceProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const refreshRafRef = useRef<number | null>(null);

  const scheduleRefresh = () => {
    if (typeof window === 'undefined') return;
    if (refreshRafRef.current !== null) return;

    refreshRafRef.current = window.requestAnimationFrame(() => {
      refreshRafRef.current = null;
      ScrollTrigger.refresh();
    });
  };

  const tourSections = useMemo(
    () =>
      tours.map((tour) => ({
        ...tour,
        slides: buildTourSlides(tour),
        galleryRows: buildGalleryRows(tour),
      })),
    [tours]
  );

  useEffect(() => {
    let isMounted = true;
    let cleanup: (() => void) | undefined;

    const setupAnimation = () => {
      if (!wrapperRef.current) return;

      if (!isMounted) return;

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
              gsap.set(rowBottom, {
                x: -galleryDistanceBottom,
              });
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

      cleanup = () => {
        refreshHandlers.forEach((dispose) => dispose());
        context.revert();
      };
    };

    setupAnimation();

    return () => {
      isMounted = false;
      if (refreshRafRef.current !== null) {
        window.cancelAnimationFrame(refreshRafRef.current);
        refreshRafRef.current = null;
      }
      cleanup?.();
    };
  }, [tourSections]);

  if (tourSections.length === 0) {
    return <p className="px-8 py-16 text-center text-lg">Không có tour nào.</p>;
  }

  return (
    <div ref={wrapperRef} className="bg-[#04020d] text-white">
      {tourSections.map((tour, index) => (
        <section key={tour.id} className="tour-horizontal-section relative h-screen overflow-hidden border-b border-white/10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(128,90,213,0.35),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.25),transparent_55%)]" />

          <div className="tour-horizontal-track flex h-full w-[300vw]">
            <article data-panel="1" className="tour-horizontal-panel relative flex h-full w-screen flex-col justify-end p-8 md:p-16">
              {tour.slides[0]?.src ? (
                <Image
                  src={tour.slides[0].src}
                  alt={tour.name}
                  fill
                  unoptimized
                  className="object-cover opacity-55"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
              <div className="relative z-10 max-w-3xl space-y-4">
                <p className="inline-block rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-cyan-100">
                  Tour #{String(index + 1).padStart(2, '0')}
                </p>
                <h2 className="text-4xl font-semibold md:text-6xl">{tour.name}</h2>
                <p className="max-w-xl text-base text-white/85 md:text-lg">{tour.desc || 'Trải nghiệm hành trình đặc sắc với timeline dựng theo nhịp cuộn của người dùng.'}</p>
              </div>

              <div className="relative z-10 mt-8 w-full max-w-3xl overflow-hidden rounded-3xl border border-white/15 bg-black/30 p-4 backdrop-blur">
                <div className="text-xs uppercase tracking-[0.22em] text-white/60">Gallery</div>

                <div className="mt-4 space-y-3">
                  <div data-gallery-viewport="top" className="overflow-hidden">
                    <div data-gallery-row="top" className="flex w-max items-center gap-3">
                      {tour.galleryRows.top.map((src, imgIndex) => (
                        <div
                          key={`top-${tour.id}-${imgIndex}-${src}`}
                          className="relative h-20 w-32 overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:h-24 sm:w-40"
                        >
                          <Image
                            src={src}
                            alt={`${tour.name} gallery ${imgIndex + 1}`}
                            fill
                            unoptimized
                            className="object-cover"
                            onLoadingComplete={scheduleRefresh}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div data-gallery-viewport="bottom" className="overflow-hidden">
                    <div data-gallery-row="bottom" className="flex w-max items-center gap-3">
                      {tour.galleryRows.bottom.map((src, imgIndex) => (
                        <div
                          key={`bottom-${tour.id}-${imgIndex}-${src}`}
                          className="relative h-20 w-32 overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:h-24 sm:w-40"
                        >
                          <Image
                            src={src}
                            alt={`${tour.name} gallery ${imgIndex + 1}`}
                            fill
                            unoptimized
                            className="object-cover"
                            onLoadingComplete={scheduleRefresh}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <article className="tour-horizontal-panel flex h-full w-screen flex-col justify-center gap-8 bg-black/70 p-8 md:p-16">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/20 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">Thời lượng</p>
                  <p className="mt-2 text-2xl font-medium">{tour.duration || 'Cập nhật'}</p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">Giá từ</p>
                  <p className="mt-2 text-2xl font-medium">
                    {tour.priceFrom !== null ? `${tour.priceFrom.toLocaleString('vi-VN')}đ` : 'Liên hệ'}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">Điểm nhấn</p>
                  <p className="mt-2 text-2xl font-medium">{tour.slides.length} cảnh</p>
                </div>
              </div>

              <p className="max-w-2xl text-white/80">
                Mỗi section được pin và kéo ngang bằng GSAP ScrollTrigger. Khi người dùng cuộn xuống, nội dung của riêng tour này sẽ chạy theo trục X trước khi chuyển sang tour kế tiếp.
              </p>

              <div>
                <Link
                  href={`/tours/${tour.slug}`}
                  className="inline-flex items-center rounded-full border border-cyan-200/50 bg-cyan-400/10 px-6 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/20"
                >
                  Xem chi tiết tour
                </Link>
              </div>
            </article>

            <article className="tour-horizontal-panel relative flex h-full w-screen items-center justify-center bg-[#090218] p-8 md:p-16">
              <div className="grid w-full max-w-5xl gap-6 md:grid-cols-2">
                {tour.slides.slice(0, 2).map((slide) => (
                  <figure key={slide.caption} className="group relative h-[32vh] min-h-[260px] overflow-hidden rounded-3xl border border-white/20">
                    {slide.src ? (
                      <Image
                        src={slide.src}
                        alt={slide.caption}
                        fill
                        unoptimized
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-700/70 to-cyan-600/70" />
                    )}
                    <figcaption className="absolute inset-x-4 bottom-4 rounded-full border border-white/20 bg-black/50 px-4 py-2 text-sm backdrop-blur">
                      {slide.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </article>
          </div>
        </section>
      ))}
    </div>
  );
}
