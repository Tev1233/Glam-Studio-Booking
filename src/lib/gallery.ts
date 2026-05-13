import braids from "@/assets/braids.jpg";
import braids2 from "@/assets/braids2.jpg";
import weave from "@/assets/weave.jpg";
import weave2 from "@/assets/weave2.jpg";
import natural from "@/assets/natural.jpg";
import natural2 from "@/assets/natural2.jpg";
import locs from "@/assets/locs.jpg";

export type GalleryItem = {
  src: string;
  label: string;
  category: "Braids" | "Weaves" | "Natural" | "Locs";
  serviceId: string;
};

export const gallery: GalleryItem[] = [
  { src: braids, label: "Knotless Braids", category: "Braids", serviceId: "braids" },
  { src: weave, label: "Silky Sew-In", category: "Weaves", serviceId: "weave" },
  { src: natural, label: "Big Natural Afro", category: "Natural", serviceId: "natural" },
  { src: locs, label: "Styled Locs", category: "Locs", serviceId: "locs" },
  { src: braids2, label: "Goddess Braids", category: "Braids", serviceId: "braids" },
  { src: weave2, label: "Bob Weave", category: "Weaves", serviceId: "weave" },
  { src: natural2, label: "Defined Twist Out", category: "Natural", serviceId: "natural" },
];
