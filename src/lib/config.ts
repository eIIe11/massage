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

// In-home (outcall) service. A flat surcharge is added per treatment, plus a
// simple zone-based travel fee. All editable here — no map/distance maths.
export const IN_HOME_SURCHARGE = 200; // ฿ added per treatment for in-home

export interface TravelZone {
  id: string;
  label: string;
  fee: number;
}

// Simple, honest zones. In-home is offered on the Mae Nam / Bang Por side and
// the near neighbours; the far side of the island has heavy traffic.
export const travelZones: TravelZone[] = [
  { id: "maenam-bangpor", label: "Mae Nam / Bang Por", fee: 100 },
  { id: "bophut-nathon", label: "Bophut / Nathon", fee: 150 },
  {
    id: "further",
    label: "Further north than Nathon & further south than Chaweng",
    fee: 300,
  },
];

export const travelZoneById = (id: string): TravelZone | undefined =>
  travelZones.find((z) => z.id === id);
