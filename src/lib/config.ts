// ---------------------------------------------------------------------------
// Business configuration — safe to edit. All contact details and coordinates
// live here so they can be updated without touching the components.
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
