// ---------------------------------------------------------------------------
// Treatment menu & packages — from Luxe Health Massage's own printed menu.
// Prices are in Thai Baht (฿). Everything is editable in this file.
// Durations: 60 = 1 hr, 90 = 1.30 hr, 120 = 2 hr, 180 = 3 hr.
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
  featured?: boolean; // signature treatment
  studioOnly?: boolean; // needs a proper massage bed — studio only, no in-home
}

export const categories: { id: Category; label: string; blurb: string }[] = [
  {
    id: "wellness",
    label: "Signature & Wellness",
    blurb:
      "Therapeutic specialities — lymphatic drainage, Toksen and full-body balancing.",
  },
  {
    id: "classic",
    label: "Massage & Bodywork",
    blurb: "Oil, Thai and herbal massage in relaxing 1 & 1.5-hour rituals.",
  },
  {
    id: "body",
    label: "Foot, Back & Body",
    blurb: "Focused foot, back and skin treatments to target what needs care.",
  },
  {
    id: "beauty",
    label: "Facial Care",
    blurb: "Nourishing facials finished with a shoulder & head massage.",
  },
];

export const services: Service[] = [
  // ---- Signature & Wellness ----
  {
    id: "lymphatic-drainage",
    name: "Lymphatic Drainage Massage",
    category: "wellness",
    featured: true,
    image: "/images/lymphatic.jpg",
    short: "Light, rhythmic detox to reduce fluid & swelling.",
    description:
      "A gentle, specialised technique that stimulates the lymphatic system to reduce swelling and water retention, and helps the immune system work more effectively. A signature of Luxe Health Massage.",
    benefits: ["Reduces swelling", "Boosts immunity", "Light & soothing"],
    options: [{ minutes: 60, price: 600 }, { minutes: 90, price: 900 }, { minutes: 120, price: 1200 }],
  },
  {
    id: "body-balance",
    name: "Thai Physical Body Balance",
    category: "wellness",
    featured: true,
    studioOnly: true,
    image: "/images/therapist-female.jpg",
    short: "A 3-hour full-body reset for deep balance.",
    description:
      "An immersive three-hour treatment that increases body awareness and connects you with the sensations within. Improves blood circulation, stimulates lymphatic flow and the digestive system, releases tension in the abdomen, eases emotional tension, and helps you relax and sleep better.",
    benefits: ["Whole-body reset", "Improves circulation", "Deep relaxation"],
    options: [{ minutes: 180, price: 2400 }],
  },
  {
    id: "toksen-full",
    name: "Full Body Toksen",
    category: "wellness",
    featured: true,
    image: "/images/therapist-male.jpg",
    short: "Traditional wooden tapping to free stuck energy.",
    description:
      "An ancient northern-Thai therapy: gentle tapping with wooden instruments along the body's meridian lines sends healing vibrations deep into the tissue, awakening energy flow and restoring wellbeing — combined with Thai herbal balm.",
    benefits: ["Releases deep tension", "Restores energy flow", "Meditative"],
    options: [{ minutes: 120, price: 1600 }],
  },
  {
    id: "toksen-back",
    name: "Back, Neck & Shoulder Toksen",
    category: "wellness",
    short: "Targeted Toksen for the areas that hold stress.",
    description:
      "Focused Toksen tapping across the back, neck and shoulders to release tight, stubborn tension at the source — finished with warming Thai herbal balm.",
    benefits: ["Relieves stiff shoulders", "Frees tension", "Energising"],
    options: [{ minutes: 60, price: 800 }, { minutes: 90, price: 1200 }, { minutes: 120, price: 1600 }],
  },
  {
    id: "face-lymphatic",
    name: "Facial Lymphatic Drainage",
    category: "wellness",
    short: "Gentle facial drainage with coconut oil + shoulder & head.",
    description:
      "A delicate facial lymphatic drainage with coconut oil that helps reduce puffiness and brighten the complexion, finished with a soothing shoulder and head massage.",
    benefits: ["De-puffs the face", "Brightens skin", "Deeply calming"],
    options: [{ minutes: 60, price: 600 }, { minutes: 90, price: 900 }],
  },
  {
    id: "after-sport",
    name: "After-Sport Oil & Balm",
    category: "wellness",
    short: "Medium-pressure recovery for active bodies.",
    description:
      "A medium-pressure oil and balm massage designed for after exercise — easing worked muscles, relieving tension and supporting faster recovery.",
    benefits: ["Muscle recovery", "Relieves tension", "Medium pressure"],
    options: [{ minutes: 60, price: 600 }, { minutes: 90, price: 900 }, { minutes: 120, price: 1200 }],
  },

  // ---- Massage & Bodywork ----
  {
    id: "oil-relax",
    name: "Oil Massage (Relax)",
    category: "classic",
    image: "/images/aroma.jpg",
    short: "Flowing oil massage to melt away stress.",
    description:
      "Smooth, flowing strokes with your choice of oil to calm the mind, ease everyday tension and leave the skin nourished. Pure relaxation.",
    benefits: ["Deep relaxation", "Nourishes skin", "Calms the mind"],
    options: [{ minutes: 60, price: 400 }, { minutes: 90, price: 600 }, { minutes: 120, price: 800 }],
  },
  {
    id: "premium-oil",
    name: "Premium Oil Massage",
    category: "classic",
    short: "Choose your pressure — relax, medium or strong.",
    description:
      "An elevated oil massage tailored to your preferred pressure — from gentle relaxation through to firm, deep work — with your choice of oil.",
    benefits: ["Tailored pressure", "Relieves tension", "Choose your oil"],
    options: [{ minutes: 60, price: 500 }, { minutes: 90, price: 750 }, { minutes: 120, price: 1000 }],
  },
  {
    id: "deep-oil-balm",
    name: "Deep Oil & Balm",
    category: "classic",
    short: "Firm, deep work with warming balm.",
    description:
      "A medium-to-strong treatment combining oil and warming herbal balm to reach deeper layers of muscle, release chronic knots and restore freedom of movement.",
    benefits: ["Releases deep knots", "Warming balm", "Medium–strong"],
    options: [{ minutes: 60, price: 550 }, { minutes: 90, price: 800 }, { minutes: 120, price: 1050 }],
  },
  {
    id: "warm-oil",
    name: "Warm Oil Massage",
    category: "classic",
    short: "Warmed oil for deeper muscle release.",
    description:
      "Warmed oil combined with medium-to-strong pressure to soothe the muscles, improve circulation and melt away deep tension.",
    benefits: ["Warming & soothing", "Improves circulation", "Medium–strong"],
    options: [{ minutes: 60, price: 550 }, { minutes: 90, price: 800 }, { minutes: 120, price: 1050 }],
  },
  {
    id: "thai",
    name: "Traditional Thai Massage",
    category: "classic",
    short: "Ancient stretch-and-press for full-body energy.",
    description:
      "The time-honoured Thai art of rhythmic pressure and assisted stretching that opens energy lines, improves flexibility and leaves you light and revitalised. Medium to strong.",
    benefits: ["Improves flexibility", "Relieves stiffness", "Energising"],
    options: [{ minutes: 60, price: 400 }, { minutes: 90, price: 600 }, { minutes: 120, price: 800 }],
  },
  {
    id: "thai-oil",
    name: "Thai & Oil Massage",
    category: "classic",
    short: "Thai technique with the glide of oil.",
    description:
      "The best of both worlds — traditional Thai pressure and stretching blended with your choice of oil for a smoother, deeply relaxing treatment.",
    benefits: ["Flexibility + relaxation", "Choose your oil", "Medium–strong"],
    options: [{ minutes: 60, price: 500 }, { minutes: 90, price: 750 }, { minutes: 120, price: 1000 }],
  },
  {
    id: "thai-balm",
    name: "Thai & Herbal Balm",
    category: "classic",
    short: "Thai massage with warming herbal balm.",
    description:
      "Traditional Thai massage finished with warming Thai herbal balm to soothe tired muscles and enhance circulation.",
    benefits: ["Warming balm", "Relieves aches", "Medium–strong"],
    options: [{ minutes: 60, price: 500 }, { minutes: 90, price: 750 }, { minutes: 120, price: 1000 }],
  },
  {
    id: "thai-aloe",
    name: "Thai & Aloe Vera",
    category: "classic",
    short: "Cooling aloe vera with Thai technique.",
    description:
      "Traditional Thai massage combined with cooling aloe vera gel — wonderfully soothing for the skin, especially after sun.",
    benefits: ["Cooling & soothing", "Great after sun", "Medium–strong"],
    options: [{ minutes: 60, price: 600 }, { minutes: 90, price: 900 }, { minutes: 120, price: 1200 }],
  },
  {
    id: "thai-herbal-compress",
    name: "Thai Massage & Herbal Hot Compress",
    category: "classic",
    image: "/images/aroma.jpg",
    short: "Steamed herbal poultice to soothe key areas.",
    description:
      "Traditional Thai herbal therapy: warm poultices packed with Thai herbs are pressed along key areas after a pressure-point massage to soothe muscle tension and stiffness.",
    benefits: ["Relieves aches", "Aromatic & warming", "Reduces stiffness"],
    options: [{ minutes: 60, price: 750 }, { minutes: 90, price: 1100 }, { minutes: 120, price: 1500 }],
  },
  {
    id: "oil-herbal-compress",
    name: "Pure Oil & Herbal Hot Compress",
    category: "classic",
    short: "Flowing oil massage with a warm herbal compress.",
    description:
      "A flowing oil massage combined with a warm Thai herbal compress to relieve tension, ease aches and calm the senses.",
    benefits: ["Deeply soothing", "Aromatic herbs", "Relieves aches"],
    options: [{ minutes: 60, price: 800 }, { minutes: 90, price: 1200 }, { minutes: 120, price: 1600 }],
  },
  {
    id: "hot-stone",
    name: "Hot Stone Massage",
    category: "classic",
    featured: true,
    studioOnly: true,
    image: "/images/hotstone.jpg",
    short: "Warm stones melt deep tension & detoxify.",
    description:
      "Smooth heated stones glide over the body with your choice of oil, radiating soothing warmth deep into the muscles to detoxify the body, ease tension and promote profound relaxation.",
    benefits: ["Melts deep tension", "Detoxifying", "Soothing warmth"],
    options: [{ minutes: 60, price: 800 }, { minutes: 90, price: 1200 }, { minutes: 120, price: 1600 }],
  },

  // ---- Foot, Back & Body ----
  {
    id: "foot-oil-balm",
    name: "Foot Massage (Oil & Balm)",
    category: "body",
    image: "/images/reflexology.jpg",
    short: "Classic foot massage with oil & balm.",
    description:
      "A relaxing foot massage with oil and warming balm — the perfect way to revive tired feet and relax the whole body.",
    benefits: ["Revives tired feet", "Relaxing", "Improves circulation"],
    options: [{ minutes: 60, price: 400 }, { minutes: 90, price: 600 }, { minutes: 120, price: 800 }],
  },
  {
    id: "foot-hot-stone",
    name: "Foot Massage & Hot Stone",
    category: "body",
    short: "Warm stones and oil for tired feet.",
    description:
      "A foot massage using oil and warm stones to soothe aching feet and radiate relaxing warmth through the lower legs.",
    benefits: ["Soothing warmth", "Revives feet", "Relaxing"],
    options: [{ minutes: 60, price: 500 }, { minutes: 90, price: 750 }],
  },
  {
    id: "foot-scrub",
    name: "Foot Scrub, Oil & Balm",
    category: "body",
    short: "Exfoliate, then massage with oil & balm.",
    description:
      "A gentle foot scrub to buff away rough, dry skin, followed by a relaxing oil-and-balm foot massage for soft, refreshed feet.",
    benefits: ["Softer feet", "Exfoliating", "Relaxing"],
    options: [{ minutes: 60, price: 550 }, { minutes: 90, price: 800 }],
  },
  {
    id: "leg-arm-head",
    name: "Leg, Arm & Head Massage",
    category: "body",
    short: "Focused relief for legs, arms & head.",
    description:
      "A focused massage of the legs, arms and head with your choice of oil — ideal for reviving tired limbs and clearing the mind.",
    benefits: ["Revives limbs", "Clears the mind", "Choose your oil"],
    options: [{ minutes: 60, price: 500 }, { minutes: 90, price: 750 }, { minutes: 120, price: 1000 }],
  },
  {
    id: "back-shoulder-head",
    name: "Back, Shoulder & Head",
    category: "body",
    short: "Targeted relief for desk & travel tension.",
    description:
      "A focused treatment on the back, shoulders and head with oil and balm — perfect for office tension, travel stiffness or a quick reset.",
    benefits: ["Relieves stiffness", "Great for desk workers", "Quick reset"],
    options: [{ minutes: 60, price: 500 }, { minutes: 90, price: 750 }, { minutes: 120, price: 1000 }],
  },
  {
    id: "back-foot",
    name: "Back & Foot Massage",
    category: "body",
    short: "Back and feet, oil & balm.",
    description:
      "A combination treatment focusing on the back and the feet with oil and warming balm — relief where you need it most.",
    benefits: ["Relieves back tension", "Revives feet", "Balancing"],
    options: [{ minutes: 60, price: 500 }, { minutes: 90, price: 750 }, { minutes: 120, price: 1000 }],
  },
  {
    id: "body-scrub",
    name: "Body Scrub",
    category: "body",
    short: "Gentle exfoliation for soft, glowing skin.",
    description:
      "A gentle deep-cleansing treatment that exfoliates dull skin and leaves the entire body soft, smooth and radiant.",
    benefits: ["Softer skin", "Radiant glow", "Deep cleanse"],
    options: [{ minutes: 60, price: 800 }, { minutes: 90, price: 1200 }, { minutes: 120, price: 1600 }],
  },
  {
    id: "aloe-after-sun",
    name: "Aloe Vera Gel (After Sun)",
    category: "body",
    short: "Cooling aloe relief for sun-kissed skin.",
    description:
      "A cooling, soothing aloe vera treatment to calm and rehydrate skin after a day in the sun.",
    benefits: ["Cools sunburn", "Rehydrates", "Soothing"],
    options: [{ minutes: 60, price: 600 }, { minutes: 90, price: 900 }, { minutes: 120, price: 1200 }],
  },

  // ---- Facial Care ----
  {
    id: "coconut-facial",
    name: "Coconut Oil Facial + Shoulder & Head",
    category: "beauty",
    short: "Nourishing coconut facial with shoulder & head massage.",
    description:
      "A nourishing facial massage with pure coconut oil to hydrate and soften the skin, finished with a relaxing shoulder and head massage.",
    benefits: ["Hydrates skin", "Relaxing", "Natural coconut oil"],
    options: [{ minutes: 60, price: 600 }, { minutes: 90, price: 900 }, { minutes: 120, price: 1200 }],
  },
  {
    id: "aloe-facial",
    name: "Aloe Vera Gel Facial + Shoulder & Head",
    category: "beauty",
    short: "Cooling aloe facial with shoulder & head massage.",
    description:
      "A calming facial with cooling aloe vera gel to soothe and refresh the complexion, finished with a relaxing shoulder and head massage.",
    benefits: ["Soothes & cools", "Refreshes skin", "Relaxing"],
    options: [{ minutes: 60, price: 600 }, { minutes: 90, price: 900 }, { minutes: 120, price: 1200 }],
  },
  {
    id: "facial-toksen",
    name: "Facial Toksen + Shoulder & Head",
    category: "beauty",
    short: "Gentle facial tapping to brighten & lift.",
    description:
      "Delicate Toksen tapping on the face stimulates circulation for a brighter complexion, helps soften the look of fine lines and adds oxygen to the skin — finished with a shoulder and head massage.",
    benefits: ["Brightens complexion", "Softens fine lines", "Relieves tension"],
    options: [{ minutes: 60, price: 800 }, { minutes: 90, price: 1200 }, { minutes: 120, price: 1600 }],
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
  studioOnly?: boolean; // multi-part rituals — studio only
}

// Curated bundles built from the treatments above, at a small saving.
// Fully editable — adjust names, contents and prices with the owner.
export const packages: Package[] = [
  {
    id: "detox-glow",
    name: "Detox & Glow Ritual",
    duration: "2h",
    price: 1300,
    tagline: "Exfoliate, then flush and de-puff head to toe.",
    includes: [
      "Body scrub (1 hr)",
      "Lymphatic drainage massage (1 hr)",
      "Soft, glowing, refreshed skin",
    ],
    image: "/images/lymphatic.jpg",
    best: true,
    studioOnly: true,
  },
  {
    id: "after-sport-recovery",
    name: "After-Sport Recovery",
    duration: "2h",
    price: 1000,
    tagline: "For active bodies that need to bounce back.",
    includes: [
      "After-sport oil & balm (1 hr)",
      "Foot massage & hot stone (1 hr)",
      "Faster muscle recovery",
    ],
    image: "/images/therapist-female.jpg",
    studioOnly: true,
  },
  {
    id: "toksen-revival",
    name: "Toksen Revival",
    duration: "2h",
    price: 1500,
    tagline: "Ancient wooden-tapping therapy, body & face.",
    includes: [
      "Back, neck & shoulder Toksen (1 hr)",
      "Facial Toksen + shoulder & head (1 hr)",
      "Free energy flow & a brighter face",
    ],
    image: "/images/therapist-female.jpg",
    studioOnly: true,
  },
  {
    id: "couples-escape",
    name: "Couples Escape",
    duration: "1h · for two",
    price: 950,
    tagline: "Side-by-side serenity for two.",
    includes: [
      "Premium oil massage each (1 hr)",
      "Choose your oil & pressure",
      "Relax together, side by side",
    ],
    image: "/images/aroma.jpg",
    studioOnly: true,
  },
];

export const fromPrice = (s: Service) =>
  Math.min(...s.options.map((o) => o.price));
