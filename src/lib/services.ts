// ---------------------------------------------------------------------------
// Treatment menu & packages.
// Prices are in Thai Baht (฿) and are indicative, competitive Koh Samui rates —
// review with the owner before go-live. Everything is editable in this file.
// ---------------------------------------------------------------------------

export type Category = "wellness" | "classic" | "body" | "beauty";

export interface Option {
  minutes: number;
  price: number;
}

export interface Service {
  id: string;
  name: string;
  category: Category;
  short: string; // one-line summary for tiles
  description: string; // fuller description
  options: Option[]; // duration / price tiers
  benefits?: string[];
  image?: string;
  featured?: boolean; // signature medical/wellness treatment
}

export const categories: { id: Category; label: string; blurb: string }[] = [
  {
    id: "wellness",
    label: "Medical & Wellness",
    blurb: "Therapeutic treatments for recovery, circulation and healing.",
  },
  {
    id: "classic",
    label: "Classic & Relaxation",
    blurb: "Timeless massage traditions to unwind and restore.",
  },
  {
    id: "body",
    label: "Body & Detox",
    blurb: "Scrubs, wraps and rituals that renew from head to toe.",
  },
  {
    id: "beauty",
    label: "Beauty & Face",
    blurb: "Radiance-boosting facial and beauty care.",
  },
];

export const services: Service[] = [
  // ---- Medical & Wellness (signature) ----
  {
    id: "lymphatic-drainage",
    name: "Manual Lymphatic Drainage",
    category: "wellness",
    featured: true,
    image: "/images/lymphatic.jpg",
    short: "Gentle, rhythmic detox to reduce fluid & swelling.",
    description:
      "A specialised, feather-light technique that stimulates the lymphatic system to flush toxins, reduce water retention and swelling, and support the immune system. A signature of Luxe Health Massage.",
    benefits: ["Reduces swelling & bloating", "Boosts immunity", "Post-op & post-flight recovery"],
    options: [
      { minutes: 60, price: 900 },
      { minutes: 90, price: 1300 },
    ],
  },
  {
    id: "cellulite",
    name: "Cellulite & Slimming Massage",
    category: "wellness",
    featured: true,
    image: "/images/sports.jpg",
    short: "Deep contouring strokes to smooth & firm skin.",
    description:
      "Targeted deep-tissue and vacuum-style techniques that break down stubborn cellulite, stimulate circulation and help tone and contour the body over a course of sessions.",
    benefits: ["Smooths cellulite", "Firms & contours", "Improves circulation"],
    options: [
      { minutes: 60, price: 900 },
      { minutes: 90, price: 1300 },
    ],
  },
  {
    id: "sports-recovery",
    name: "Sports Recovery Massage",
    category: "wellness",
    featured: true,
    image: "/images/sports.jpg",
    short: "Restore tired muscles & speed up recovery.",
    description:
      "A performance-focused blend of deep tissue, stretching and trigger-point work designed for athletes and active bodies — relieving tension, preventing injury and accelerating recovery.",
    benefits: ["Faster muscle recovery", "Injury prevention", "Improved mobility"],
    options: [
      { minutes: 60, price: 800 },
      { minutes: 90, price: 1100 },
    ],
  },
  {
    id: "deep-tissue",
    name: "Deep Tissue Therapy",
    category: "wellness",
    featured: true,
    image: "/images/sports.jpg",
    short: "Firm pressure to release chronic tension.",
    description:
      "Slow, firm strokes that reach the deeper layers of muscle and fascia to release chronic knots, ease stubborn back and shoulder pain, and restore freedom of movement.",
    benefits: ["Releases deep knots", "Relieves chronic pain", "Restores mobility"],
    options: [
      { minutes: 60, price: 700 },
      { minutes: 90, price: 1000 },
    ],
  },
  {
    id: "trigger-point",
    name: "Trigger Point & Myofascial Release",
    category: "wellness",
    short: "Precise release for knots & referred pain.",
    description:
      "Focused pressure on specific trigger points combined with myofascial release to unwind tight bands of tissue and relieve pain patterns at the source.",
    benefits: ["Targets pain at source", "Frees fascia", "Reduces tension headaches"],
    options: [{ minutes: 60, price: 850 }],
  },
  {
    id: "prenatal",
    name: "Prenatal (Pregnancy) Massage",
    category: "wellness",
    short: "Safe, nurturing relief for expectant mothers.",
    description:
      "A gentle, carefully positioned treatment that eases back ache, swollen legs and tension during pregnancy (suitable from the second trimester), leaving mums-to-be relaxed and supported.",
    benefits: ["Eases back & hip ache", "Reduces swelling", "Deep relaxation"],
    options: [{ minutes: 60, price: 700 }],
  },

  // ---- Classic & Relaxation ----
  {
    id: "thai",
    name: "Traditional Thai Massage",
    category: "classic",
    image: "/images/hero.jpg",
    short: "Ancient stretch-and-press for full-body energy.",
    description:
      "The time-honoured Thai art of rhythmic pressure and assisted yoga-like stretching that opens energy lines, improves flexibility and leaves you light and revitalised.",
    benefits: ["Improves flexibility", "Relieves stiffness", "Energising"],
    options: [
      { minutes: 60, price: 450 },
      { minutes: 90, price: 650 },
      { minutes: 120, price: 850 },
    ],
  },
  {
    id: "aromatherapy",
    name: "Aromatherapy Oil Massage",
    category: "classic",
    image: "/images/aroma.jpg",
    short: "Flowing oil massage with essential oils.",
    description:
      "Smooth, flowing strokes with your choice of aromatic essential oils to melt away stress, calm the mind and nourish the skin. Pure indulgence.",
    benefits: ["Deep relaxation", "Nourishes skin", "Calms the mind"],
    options: [
      { minutes: 60, price: 600 },
      { minutes: 90, price: 850 },
    ],
  },
  {
    id: "swedish",
    name: "Swedish Relaxation Massage",
    category: "classic",
    short: "Classic gliding strokes to soothe & unwind.",
    description:
      "A gentle-to-medium Western-style massage using long gliding strokes and kneading to ease tension, improve circulation and promote total relaxation.",
    benefits: ["Eases tension", "Improves circulation", "Total calm"],
    options: [
      { minutes: 60, price: 600 },
      { minutes: 90, price: 850 },
    ],
  },
  {
    id: "reflexology",
    name: "Foot Reflexology",
    category: "classic",
    image: "/images/reflexology.jpg",
    short: "Pressure-point foot therapy for whole-body balance.",
    description:
      "Expert pressure applied to reflex points on the feet that correspond to organs and systems throughout the body — deeply relaxing and wonderfully restorative.",
    benefits: ["Relieves tired feet", "Whole-body balance", "Better sleep"],
    options: [
      { minutes: 45, price: 400 },
      { minutes: 60, price: 500 },
    ],
  },
  {
    id: "back-neck-shoulder",
    name: "Back, Neck & Shoulder",
    category: "classic",
    short: "Targeted relief for desk & travel tension.",
    description:
      "A focused treatment on the areas that hold the most stress — perfect for office tension, travel stiffness or a quick reset.",
    benefits: ["Relieves stiffness", "Great for desk workers", "Quick reset"],
    options: [
      { minutes: 30, price: 350 },
      { minutes: 60, price: 550 },
    ],
  },
  {
    id: "four-hands",
    name: "Four Hands Massage",
    category: "classic",
    short: "Two therapists, twice the bliss.",
    description:
      "Two skilled therapists work in perfect synchrony for an immersive, deeply relaxing experience that quiets the mind and doubles the indulgence.",
    benefits: ["Ultimate indulgence", "Deep relaxation", "Synchronised bliss"],
    options: [{ minutes: 60, price: 1200 }],
  },

  // ---- Body & Detox ----
  {
    id: "hot-stone",
    name: "Hot Stone Therapy",
    category: "body",
    image: "/images/hotstone.jpg",
    short: "Warm basalt stones melt deep tension.",
    description:
      "Smooth heated volcanic stones glide over the body to radiate soothing warmth deep into the muscles, easing tension and promoting profound relaxation.",
    benefits: ["Melts deep tension", "Soothing warmth", "Improves circulation"],
    options: [{ minutes: 90, price: 1200 }],
  },
  {
    id: "herbal-compress",
    name: "Thai Herbal Compress",
    category: "body",
    image: "/images/aroma.jpg",
    short: "Steamed herbal poultice to soothe muscles.",
    description:
      "Warm poultices packed with traditional Thai herbs are pressed along the body, releasing aromatic steam that relieves aches, reduces inflammation and calms the senses.",
    benefits: ["Relieves aches", "Reduces inflammation", "Aromatic & calming"],
    options: [{ minutes: 90, price: 1000 }],
  },
  {
    id: "body-scrub",
    name: "Body Scrub & Exfoliation",
    category: "body",
    short: "Reveal soft, glowing skin.",
    description:
      "A gentle exfoliating scrub that sloughs away dull, dry skin to reveal a smooth, radiant glow — finished with a light moisturising ritual.",
    benefits: ["Softer skin", "Radiant glow", "Detoxifying"],
    options: [{ minutes: 45, price: 700 }],
  },
  {
    id: "body-wrap",
    name: "Herbal Body Wrap",
    category: "body",
    short: "Nourishing wrap to detox & hydrate.",
    description:
      "A cocooning wrap of nourishing botanicals that detoxifies, hydrates and firms the skin while you drift into deep relaxation.",
    benefits: ["Detoxifies", "Deeply hydrates", "Firms skin"],
    options: [{ minutes: 60, price: 900 }],
  },

  // ---- Beauty & Face ----
  {
    id: "facial",
    name: "Radiance Facial",
    category: "beauty",
    short: "Cleanse, nourish & glow.",
    description:
      "A tailored facial that cleanses, exfoliates and nourishes the skin with a relaxing face, neck and shoulder massage for a fresh, luminous complexion.",
    benefits: ["Brightens complexion", "Deeply cleanses", "Relaxing"],
    options: [{ minutes: 60, price: 800 }],
  },
  {
    id: "head-scalp",
    name: "Head & Scalp Ritual",
    category: "beauty",
    short: "Tension-melting scalp & head massage.",
    description:
      "A blissful head, scalp and face massage that relieves tension, eases headaches and leaves you serene and clear-headed.",
    benefits: ["Relieves headaches", "Melts tension", "Clarity & calm"],
    options: [{ minutes: 30, price: 350 }],
  },
];

export interface Package {
  id: string;
  name: string;
  duration: string;
  price: number;
  tagline: string;
  includes: string[];
  image?: string;
  best?: boolean;
}

export const packages: Package[] = [
  {
    id: "signature-ritual",
    name: "The Luxe Signature Ritual",
    duration: "2h 30m",
    price: 2500,
    tagline: "Our most-loved head-to-toe indulgence.",
    includes: [
      "Body scrub & exfoliation",
      "90-min aromatherapy oil massage",
      "Radiance facial",
    ],
    image: "/images/room.jpg",
    best: true,
  },
  {
    id: "recovery-renewal",
    name: "Recovery & Renewal",
    duration: "2h",
    price: 1900,
    tagline: "For active bodies that need to bounce back.",
    includes: [
      "Sports recovery massage",
      "Deep tissue therapy",
      "Thai herbal compress",
    ],
    image: "/images/sports.jpg",
  },
  {
    id: "lymphatic-detox",
    name: "Lymphatic Detox Program",
    duration: "3 × 60m",
    price: 2400,
    tagline: "A course of three drainage sessions to reset.",
    includes: [
      "3 × manual lymphatic drainage",
      "Personalised wellness guidance",
      "Best value per session",
    ],
    image: "/images/lymphatic.jpg",
  },
  {
    id: "couples-retreat",
    name: "Couples Retreat",
    duration: "1h 30m · for two",
    price: 2800,
    tagline: "Side-by-side serenity for two.",
    includes: [
      "90-min aromatherapy massage each",
      "Foot ritual & refreshments",
      "Private couples setting",
    ],
    image: "/images/aroma.jpg",
  },
  {
    id: "half-day-journey",
    name: "Half-Day Spa Journey",
    duration: "3h",
    price: 3500,
    tagline: "The ultimate escape — a full afternoon of care.",
    includes: [
      "Body scrub & herbal wrap",
      "Aromatherapy or hot stone massage",
      "Radiance facial & foot reflexology",
    ],
    image: "/images/hotstone.jpg",
  },
  {
    id: "wellness-membership",
    name: "Monthly Wellness Membership",
    duration: "4 × 60m / month",
    price: 2800,
    tagline: "Make wellbeing a habit — and save.",
    includes: [
      "4 × 60-min massage of choice each month",
      "Priority booking",
      "Member-only rates",
    ],
    image: "/images/room.jpg",
  },
];

export const fromPrice = (s: Service) =>
  Math.min(...s.options.map((o) => o.price));
