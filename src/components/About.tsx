import Image from "next/image";
import { Award, Hand, Sparkles } from "lucide-react";
import Reveal from "./Reveal";

const facts = [
  { icon: Award, label: "Highly skilled & experienced" },
  { icon: Hand, label: "Specialist medical techniques" },
  { icon: Sparkles, label: "Personalised, caring approach" },
];

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-luxe-950 py-24 text-cream">
      <div className="container-luxe grid items-center gap-14 lg:grid-cols-[0.85fr_1fr]">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-luxe">
            <Image
              src="/images/lymphatic.jpg"
              alt="Khun Roong performing a treatment"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -right-4 top-8 rounded-2xl bg-gold px-6 py-4 text-ink shadow-luxe">
            <p className="font-serif text-2xl leading-none">Khun Roong</p>
            <p className="mt-1 text-xs uppercase tracking-widest">Founder &amp; Therapist</p>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="eyebrow mb-4 text-gold-light">
            <span className="h-px w-8 bg-gold-light" /> Meet Your Therapist
          </p>
          <h2 className="heading text-4xl text-cream sm:text-5xl">
            In the hands of a true master.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-cream/80">
            Luxe Health Massage is the vision of Khun Roong — a therapist whose
            reputation on Koh Samui is built on genuine skill, deep anatomical
            knowledge and an unwavering commitment to her guests&apos; wellbeing.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-cream/80">
            From advanced lymphatic drainage to sports recovery and beyond, every
            treatment is delivered with intention, precision and care. It&apos;s
            why guests return again and again — and why they recommend Luxe to
            everyone they know.
          </p>

          <div className="mt-8 space-y-3">
            {facts.map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <f.icon className="h-4 w-4 text-gold-light" />
                </div>
                <span className="text-cream/90">{f.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
