"use client";

import { useMemo } from "react";
import type { CSSProperties } from "react";

// Drifting gold "spa-steam" motes — animated purely with CSS keyframes so the
// work runs on the compositor thread (smooth, no per-frame JavaScript).
export default function Particles({ count = 14 }: { count?: number }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const size = 2 + Math.random() * 5;
        return {
          id: i,
          left: Math.random() * 100,
          size,
          delay: Math.random() * 10,
          duration: 12 + Math.random() * 12,
          drift: (Math.random() - 0.5) * 70,
          opacity: 0.15 + Math.random() * 0.45,
        };
      }),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d) => (
        <span
          key={d.id}
          className="particle"
          style={
            {
              left: `${d.left}%`,
              width: d.size,
              height: d.size,
              animationDelay: `${d.delay}s`,
              animationDuration: `${d.duration}s`,
              "--p-drift": `${d.drift}px`,
              "--p-op": d.opacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
