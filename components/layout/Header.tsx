const navigation = [
  { href: "/", label: "Home" },
  { href: "/tours", label: "Tours" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a href="/" className="text-lg font-semibold tracking-[0.18em] text-white uppercase">
          LuxTrip
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium tracking-[0.08em] text-white/75 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="/contact"
          className="inline-flex items-center rounded-full border border-amber-300/70 px-5 py-2 text-sm font-medium text-amber-200 transition hover:bg-amber-300 hover:text-slate-950"
        >
          Plan your journey
        </a>
      </div>
    </header>
  );
}
