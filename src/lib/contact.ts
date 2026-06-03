export const SALON = {
  name: "Glam Studio",
  tagline: "Your hair, your crown.",
  phone: "0772223930",
  whatsapp: "263772223930",
  address: "Grey Building, Chinhoyi, Zimbabwe",
  hoursShort: "Mon–Sat 8AM–6PM · Sunday Closed",
  hours: [
    { d: "Monday – Friday", t: "8:00 AM – 6:00 PM" },
    { d: "Saturday", t: "8:00 AM – 6:00 PM" },
    { d: "Sunday", t: "Closed" },
  ],
  googleBusiness: "https://www.google.com/maps/search/?api=1&query=Glam+Studio+Chinhoyi",
};

export const waLink = (text?: string) =>
  `https://wa.me/${SALON.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
