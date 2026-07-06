"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

// Drifting gold "spa-steam" motes that float gently upward.
export default function Particles({ count = 26 }: { count?: number }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 5,
        delay: Math.random() * 8,
        duration: 9 + Math.random() * 12,
        drift: (Math.random() - 0.5) * 60,
        opacity: 0.15 + Math.random() * 0.5,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full bg-gold-light"
          style={{
            left: `${d.left}%`,
            bottom: -10,
            width: d.size,
            height: d.size,
            filter: "blur(0.5px)",
            boxShadow: "0 0 8px rgba(228,205,151,0.6)",
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: [-10, -420 - Math.random() * 220],
            x: [0, d.drift],
            opacity: [0, d.opacity, d.opacity, 0],
          }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
