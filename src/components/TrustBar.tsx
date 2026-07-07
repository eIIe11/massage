const items = [
  "Lymphatic Drainage",
  "Toksen Therapy",
  "Thai Body Balance",
  "Deep Oil & Balm",
  "Traditional Thai",
  "Herbal Hot Compress",
  "Hot Stone",
  "Facial Care",
  "In-Home Service",
];

export default function TrustBar() {
  const row = [...items, ...items];
  return (
    <div className="border-y border-luxe-700/10 bg-luxe-900 py-4">
      <div className="relative flex overflow-hidden">
        <div className="animate-marquee flex shrink-0 items-center gap-10 whitespace-nowrap pr-10">
          {row.map((t, i) => (
            <span key={i} className="flex items-center gap-10 text-sm tracking-[0.2em] text-cream/70">
              <span className="text-gold-light">✦</span>
              <span className="uppercase">{t}</span>
            </span>
          ))}
        </div>
        <div className="animate-marquee flex shrink-0 items-center gap-10 whitespace-nowrap pr-10" aria-hidden>
          {row.map((t, i) => (
            <span key={i} className="flex items-center gap-10 text-sm tracking-[0.2em] text-cream/70">
              <span className="text-gold-light">✦</span>
              <span className="uppercase">{t}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
