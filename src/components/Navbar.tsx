"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X, MessageCircle } from "lucide-react";
import { useBooking } from "./booking/BookingProvider";
import LanguageSwitcher from "./LanguageSwitcher";

const links = [
  { href: "#treatments", label: "Treatments" },
  { href: "#packages", label: "Packages" },
  { href: "#in-home", label: "In-Villa" },
  { href: "#about", label: "About" },
  { href: "#visit", label: "Visit" },
];

export default function Navbar() {
  const { openBooking } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-cream/90 shadow-soft backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="container-luxe flex items-center justify-between py-3">
        <a href="#top" className="flex items-center gap-2">
          <Image
            src={scrolled ? "/luxe-logo.png" : "/luxe-logo-light.png"}
            alt="Luxe Health Massage"
            width={132}
            height={125}
            priority
            className="h-12 w-auto drop-shadow-sm sm:h-14"
          />
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm font-medium tracking-wide transition hover:text-luxe-700 ${
                scrolled ? "text-ink" : "text-cream/90 hover:text-cream"
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher dark={scrolled} />
          </div>
          <button
            onClick={() => openBooking()}
            className="btn-primary hidden px-6 py-3 sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" />
            Book Now
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className={`rounded-full p-2 lg:hidden ${
              scrolled ? "text-ink" : "text-cream"
            }`}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-black/5 bg-cream/95 backdrop-blur-md lg:hidden">
          <div className="container-luxe flex flex-col gap-1 py-4">
            <div className="px-3 pb-2">
              <LanguageSwitcher dark />
            </div>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-ink transition hover:bg-luxe-50"
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                openBooking();
              }}
              className="btn-primary mt-2"
            >
              <MessageCircle className="h-4 w-4" />
              Book Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
