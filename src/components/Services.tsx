"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Clock } from "lucide-react";
import { categories, services, Category } from "@/lib/services";
import { money } from "@/lib/booking";
import { useBooking } from "./booking/BookingProvider";
import Reveal from "./Reveal";
import SectionGlow from "./SectionGlow";

export default function Services() {
  const { openBooking } = useBooking();
  const [active, setActive] = useState<Category>("wellness");
  const list = services.filter((s) => s.category === active);
  const cat = categories.find((c) => c.id === active)!;

  return (
    <section id="treatments" className="relative overflow-hidden bg-gradient-to-b from-cream-soft via-cream to-cream py-24">
      <SectionGlow variant="soft" />
      <div className="container-luxe relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-4 justify-center">
            <span className="h-px w-8 bg-luxe-700" /> The Menu
          </p>
          <h2 className="heading text-4xl sm:text-5xl">Every kind of care</h2>
          <p className="mt-5 text-ink-soft">
            From clinical wellness therapies to the most indulgent classics —
            all delivered with expert hands.
          </p>
        </Reveal>

        {/* Tabs */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                active === c.id
                  ? "bg-luxe-700 text-cream shadow-soft"
                  : "bg-white text-ink hover:bg-luxe-50"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <p className="mt-4 text-center text-sm italic text-ink-soft">
          {cat.blurb}
        </p>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {list.map((s) => (
              <button
                key={s.id}
                onClick={() => openBooking(s.id)}
                className="group flex flex-col rounded-3xl bg-white p-6 text-left shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-luxe"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-serif text-2xl text-ink">{s.name}</h3>
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-luxe-700/10 text-luxe-700 transition group-hover:bg-luxe-700 group-hover:text-cream">
                    <Plus className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                  {s.description}
                </p>
                <div className="mt-5 space-y-2 border-t border-black/5 pt-4">
                  {s.options.map((o) => (
                    <div
                      key={o.minutes}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="flex items-center gap-1.5 text-ink-soft">
                        <Clock className="h-3.5 w-3.5" /> {o.minutes} min
                      </span>
                      <span className="font-semibold text-luxe-800">
                        {money(o.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
