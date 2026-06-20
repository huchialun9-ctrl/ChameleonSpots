"use client";

import { WorkshopMap } from "@/types";
import Link from "next/link";

const tagColors: Record<string, string> = {
  "官方內建": "var(--accent-yellow)",
  "室內": "var(--accent-pink)",
  "室外": "var(--accent-green)",
  "迷宮": "var(--accent-purple)",
};

interface MapCardProps {
  map: WorkshopMap;
}

export default function MapCard({ map }: MapCardProps) {
  return (
    <div
      className="game-card rounded-2xl overflow-hidden group transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div
        className="relative aspect-video overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${map.tags[0] === "官方內建" ? "#2d1b4e" : "#1a1040"}, #0f0a1a)` }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl opacity-10 select-none">
            {map.tags.includes("官方內建") ? "🎮" :
             map.tags.includes("迷宮") ? "🌀" :
             map.tags.includes("室內") ? "🏠" :
             map.tags.includes("室外") ? "🌳" : "🎯"}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)]/80 via-transparent to-transparent" />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {map.tags.map((tag) => (
            <span
              key={tag}
              className="tag-badge"
              style={{
                background: `${tagColors[tag] || "var(--accent-pink)"}20`,
                color: tagColors[tag] || "var(--accent-pink)",
                border: `1px solid ${tagColors[tag] || "var(--accent-pink)"}30`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <div
          className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        >
          <span className="text-[10px] font-bold" style={{ color: "var(--accent-green)" }}>{map.spotCount}</span>
          <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>個神位</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3
            className="text-sm font-bold text-white leading-tight group-hover:drop-shadow-[0_0_6px_var(--glow-pink)] transition-all"
          >
            {map.title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{ background: "var(--accent-pink)", color: "#fff", boxShadow: "0 0 8px var(--glow-pink)" }}
          >
            {map.author.charAt(0).toUpperCase()}
          </div>
          <a
            href={map.authorLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs transition-colors truncate"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-pink)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
          >
            {map.author}
          </a>
        </div>

        <div className="flex gap-2 pt-1">
          <Link
            href={`/map/${map.id}`}
            className="flex-1 text-center py-2 rounded-xl text-xs font-semibold btn-primary"
          >
            查閱策略
          </Link>
          <a
            href={map.steamWorkshopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-2 rounded-xl text-xs font-semibold btn-secondary"
          >
            Steam 訂閱
          </a>
        </div>
      </div>
    </div>
  );
}
