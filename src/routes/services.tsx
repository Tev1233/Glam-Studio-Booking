import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { services } from "@/lib/services";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Pricing — Glam Studio" },
      { name: "description", content: "Braids, weaves, relaxers, natural hair and locs. Prices in USD." },
      { property: "og:title", content: "Services & Pricing — Glam Studio" },
      { property: "og:description", content: "Full menu of hair services in Chinhoyi." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Glam Studio" },
      { property: "og:url", content: "/services" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Services & Pricing — Glam Studio" },
      { name: "twitter:description", content: "Full menu of hair services in Chinhoyi." },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 pb-12 pt-16 text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-gold">The Menu</span>
        <h1 className="mt-3 font-display text-5xl">Services & Pricing</h1>
        <div className="gold-divider mx-auto my-6 w-24" />
        <p className="text-foreground/80">
          All prices in USD. Final pricing depends on hair length and density — we'll confirm before we start.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16">
        <ul className="divide-y divide-border/60 rounded-md border border-border/60 bg-card/40">
          {services.map((s) => (
            <li key={s.id} className="p-6">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-display text-2xl md:text-3xl">{s.name}</h2>
                <div className="flex items-baseline gap-2 whitespace-nowrap">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">from</span>
                  <span className="font-display text-2xl text-gold">${s.price}</span>
                </div>
              </div>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{s.desc}</p>
              {s.styles && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {s.styles.map((st) => (
                    <span key={st} className="rounded-full border border-border/70 px-3 py-1 text-xs text-foreground/80">
                      {st}
                    </span>
                  ))}
                </div>
              )}
              <Link
                to="/book"
                search={{ service: s.id }}
                className="mt-4 inline-flex h-11 items-center justify-center rounded-sm border border-gold px-5 text-sm font-medium text-gold hover:bg-gold hover:text-primary-foreground"
              >
                Book {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </SiteLayout>
  );
}
