import { fetchWordPress } from "@/lib/wordpress";

type WordPressPost = {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
};

async function getTours(): Promise<WordPressPost[]> {
  return fetchWordPress<WordPressPost[]>("/posts?_embed&per_page=9");
}

export default async function ToursConnectedPage() {
  const tours = await getTours();

  return (
    <main className="bg-white text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
            WordPress connected tours
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Tours loaded from your WordPress backend.
          </h1>
          <p className="text-lg leading-8 text-slate-600">
            This page fetches data from the WordPress REST API configured in your environment.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tours.map((tour) => (
            <article
              key={tour.id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
            >
              <p className="text-sm uppercase tracking-[0.2em] text-amber-700">
                {tour.slug}
              </p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                {tour.title.rendered}
              </h2>
              <div
                className="mt-4 text-sm leading-7 text-slate-600"
                dangerouslySetInnerHTML={{ __html: tour.excerpt.rendered }}
              />
              <a
                href={`/tours/${tour.slug}`}
                className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                View journey
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
