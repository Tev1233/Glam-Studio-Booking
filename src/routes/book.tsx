import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { services } from "@/lib/services";
import { SALON, waLink } from "@/lib/contact";
import { useMemo, useState, useEffect } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

type Search = { service?: string; style?: string };

export const Route = createFileRoute("/book")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    service: typeof s.service === "string" ? s.service : undefined,
    style: typeof s.style === "string" ? s.style : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Book an Appointment — Glam Studio" },
      { name: "description", content: "Book your hair appointment in Chinhoyi via WhatsApp in 4 quick steps." },
      { property: "og:title", content: "Book — Glam Studio" },
      { property: "og:description", content: "Pick a service, date and time. Confirm by WhatsApp." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Glam Studio" },
      { property: "og:url", content: "/book" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Book — Glam Studio" },
      { name: "twitter:description", content: "Pick a service, date and time. Confirm by WhatsApp." },
    ],
    links: [{ rel: "canonical", href: "/book" }],
  }),
  component: BookPage,
});

const TIME_SLOTS = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

function todayISO() {
  const d = new Date();
  d.setDate(d.getDate());
  return d.toISOString().slice(0, 10);
}

function BookPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceId, setServiceId] = useState<string>(search.service ?? "");
  const [style, setStyle] = useState<string>(search.style ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (search.service && !serviceId) setServiceId(search.service);
    if (search.style && !style) setStyle(search.style);
    if (search.service || search.style) setStep(2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const service = useMemo(() => services.find((s) => s.id === serviceId), [serviceId]);
  const needsStyle = !!service?.styles?.length;

  const validate = (): boolean => {
    setError("");
    if (step === 1) {
      if (!name.trim()) return setError("Please enter your name."), false;
      if (!phone.trim()) return setError("Please enter your WhatsApp number."), false;
    }
    if (step === 2) {
      if (!serviceId) return setError("Please choose a service."), false;
      if (needsStyle && !style) return setError("Please choose a style."), false;
    }
    if (step === 3) {
      if (!date) return setError("Please pick a date."), false;
      const day = new Date(date + "T00:00").getDay();
      if (day === 0) return setError("We're closed on Sundays — please pick another day."), false;
      if (!time) return setError("Please pick a time."), false;
    }
    return true;
  };

  const next = () => {
    if (!validate()) return;
    setStep((s) => Math.min(4, s + 1));
  };
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const message = useMemo(() => {
    const lines = [
      `*New Booking — ${SALON.name}*`,
      ``,
      `*Name:* ${name}`,
      `*Phone:* ${phone}`,
      `*Service:* ${service?.name ?? ""}`,
    ];
    if (style) lines.push(`*Style:* ${style}`);
    lines.push(`*Date:* ${date}`);
    lines.push(`*Time:* ${time}`);
    if (notes) lines.push(`*Notes:* ${notes}`);
    return lines.join("\n");
  }, [name, phone, service, style, date, time, notes]);

  const confirm = () => {
    window.open(waLink(message), "_blank");
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-2xl px-4 pb-12 pt-16 text-center">
        <span className="text-xs uppercase tracking-[0.3em] text-gold">Appointment</span>
        <h1 className="mt-3 font-display text-5xl">Book Your Visit</h1>
        <div className="gold-divider mx-auto my-6 w-24" />
      </section>

      <section className="mx-auto max-w-2xl px-4 pb-24">
        {/* Steps indicator */}
        <ol className="mb-8 flex items-center justify-between">
          {[1, 2, 3, 4].map((n) => (
            <li key={n} className="flex flex-1 items-center">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm ${
                  step >= n ? "border-gold bg-gold text-primary-foreground" : "border-border text-muted-foreground"
                }`}
              >
                {step > n ? <Check size={16} /> : n}
              </div>
              {n < 4 && <div className={`mx-2 h-px flex-1 ${step > n ? "bg-gold" : "bg-border"}`} />}
            </li>
          ))}
        </ol>

        <div className="rounded-md border border-border/60 bg-card/40 p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl">Your details</h2>
              <label className="block text-sm">
                Full name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 h-12 w-full rounded-sm border border-border bg-background px-3 text-base outline-none focus:border-gold"
                  placeholder="Tariro Moyo"
                />
              </label>
              <label className="block text-sm">
                WhatsApp number
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  className="mt-1 h-12 w-full rounded-sm border border-border bg-background px-3 text-base outline-none focus:border-gold"
                  placeholder="+263 77 123 4567"
                />
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-display text-2xl">Choose a service</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setServiceId(s.id);
                      setStyle("");
                    }}
                    className={`min-h-[80px] rounded-sm border p-4 text-left transition-colors ${
                      serviceId === s.id ? "border-gold bg-gold/10" : "border-border hover:border-gold/60"
                    }`}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="font-display text-lg">{s.name}</span>
                      <span className="text-xs text-gold">${s.price}+</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{s.desc}</p>
                  </button>
                ))}
              </div>

              {needsStyle && (
                <div>
                  <h3 className="mb-2 mt-2 font-display text-xl">Pick a style</h3>
                  <div className="flex flex-wrap gap-2">
                    {service!.styles!.map((st) => (
                      <button
                        key={st}
                        onClick={() => setStyle(st)}
                        className={`min-h-[44px] rounded-full border px-4 text-sm transition-colors ${
                          style === st ? "border-gold bg-gold text-primary-foreground" : "border-border hover:border-gold/60"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-display text-2xl">Date & time</h2>
              <label className="block text-sm">
                Date (no Sundays)
                <input
                  type="date"
                  min={todayISO()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 h-12 w-full rounded-sm border border-border bg-background px-3 text-base outline-none focus:border-gold"
                />
              </label>
              <div>
                <p className="mb-2 text-sm">Time slot</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {TIME_SLOTS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTime(t)}
                      className={`min-h-[44px] rounded-sm border text-xs transition-colors ${
                        time === t ? "border-gold bg-gold text-primary-foreground" : "border-border hover:border-gold/60"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <label className="block text-sm">
                Notes (optional)
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-sm border border-border bg-background p-3 text-base outline-none focus:border-gold"
                  placeholder="Hair length, colour, anything we should know…"
                />
              </label>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl">Review & confirm</h2>
              <dl className="divide-y divide-border/60 rounded-sm border border-border/60">
                {[
                  ["Name", name],
                  ["Phone", phone],
                  ["Service", service?.name],
                  ...(style ? [["Style", style]] : []),
                  ["Date", date],
                  ["Time", time],
                  ...(notes ? [["Notes", notes]] : []),
                ].map(([k, v]) => (
                  <div key={k as string} className="flex justify-between gap-4 px-4 py-3 text-sm">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="text-right font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-xs text-muted-foreground">
                Tapping confirm opens WhatsApp with your details ready to send.
              </p>
              <button
                onClick={confirm}
                className="inline-flex h-12 w-full items-center justify-center rounded-sm bg-gold text-sm font-medium text-primary-foreground"
              >
                Confirm via WhatsApp
              </button>
            </div>
          )}

          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

          {step < 4 && (
            <div className="mt-6 flex justify-between">
              <button
                onClick={prev}
                disabled={step === 1}
                className="inline-flex h-11 items-center gap-1 rounded-sm border border-border px-4 text-sm disabled:opacity-40"
              >
                <ChevronLeft size={16} /> Back
              </button>
              <button
                onClick={next}
                className="inline-flex h-11 items-center gap-1 rounded-sm bg-gold px-5 text-sm font-medium text-primary-foreground"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
          {step === 4 && (
            <div className="mt-6">
              <button
                onClick={prev}
                className="inline-flex h-11 items-center gap-1 rounded-sm border border-border px-4 text-sm"
              >
                <ChevronLeft size={16} /> Edit
              </button>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Prefer a quick chat?{" "}
          <button
            onClick={() => navigate({ to: "/" })}
            className="text-gold underline-offset-4 hover:underline"
          >
            WhatsApp us directly →
          </button>
        </p>
      </section>
    </SiteLayout>
  );
}
