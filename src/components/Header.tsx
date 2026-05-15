import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { to: "/" as const, label: "Home" },
  { to: "/services" as const, label: "Services" },
  { to: "/gallery" as const, label: "Gallery" },
  { to: "/shop" as const, label: "Shop" },
  { to: "/products" as const, label: "Products" },
  { to: "/about" as const, label: "About" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="font-display text-2xl text-gold">Glam</span>
          <span className="font-display text-2xl">Studio</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm tracking-wide text-foreground/80 transition-colors hover:text-gold"
              activeProps={{ className: "text-gold" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/book"
            className="inline-flex h-10 items-center justify-center rounded-sm border border-gold bg-gold px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Book Now
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/book"
            className="inline-flex h-10 items-center justify-center rounded-sm bg-gold px-4 text-sm font-medium text-primary-foreground"
          >
            Book
          </Link>
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-border"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="border-b border-border/40 py-3 text-foreground/90"
                activeProps={{ className: "text-gold" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
