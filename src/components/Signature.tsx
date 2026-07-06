"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { services, fromPrice } from "@/lib/services";
import { money } from "@/lib/booking";
import { useBooking } from "./booking/BookingProvider";
import Reveal from "./Reveal";

export default function Signature() {
  const { openBooking } = useBooking();
  const featured = services.filter((s) => s.featured).slice(0, 4);

  return (
    <section className="relative bg-luxe-950 py-24 text-cream">
      <div className="container-luxe">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-4 justify-center text-gold-light">
            Signature Wellness
          </p>
          <h2 className="heading text-4xl text-cream sm:text-5xl">
            Treatments that truly heal
          </h2>
          <p className="mt-5 text-cream/70">
            Our specialist therapies go beyond the ordinary — targeted techniques
            for recovery, circulation and lasting wellbeing.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {featured.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.08}>
              <motion.button
                onClick={() => openBooking(s.id)}
                whileHover={{ y: -6 }}
                className="group relative flex h-72 w-full overflow-hidden rounded-3xl text-left"
              >
                <Image
                  src={s.image ?? "/images/room.jpg"}
                  alt={s.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
                <div className="relative mt-auto p-7">
                  <div className="mb-2 flex flex-wrap gap-2">
                    {s.benefits?.slice(0, 2).map((b) => (
                      <span
                        key={b}
                        className="rounded-full border border-cream/25 bg-white/5 px-3 py-1 text-[11px] text-cream/80 backdrop-blur"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-serif text-2xl text-cream">{s.name}</h3>
                  <p className="mt-1 max-w-md text-sm text-cream/75">{s.short}</p>
                  <div className="mt-3 flex items-center gap-2 text-gold-light">
                    <span className="text-sm font-medium">
                      From {money(fromPrice(s))}
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
