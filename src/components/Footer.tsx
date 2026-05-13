import { Link } from "@tanstack/react-router";
import { SALON, waLink } from "@/lib/contact";
import { Instagram, Facebook, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-card/40 pb-24 pt-12 md:pb-12">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-3">
        <div>
          <div className="font-display text-2xl">
            <span className="text-gold">Glam</span> Studio
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{SALON.tagline}</p>
          <p className="mt-4 text-sm text-muted-foreground">Serving Chinhoyi since 2015.</p>
        </div>

        <div className="text-sm">
          <h4 className="mb-3 font-display text-lg text-gold">Visit</h4>
          <p className="flex items-start gap-2 text-muted-foreground">
            <MapPin size={16} className="mt-1 shrink-0" />
            <span>{SALON.address}</span>
          </p>
          <p className="mt-2 flex items-center gap-2 text-muted-foreground">
            <Phone size={16} />
            <a href={`tel:${SALON.phone}`}>{SALON.phone}</a>
          </p>
          <a
            href={SALON.googleBusiness}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-gold underline-offset-4 hover:underline"
          >
            Find us on Google
          </a>
        </div>

        <div className="text-sm">
          <h4 className="mb-3 font-display text-lg text-gold">Hours</h4>
          <ul className="space-y-1 text-muted-foreground">
            {SALON.hours.map((h) => (
              <li key={h.d} className="flex justify-between gap-4">
                <span>{h.d}</span>
                <span>{h.t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex gap-3">
            <a href={waLink("Hi Glam Studio!")} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="rounded-full border border-border p-2 hover:border-gold hover:text-gold">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20.52 3.48A11.86 11.86 0 0012.05 0C5.5 0 .2 5.3.2 11.86a11.79 11.79 0 001.6 5.94L0 24l6.36-1.66a11.86 11.86 0 005.69 1.45h.01c6.55 0 11.85-5.3 11.85-11.86a11.79 11.79 0 00-3.39-8.45zM12.06 21.5a9.62 9.62 0 01-4.9-1.34l-.35-.21-3.78.99 1.01-3.69-.23-.38a9.6 9.6 0 0114.7-12.16 9.5 9.5 0 012.81 6.79c0 5.31-4.32 9.62-9.66 9.62z"/></svg>
            </a>
            <a href="#" aria-label="Instagram" className="rounded-full border border-border p-2 hover:border-gold hover:text-gold"><Instagram size={18} /></a>
            <a href="#" aria-label="Facebook" className="rounded-full border border-border p-2 hover:border-gold hover:text-gold"><Facebook size={18} /></a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {SALON.name}. <Link to="/book" className="text-gold">Book your appointment</Link>.
      </div>
    </footer>
  );
}
