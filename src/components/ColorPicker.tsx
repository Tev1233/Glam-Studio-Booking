import { HAIR_COLORS } from "@/lib/colors";

export function ColorPicker({
  value,
  onChange,
  extra,
}: {
  value: string;
  onChange: (name: string) => void;
  extra?: { name: string; hex: string }[];
}) {
  const list = [...HAIR_COLORS, ...(extra ?? [])].filter(
    (c, i, arr) => arr.findIndex((x) => x.name.toLowerCase() === c.name.toLowerCase()) === i,
  );
  return (
    <div className="flex flex-wrap gap-2">
      {list.map((c) => {
        const active = value === c.name;
        return (
          <button
            key={c.name}
            type="button"
            onClick={() => onChange(c.name)}
            className={`flex min-h-[44px] items-center gap-2 rounded-full border px-3 text-xs transition-colors ${
              active ? "border-gold bg-gold/15 text-foreground" : "border-border hover:border-gold/60"
            }`}
            aria-pressed={active}
          >
            <span
              className="h-5 w-5 rounded-full border border-border"
              style={{ background: c.hex }}
              aria-hidden
            />
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
