"use client";

import { useReducedMotion } from "motion/react";

/**
 * Radar instrument: concentric rings, tick marks, rotating sweep,
 * and small blips for "detected" repos. Pure SVG + transform animation.
 */
export function RadarSweep() {
  const reduce = useReducedMotion();

  const rings = [10, 7.5, 5, 2.5].map((r, i) => (
    <circle
      key={r}
      cx="50"
      cy="50"
      r={r}
      fill="none"
      stroke="currentColor"
      strokeOpacity={0.28 - i * 0.05}
      strokeWidth="0.35"
    />
  ));

  // Tick marks every 15 degrees on the outer ring.
  const ticks = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 15 * Math.PI) / 180;
    const r1 = 10.2;
    const r2 = 10.8;
    return (
      <line
        key={i}
        x1={50 + r1 * Math.cos(angle)}
        y1={50 + r1 * Math.sin(angle)}
        x2={50 + r2 * Math.cos(angle)}
        y2={50 + r2 * Math.sin(angle)}
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="0.3"
      />
    );
  });

  const blips = [
    { x: 63, y: 30, d: 0 },
    { x: 38, y: 66, d: 0.9 },
    { x: 68, y: 58, d: 1.7 },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[420px] select-none" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="h-auto w-full text-accent">
        {/* Cross hairs */}
        <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeOpacity="0.15" strokeWidth="0.3" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeOpacity="0.15" strokeWidth="0.3" />
        {rings}
        {ticks}
        {/* Sweep wedge: faint trail + leading line */}
        <g className={reduce ? undefined : "radar-sweep"}>
          <path
            d="M50,50 L50,0 A50,50 0 0 1 82.5,21.5 Z"
            fill="currentColor"
            opacity="0.05"
          />
          <line x1="50" y1="50" x2="50" y2="0" stroke="currentColor" strokeWidth="0.7" />
        </g>
        {/* Blips */}
        {blips.map((b, i) => (
          <g key={i} className={reduce ? undefined : "blip-pulse"} style={{ animationDelay: `${b.d}s` }}>
            <circle cx={b.x} cy={b.y} r="1.4" fill="currentColor" />
            <circle cx={b.x} cy={b.y} r="2.6" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.35" />
          </g>
        ))}
      </svg>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}
