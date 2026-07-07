"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star, MessageCircle, MapPin, ArrowDown } from "lucide-react";
import { business } from "@/lib/config";
import { useBooking } from "./booking/BookingProvider";
import Particles from "./hero/Particles";

export default function Hero() {
  const { openBooking } = useBooking();

  // Mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const imgX = useTransform(sx, [-0.5, 0.5], [18, -18]);
  const imgY = useTransform(sy, [-0.5, 0.5], [12, -12]);
  const glowX = useTransform(sx, [-0.5, 0.5], [-40, 40]);
  const glowY = useTransform(sy, [-0.5, 0.5], [-30, 30]);
  const contentX = useTransform(sx, [-0.5, 0.5], [-10, 10]);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section
      id="top"
      onMouseMove={onMove}
      className="relative min-h-[100svh] w-full overflow-hidden bg-luxe-950"
    >
      {/* Ken-Burns image with parallax (scale animated via CSS on the compositor) */}
      <motion.div
        className="absolute inset-0"
        style={{ x: imgX, y: imgY }}
      >
        <div className="animate-kenburns absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="Luxe Health Massage — serene wellness treatment in Koh Samui"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </motion.div>

      {/* Tint gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-luxe-950/90 via-ink/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-luxe-950/85 via-transparent to-luxe-950/40" />

      {/* Colour glows (static — large blurs are costly to repaint, so we don't animate them) */}
      <motion.div
        style={{ x: glowX, y: glowY }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-24 top-1/4 h-[32rem] w-[32rem] rounded-full bg-luxe-600/30 blur-[120px] opacity-50" />
        <div className="absolute -right-16 top-1/3 h-[28rem] w-[28rem] rounded-full bg-gold/20 blur-[120px] opacity-40" />
        <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-luxe-800/40 blur-[110px] opacity-45" />
      </motion.div>

      {/* Floating gold particles */}
      <Particles />

      {/* Grain */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay grain" />

      {/* Fine gold frame */}
      <div className="pointer-events-none absolute inset-3 rounded-2xl border border-gold-light/20 sm:inset-5" />

      {/* Content */}
      <motion.div
        style={{ x: contentX }}
        className="container-luxe relative flex min-h-[100svh] flex-col justify-center pt-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold-light/40 bg-white/10 px-4 py-1.5 backdrop-blur"
          >
            <MapPin className="h-3.5 w-3.5 text-gold-light" />
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-cream">
              Bang Por · Koh Samui
            </span>
          </motion.div>

          <h1 className="heading text-5xl text-cream sm:text-6xl lg:text-7xl">
            The art of healing,
            <span className="mt-1 block bg-gradient-to-r from-gold-light via-gold to-gold-light bg-clip-text italic text-transparent">
              perfected.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/85">
            A medical &amp; wellness massage sanctuary led by Khun Roong —
            lymphatic drainage, Toksen, herbal compress and timeless Thai
            rituals. In our studio, or in the comfort of your home.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openBooking()}
              className="btn-gold text-base"
            >
              <MessageCircle className="h-5 w-5" />
              Book Your Treatment
            </motion.button>
            <a
              href="#treatments"
              className="btn-outline border-cream/40 text-cream hover:bg-cream hover:text-ink"
            >
              Explore Treatments
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-cream/90">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-gold-light text-gold-light" />
              ))}
              <span className="ml-1.5 text-sm font-semibold">5-star rated</span>
            </div>
            <span className="hidden h-4 w-px bg-cream/30 sm:block" />
            <p className="text-sm">
              <span className="font-semibold">
                {business.experienceYears}+ years
              </span>{" "}
              of experience · skilled, highly trained therapists
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#treatments"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-cream/60"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
        >
          <ArrowDown className="h-4 w-4" />
        </motion.div>
      </motion.a>
    </section>
  );
}
