const sampleTours = [
  {
    name: "Majestic Alps Escape",
    destination: "Switzerland",
    duration: "7 days / 6 nights",
    price: "From $4,800",
  },
  {
    name: "Santorini Private Retreat",
    destination: "Greece",
    duration: "5 days / 4 nights",
    price: "From $3,600",
  },
  {
    name: "Kyoto Heritage Journey",
    destination: "Japan",
    duration: "6 days / 5 nights",
    price: "From $4,200",
  },
];

export default function ToursPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
            Curated journeys
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Signature tours designed for refined travel.
          </h1>
          <p className="text-lg leading-8 text-slate-600">
            This page is ready for WordPress data. For now, it showcases the visual
            structure for premium tour listings.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sampleTours.map((tour) => (
            <article
              key={tour.name}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
            >
              <p className="text-sm uppercase tracking-[0.2em] text-amber-700">
                {tour.destination}
              </p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                {tour.name}
              </h2>
              <p className="mt-4 text-sm text-slate-500">{tour.duration}</p>
              <p className="mt-2 text-base font-medium text-slate-900">{tour.price}</p>
              <a
                href="/contact"
                className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Request this journey
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
