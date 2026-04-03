export function HomeLanding() {
  return (
    <main className="bg-white text-slate-950">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-8 lg:py-36">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
            Luxury journeys
          </p>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
            Extraordinary tours for refined travelers.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/70">
            Discover bespoke experiences crafted with elegance, privacy, and unforgettable destinations.
          </p>
          <div className="mt-10 flex gap-4">
            <a href="/tours" className="rounded-full bg-amber-300 px-6 py-3 font-medium text-slate-950">
              Explore tours
            </a>
            <a href="/contact" className="rounded-full border border-white/20 px-6 py-3 font-medium text-white">
              Speak with concierge
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 p-8">
            <h3 className="text-xl font-semibold">Private itineraries</h3>
            <p className="mt-4 text-slate-600">Tailor-made journeys curated for your lifestyle.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 p-8">
            <h3 className="text-xl font-semibold">Luxury stays</h3>
            <p className="mt-4 text-slate-600">Premium hotels, villas, and exclusive experiences.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 p-8">
            <h3 className="text-xl font-semibold">24/7 concierge</h3>
            <p className="mt-4 text-slate-600">Dedicated support from planning to return.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
