export type Service = {
  id: string;
  name: string;
  desc: string;
  price: number;
  category: "Braids" | "Weaves" | "Natural" | "Locs" | "Other";
  styles?: string[];
};

export const services: Service[] = [
  {
    id: "braids",
    name: "Braids",
    desc: "Knotless, box braids, cornrows and goddess braids — installed with care for long-lasting comfort.",
    price: 35,
    category: "Braids",
    styles: ["Knotless Braids", "Box Braids", "Cornrows", "Goddess Braids", "Fulani Braids"],
  },
  {
    id: "weave",
    name: "Weave Installation",
    desc: "Sew-ins, closures and frontals using premium bundles for a flawless, natural finish.",
    price: 50,
    category: "Weaves",
    styles: ["Sew-In", "Closure Install", "Frontal Install", "Bob Weave"],
  },
  {
    id: "relaxer",
    name: "Relaxer & Style",
    desc: "Gentle relaxer treatment, deep wash and a polished blow-dry or curl finish.",
    price: 25,
    category: "Other",
  },
  {
    id: "natural",
    name: "Natural Wash & Style",
    desc: "Cleanse, condition and style your natural hair — twist outs, braid outs and more.",
    price: 20,
    category: "Natural",
  },
  {
    id: "locs",
    name: "Locs",
    desc: "Starter locs, retwists and styling — built to grow with you.",
    price: 30,
    category: "Locs",
    styles: ["Starter Locs", "Retwist", "Loc Styling", "Loc Repair"],
  },
  {
    id: "trim",
    name: "Trim & Blowdry",
    desc: "Healthy ends start here. Precision trim followed by a smooth silk press.",
    price: 15,
    category: "Other",
  },
];
