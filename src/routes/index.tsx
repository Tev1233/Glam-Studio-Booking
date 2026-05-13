import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { SALON, waLink } from "@/lib/contact";
import { services } from "@/lib/services";
import { gallery } from "@/lib/gallery";
import hero from "@/assets/hero.jpg";
import { Star, MapPin, Phone, Clock } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Glam Studio — Hair Salon in Chinhoyi" },
      { name: "description", content: "Braids, weaves, relaxers, naturals and locs. Book on WhatsApp." },
      { property: "og:title", content: "Glam Studio — Your hair, your crown." },
      { property: "og:description", content: "Luxury hair care in Chinhoyi since 2015." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const reviews = [
  { name: "Tariro M.", text: "I've been coming here for years. My braids always last and the salon feels like home.", rating: 5 },
  { name: "Chiedza N.", text: "Best weave install in Chinhoyi, hands down. The team is gentle and so professional.", rating: 5 },
  { name: "Rumbi S.", text: "Booking through WhatsApp is so easy and they always start on time. Love my locs!", rating: 5 },
];

function Home() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={hero} alt="" width={1280} height={1600} className="h-full w-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>
        <div className="relative mx-auto flex min-h-[80vh] max-w-6xl flex-col items-start justify-center px-4 py-24">
          <span className="mb-4 text-xs uppercase tracking-[0.3em] text-gold">Chinhoyi · Zimbabwe</span>
          <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
            Your hair,
            <br />
            <span className="italic text-gold">your crown.</span>
          </h1>
          <p className="mt-6 max-w-md text-base text-foreground/80">
            A neighbourhood salon for braids, weaves, naturals and locs — crafted with patience and quality products.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/book"
              className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-sm bg-gold px-6 text-sm font-medium tracking-wide text-primary-foreground"
            >
              Book Now
            </Link>
            <a
              href={waLink("Hi Glam Studio!")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-sm border border-gold/60 px-6 text-sm font-medium text-gold"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-gold">About</span>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">A salon built on care</h2>
        <div className="gold-divider mx-auto my-6 w-24" />
        <p className="text-foreground/80">
          Glam Studio has been serving the women of Chinhoyi since 2015. We specialise in braids, weaves, relaxers and natural
          hair — using quality products and giving every client the time and care they deserve.
        </p>
      </section>

      {/* SERVICES */}
      <section className="bg-card/40 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-gold">What we do</span>
              <h2 className="mt-2 font-display text-4xl">Services</h2>
            </div>
            <Link to="/services" className="hidden text-sm text-gold underline-offset-4 hover:underline sm:inline">
              View all →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.id}
                to="/book"
                search={{ service: s.id }}
                className="group rounded-md border border-border/60 bg-background/40 p-6 transition-colors hover:border-gold"
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-2xl">{s.name}</h3>
                  <span className="text-sm text-gold">from ${s.price}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-8 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">Looks</span>
          <h2 className="mt-2 font-display text-4xl">Recent work</h2>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
          {gallery.slice(0, 6).map((g) => (
            <Link
              key={g.label}
              to="/gallery"
              className="group relative block aspect-[3/4] overflow-hidden rounded-sm bg-card"
            >
              <img src={g.src} alt={g.label} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-3">
                <p className="text-xs text-cream">{g.label}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link to="/gallery" className="text-sm text-gold underline-offset-4 hover:underline">
            See full gallery →
          </Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-card/40 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-gold">Loved by clients</span>
            <h2 className="mt-2 font-display text-4xl">Kind words</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.name} className="rounded-md border border-border/60 bg-background/40 p-6">
                <div className="flex gap-1 text-gold">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-3 italic text-foreground/85">"{r.text}"</p>
                <p className="mt-4 text-sm text-muted-foreground">— {r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">Visit us</span>
          <h2 className="mt-2 font-display text-4xl">Come say hi</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-5 rounded-md border border-border/60 bg-card/40 p-6">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 text-gold" size={18} />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-sm text-muted-foreground">{SALON.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-1 text-gold" size={18} />
              <div>
                <p className="font-medium">Phone</p>
                <a href={`tel:${SALON.phone}`} className="text-sm text-muted-foreground">{SALON.phone}</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-1 text-gold" size={18} />
              <div>
                <p className="font-medium">Hours</p>
                <p className="text-sm text-muted-foreground">{SALON.hoursShort}</p>
              </div>
            </div>
            <a
              href={waLink("Hi Glam Studio, I'd like to book.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 w-full items-center justify-center rounded-sm bg-gold text-sm font-medium text-primary-foreground"
            >
              Chat on WhatsApp
            </a>
          </div>
          <div className="aspect-square overflow-hidden rounded-md border border-border/60 bg-card md:aspect-auto">
            <iframe
              title="Map to Glam Studio"
              className="h-full min-h-[280px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=Chinhoyi+Zimbabwe&output=embed"
            />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
