"use client";

import Image from "next/image";
import { Check, Star } from "lucide-react";
import { packages } from "@/lib/services";
import { money } from "@/lib/booking";
import { useBooking } from "./booking/BookingProvider";
import Reveal from "./Reveal";
import SectionGlow from "./SectionGlow";

export default function Packages() {
  const { openBooking } = useBooking();

  return (
    <section id="packages" className="relative overflow-hidden bg-gradient-to-b from-cream via-cream-soft to-cream-deep py-24">
      <SectionGlow variant="soft" />
      <div className="container-luxe relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-4 justify-center">
            <span className="h-px w-8 bg-luxe-700" /> Curated Journeys
          </p>
          <h2 className="heading text-4xl sm:text-5xl">Signature packages</h2>
          <p className="mt-5 text-ink-soft">
            Thoughtfully combined treatments and courses — better value, deeper
            results.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <div
                className={`group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-luxe ${
                  p.best ? "ring-2 ring-gold" : ""
                }`}
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={p.image ?? "/images/room.jpg"}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
                  {p.best && (
                    <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink">
                      <Star className="h-3 w-3 fill-ink" /> Most loved
                    </span>
                  )}
                  <span className="absolute bottom-3 left-4 text-xs uppercase tracking-widest text-cream/90">
                    {p.duration}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-serif text-2xl text-ink">{p.name}</h3>
                  <p className="mt-1 text-sm italic text-ink-soft">{p.tagline}</p>
                  <ul className="mt-4 flex-1 space-y-2">
                    {p.includes.map((inc) => (
                      <li
                        key={inc}
                        className="flex items-start gap-2 text-sm text-ink-soft"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-luxe-700" />
                        {inc}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-ink-soft">from</span>
                      <p className="font-serif text-3xl text-luxe-800">
                        {money(p.price)}
                      </p>
                    </div>
                    <button
                      onClick={() => openBooking()}
                      className="btn-outline px-5 py-2.5"
                    >
                      Reserve
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-ink-soft">
          Prices are per person unless stated. Custom packages available on
          request.
        </p>
      </div>
    </section>
  );
}
