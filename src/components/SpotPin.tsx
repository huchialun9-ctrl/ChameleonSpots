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
        className={`relative w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-200 cursor-pointer group ${
          isActive
            ? "border-[#00ff88] bg-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.6)] scale-125"
            : "border-red-400 bg-red-500/60 hover:scale-110 hover:shadow-[0_0_10px_rgba(255,100,100,0.4)]"
        }`}
      >
        <span
          className={`absolute -top-1 -right-1 w-2 h-2 rounded-full animate-ping ${
            isActive ? "bg-[#00ff88]" : "bg-red-300"
          }`}
        />
      </button>

      <div
        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap backdrop-blur-md border transition-all duration-200 pointer-events-none ${
          isActive
            ? "border-[#00ff88]/40 bg-black/80 text-white opacity-100"
            : "border-white/10 bg-black/60 text-white/60 opacity-0 group-hover:opacity-100"
        }`}
      >
        <div className="font-semibold">{spot.name}</div>
        <div className="text-[10px] text-[#00ff88]">
          成功率 {spot.successRate}%
        </div>
      </div>
    </div>
  );
}
