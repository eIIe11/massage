"use client";

import { MapPin, Clock, Phone, Mail, Instagram, MessageCircle } from "lucide-react";
import { business, whatsappLink } from "@/lib/config";
import { useBooking } from "./booking/BookingProvider";
import Reveal from "./Reveal";

export default function Visit() {
  const { openBooking } = useBooking();

  const contacts = [
    {
      icon: MapPin,
      label: "Find us",
      value: business.addressLines.join(", "),
      href: business.googleMapsUrl,
    },
    { icon: Clock, label: "Hours", value: business.hours },
    {
      icon: Phone,
      label: "Call",
      value: business.phoneDisplay,
      href: `tel:${business.phone}`,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: business.whatsappDisplay,
      href: whatsappLink("Hello Luxe Health Massage! I'd like to ask about a booking."),
    },
    { icon: Mail, label: "Email", value: business.email, href: `mailto:${business.email}` },
    {
      icon: Instagram,
      label: "Instagram",
      value: business.instagramHandle,
      href: business.instagram,
    },
  ];

  return (
    <section id="visit" className="bg-luxe-950 py-24 text-cream">
      <div className="container-luxe grid gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow mb-4 text-gold-light">
            <span className="h-px w-8 bg-gold-light" /> Visit Luxe
          </p>
          <h2 className="heading text-4xl text-cream sm:text-5xl">
            Come and be cared for.
          </h2>
          <p className="mt-5 max-w-md text-cream/75">
            Nestled in Bang Por on Koh Samui&apos;s tranquil north coast. Walk-ins
            welcome, though booking ahead is recommended — especially for in-villa
            visits.
          </p>

          <div className="mt-9 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {contacts.map((c) => (
              <div key={c.label} className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <c.icon className="h-4 w-4 text-gold-light" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-cream/50">
                    {c.label}
                  </p>
                  {c.href ? (
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cream/90 transition hover:text-gold-light"
                    >
                      {c.value}
                    </a>
                  ) : (
                    <p className="text-cream/90">{c.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => openBooking()} className="btn-gold mt-9">
            <MessageCircle className="h-5 w-5" />
            Book on WhatsApp
          </button>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="h-full min-h-[22rem] overflow-hidden rounded-[2rem] shadow-luxe ring-1 ring-white/10">
            <iframe
              title="Luxe Health Massage location"
              src={`https://www.google.com/maps?q=${business.location.lat},${business.location.lng}&z=14&output=embed`}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
