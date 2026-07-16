"use client";

import dynamic from "next/dynamic";
import { Home, MapPin, Car, CalendarCheck, Loader2 } from "lucide-react";
import { travelZones } from "@/lib/config";
import { money } from "@/lib/booking";
import { useBooking } from "./booking/BookingProvider";
import Reveal from "./Reveal";

const MapPicker = dynamic(() => import("./booking/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-cream-soft">
      <Loader2 className="h-6 w-6 animate-spin text-luxe-700" />
    </div>
  ),
});

const steps = [
  { icon: Home, title: "Choose in-villa", text: "Select the in-villa option when you book." },
  { icon: MapPin, title: "Pick your area", text: "Choose Mae Nam / Bang Por, Bophut / Nathon or further." },
  { icon: Car, title: "See your fee", text: "A simple flat travel fee by area — no surprises." },
  { icon: CalendarCheck, title: "We come to you", text: "Relax — Roong's team brings the spa." },
];

export default function InHome() {
  const { openBooking } = useBooking();

  return (
    <section id="in-home" className="relative overflow-hidden bg-gradient-to-b from-cream-deep via-cream to-cream py-24">
      <div className="glow-orb -right-40 top-0 h-[30rem] w-[30rem] bg-luxe-200/40" />
      <div className="container-luxe relative grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow mb-4">
            <span className="h-px w-8 bg-luxe-700" /> In-Villa Service
          </p>
          <h2 className="heading text-4xl sm:text-5xl">
            The spa, brought to your door.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            Enjoy most treatments in the comfort of your villa, hotel or
            residence. In-villa adds <span className="font-semibold text-ink">+{money(200)} per treatment</span>,
            plus a simple flat travel fee by area — no surprises. Our signature
            packages stay in the studio, where we have a proper massage bed.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {steps.map((s, i) => (
              <div key={s.title} className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-luxe-700/10 text-luxe-700">
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {i + 1}. {s.title}
                  </p>
                  <p className="text-sm text-ink-soft">{s.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl ring-1 ring-black/5">
            <table className="w-full text-left text-sm">
              <thead className="bg-luxe-900 text-cream">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Area</th>
                  <th className="px-4 py-2.5 text-right font-medium">Travel fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 bg-white">
                {travelZones.map((z) => (
                  <tr key={z.id}>
                    <td className="px-4 py-2.5 text-ink">{z.label}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-luxe-800">
                      {money(z.fee)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button onClick={() => openBooking()} className="btn-primary mt-8">
            Book an In-Villa Treatment
          </button>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="h-[26rem] overflow-hidden rounded-[2rem] shadow-luxe ring-1 ring-black/5 lg:h-[34rem]">
            <MapPicker coords={null} onPick={() => openBooking()} />
          </div>
          <p className="mt-3 text-center text-sm text-ink-soft">
            Our studio is the <span className="text-luxe-700">✦</span> pin, in
            Bang Por &amp; Mae Nam — the heart of our in-villa service area.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
