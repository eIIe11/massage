import { Star, Quote } from "lucide-react";
import { business } from "@/lib/config";
import Reveal from "./Reveal";

const reviews = [
  {
    name: "Sarah M.",
    from: "United Kingdom",
    text: "The best massage I've had in Thailand — and I've had many. Roong's lymphatic drainage left me feeling completely renewed. Genuinely therapeutic.",
  },
  {
    name: "Daniel K.",
    from: "Australia",
    text: "Came in with a sports injury, left moving freely. This is real recovery work, not a tourist massage. Booked three more sessions on the spot.",
  },
  {
    name: "Lisa & Tom",
    from: "Germany",
    text: "They came to our villa for a couples treatment — so easy to book on WhatsApp and worth every baht. Professional, punctual and wonderfully relaxing.",
  },
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream-deep via-cream to-cream-soft py-24">
      <div className="glow-orb -left-40 top-1/4 h-[28rem] w-[28rem] bg-gold-light/20" />
      <div className="container-luxe relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="mb-4 flex items-center justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-gold text-gold" />
            ))}
          </div>
          <h2 className="heading text-4xl sm:text-5xl">Loved by our guests</h2>
          <p className="mt-4 text-ink-soft">
            Five-star care from a skilled, highly trained team — with{" "}
            {business.experienceYears}+ years of experience.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.08}>
              <figure className="flex h-full flex-col rounded-3xl bg-white p-7 shadow-sm ring-1 ring-black/5">
                <Quote className="h-8 w-8 text-luxe-700/30" />
                <blockquote className="mt-3 flex-1 text-ink-soft">
                  “{r.text}”
                </blockquote>
                <figcaption className="mt-5 border-t border-black/5 pt-4">
                  <p className="font-serif text-lg text-ink">{r.name}</p>
                  <p className="text-xs uppercase tracking-widest text-ink-soft">
                    {r.from}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
