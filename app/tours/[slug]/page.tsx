import { fetchWordPress } from "@/lib/wordpress";
import type { WordPressTour } from "@/types/wordpress-tour";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getTourBySlug(slug: string): Promise<WordPressTour | null> {
  const tours = await fetchWordPress<WordPressTour[]>(`/tour?slug=${slug}&_embed`);
  return tours[0] ?? null;
}

export default async function TourDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour) {
    return (
      <main className="bg-white text-slate-900">
        <section className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
            Tour not found
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
            We could not find the requested journey.
          </h1>
          <p className="mt-8 text-lg leading-8 text-slate-600">
            Please return to the tours page and choose another experience.
          </p>
          <a
            href="/tours-live"
            className="mt-8 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Back to tours
          </a>
        </section>
      </main>
    );
  }

  const title = tour.acf?.tour_name || tour.title.rendered;
  const description = tour.acf?.tour_desc || "A refined travel experience crafted for discerning explorers.";
  const duration = tour.acf?.tour_duration || "Custom duration";
  const priceFrom = tour.acf?.tour_price_from;
  const image = tour.acf?.tour_featured_image?.url;

  return (
    <main className="bg-white text-slate-900">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
              Signature journey
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
              {title}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/75">
              {description}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/50">Duration</p>
                <p className="mt-2 text-xl font-medium text-white">{duration}</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/50">Price from</p>
                <p className="mt-2 text-xl font-medium text-white">
                  {priceFrom ? `$${priceFrom}` : "Contact us"}
                </p>
              </div>
              <a
                href="/contact"
                className="inline-flex w-full items-center justify-center rounded-full bg-amber-300 px-6 py-3 text-sm font-medium text-slate-950 transition hover:bg-amber-200"
              >
                Request this tour
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Tour overview</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">{description}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-amber-700">Featured image</p>
            {image ? (
              <img
                src={image}
                alt={title}
                className="mt-4 h-[320px] w-full rounded-2xl object-cover"
              />
            ) : (
              <div className="mt-4 flex h-[320px] items-center justify-center rounded-2xl bg-slate-200 text-slate-500">
                No image available
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
