// ---------------------------------------------------------------------------
// Business configuration — safe to edit. All contact details, coordinates and
// in-home travel-fee zones live here so they can be updated without touching
// the components.
// ---------------------------------------------------------------------------

export const business = {
  name: "Luxe Health Massage",
  tagline: "Medical • Wellness • Wellbeing",
  owner: "Khun Roong",
  // Bookings go to WhatsApp first, with email as a fallback.
  whatsapp: "66656435455", // +66 65 643 5455 (booking line)
  whatsappDisplay: "+66 65 643 5455",
  phone: "66805200559", // +66 80 520 0559
  phoneDisplay: "+66 80 520 0559",
  email: "bhisanu_777@hotmail.com",
  instagram: "https://www.instagram.com/luxehealthmassage",
  instagramHandle: "@luxehealthmassage",
  facebook: "https://www.facebook.com/profile.php?id=100063518832626",
  addressLines: [
    "2/6 Moo 5, Bang Por, Mae Nam",
    "Koh Samui, Surat Thani 84330",
    "Thailand",
  ],
  // Luxe Health Massage's own Google Maps pin (not Green Coconut Village).
  location: { lat: 9.5790986, lng: 99.9584161 },
  googleMapsUrl: "https://maps.app.goo.gl/eGqUfcNj4wJiQQ6v9",
  hours: "Open daily · 10:00 – 22:00",
  currency: "฿",
  rating: 5,
  experienceYears: 20,
} as const;

export const whatsappLink = (message: string) =>
  `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;

export const mapsLink =
  "https://www.google.com/maps/search/?api=1&query=" +
  `${business.location.lat},${business.location.lng}`;

// In-home (outcall) travel-fee tiers, by straight-line distance from the shop.
// Prices are indicative — confirm with the owner. Editable here.
export interface TravelZone {
  maxKm: number;
  fee: number;
  label: string;
}

export const travelZones: TravelZone[] = [
  { maxKm: 4, fee: 0, label: "Bang Por & Mae Nam" },
  { maxKm: 8, fee: 150, label: "Bophut & Fisherman's Village" },
  { maxKm: 14, fee: 300, label: "Chaweng, Choeng Mon & Nathon" },
  { maxKm: 22, fee: 500, label: "Lamai & the south" },
  { maxKm: Infinity, fee: 700, label: "Far side of the island" },
];

export const zoneForDistance = (km: number): TravelZone =>
  travelZones.find((z) => km <= z.maxKm) ?? travelZones[travelZones.length - 1];

// Haversine distance in kilometres.
export const distanceKm = (
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number => {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
