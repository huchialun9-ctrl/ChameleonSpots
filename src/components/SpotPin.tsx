"use client";

import { StrategySpot } from "@/types";

interface SpotPinProps {
  spot: StrategySpot;
  isActive: boolean;
  onClick: () => void;
  onHover: (spot: StrategySpot | null) => void;
}

export default function SpotPin({ spot, isActive, onClick, onHover }: SpotPinProps) {
  return (
    <div
      className="absolute"
      style={{ left: `${spot.position.x}%`, top: `${spot.position.y}%` }}
    >
      <button
        onClick={onClick}
        onMouseEnter={() => onHover(spot)}
        onMouseLeave={() => onHover(null)}
        className="relative w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-200 cursor-pointer group"
        style={{
          borderColor: isActive ? "var(--accent-pink)" : "#ef4444",
          background: isActive ? "var(--accent-pink)" : "rgba(239,68,68,0.6)",
          boxShadow: isActive ? "0 0 15px var(--glow-pink)" : undefined,
          transform: isActive ? "scale(1.25)" : undefined,
        }}
      >
        <span
          className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-ping"
          style={{ background: isActive ? "var(--accent-pink)" : "rgba(239,68,68,0.8)" }}
        />
      </button>

      <div
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap backdrop-blur-md border transition-all duration-200 pointer-events-none"
        style={{
          borderColor: isActive ? "rgba(244,114,182,0.4)" : "rgba(255,255,255,0.1)",
          background: isActive ? "rgba(15,10,26,0.85)" : "rgba(15,10,26,0.6)",
          color: isActive ? "#fff" : "var(--text-secondary)",
          opacity: isActive ? 1 : 0,
        }}
        onMouseEnter={() => {
          if (!isActive) {
            const el = document.querySelector(`[data-spot-tooltip="${spot.id}"]`) as HTMLElement;
            if (el) el.style.opacity = "1";
          }
        }}
        onMouseLeave={() => {
          if (!isActive) {
            const el = document.querySelector(`[data-spot-tooltip="${spot.id}"]`) as HTMLElement;
            if (el) el.style.opacity = "0";
          }
        }}
      >
        <div className="font-semibold text-white">{spot.name}</div>
        <div className="text-[10px]" style={{ color: "var(--accent-green)" }}>
          成功率 {spot.successRate}%
        </div>
      </div>
    </div>
  );
}
