import Image from "next/image";
import { HeartPulse, Sparkles, Leaf } from "lucide-react";
import Reveal from "./Reveal";
import SectionGlow from "./SectionGlow";

const pillars = [
  {
    icon: HeartPulse,
    title: "Medical Focus",
    text: "Therapeutic, results-driven treatments — not just relaxation.",
  },
  {
    icon: Sparkles,
    title: "Genuine Expertise",
    text: "Led by Khun Roong, highly skilled and deeply experienced.",
  },
  {
    icon: Leaf,
    title: "Whole-Body Wellbeing",
    text: "Care that restores body, mind and lasting balance.",
  },
];

export default function Intro() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream via-cream to-cream-soft py-24">
      <SectionGlow />
      <div className="container-luxe relative grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow mb-4">
            <span className="h-px w-8 bg-luxe-700" /> Welcome to Luxe
          </p>
          <h2 className="heading text-4xl sm:text-5xl">
            Far more than a Thai massage.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            Luxe Health Massage is a wellness sanctuary in Bang Por, Koh Samui,
            where genuine therapeutic skill meets true hospitality. Every
            treatment is tailored — designed to heal, recover and restore, whether
            you&apos;re easing chronic tension, recovering from sport, or simply
            reclaiming a moment of calm.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            This is medical wellness, elevated: precise, professional and quietly
            luxurious.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {pillars.map((p) => (
              <div key={p.title}>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-luxe-700/10">
                  <p.icon className="h-5 w-5 text-luxe-700" />
                </div>
                <h3 className="font-serif text-xl text-ink">{p.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{p.text}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-luxe">
            <Image
              src="/images/room.jpg"
              alt="Luxe Health Massage treatment room"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-luxe-800 px-7 py-5 text-cream shadow-luxe sm:block">
            <p className="font-serif text-4xl leading-none">20+</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-cream/70">
              Years of experience
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
