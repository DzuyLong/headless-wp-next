'use client';

import { useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { TourItem } from '@/lib/api/tour';

type ToursHorizontalExperienceProps = {
  tours: TourItem[];
};

type GSAPCore = {
  registerPlugin: (...plugins: unknown[]) => void;
  utils: { toArray: <T = Element>(selector: string) => T[] };
  context: (
    callback: () => void,
    scope?: Element | string | null
  ) => { revert: () => void };
  fromTo: (target: unknown, fromVars: Record<string, unknown>, toVars: Record<string, unknown>) => unknown;
  set: (target: unknown, vars: Record<string, unknown>) => unknown;
};

type ScrollTriggerCore = {
  refresh: () => void;
};

declare global {
  interface Window {
    gsap?: GSAPCore;
    ScrollTrigger?: unknown;
  }
}

const GSAP_CDN = 'https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js';
const SCROLL_TRIGGER_CDN =
  'https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/ScrollTrigger.min.js';

function loadExternalScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
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

  const tourSections = useMemo(
    () =>
      tours.map((tour) => ({
        ...tour,
        slides: buildTourSlides(tour),
      })),
    [tours]
  );

  useEffect(() => {
    let isMounted = true;
    let cleanup: (() => void) | undefined;

    const setupAnimation = async () => {
      if (!wrapperRef.current) return;

      await loadExternalScript(GSAP_CDN);
      await loadExternalScript(SCROLL_TRIGGER_CDN);

      if (!isMounted || !window.gsap || !window.ScrollTrigger) return;

      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger as ScrollTriggerCore;

      gsap.registerPlugin(window.ScrollTrigger);

      const context = gsap.context(() => {
        const sections = gsap.utils.toArray<HTMLElement>('.tour-horizontal-section');

        sections.forEach((section) => {
          const track = section.querySelector<HTMLElement>('.tour-horizontal-track');
          if (!track) return;

          const panels = track.querySelectorAll('.tour-horizontal-panel').length;
          const distance = (panels - 1) * 100;

          gsap.set(track, { xPercent: 0 });

          gsap.fromTo(
            track,
            { xPercent: 0 },
            {
              xPercent: -distance,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: `+=${Math.max(1600, panels * 700)}`,
                scrub: 0.9,
                pin: true,
                anticipatePin: 1,
              },
            }
          );
        });

        ScrollTrigger.refresh();
      }, wrapperRef.current);

      cleanup = () => context.revert();
    };

    setupAnimation();

    return () => {
      isMounted = false;
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
            <article className="tour-horizontal-panel relative flex h-full w-screen flex-col justify-end p-8 md:p-16">
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
