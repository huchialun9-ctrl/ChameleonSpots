"use client";

import { WorkshopMap } from "@/types";
import Link from "next/link";

interface MapCardProps {
  map: WorkshopMap;
}

export default function MapCard({ map }: MapCardProps) {
  return (
    <div className="glass-card rounded-xl overflow-hidden group transition-all duration-300 hover:glow-border hover:-translate-y-1">
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#0a0a1a]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl opacity-20 select-none">
            {map.tags[0] === "經典IP改編" ? "🏗️" :
             map.tags[0] === "迷宮" ? "🌀" :
             map.tags[0] === "室內" ? "🏠" :
             map.tags[0] === "室外" ? "🌳" :
             map.tags[0] === "復古像素" ? "🕹️" : "🔥"}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {map.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/60 text-white/70 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm">
          <span className="text-[10px] text-[#00ff88] font-bold">{map.spotCount}</span>
          <span className="text-[10px] text-white/50">個神位</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-sm font-bold text-white leading-tight group-hover:text-[#00ff88] transition-colors">
            {map.title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#00ff88]/20 flex items-center justify-center text-[10px] font-bold text-[#00ff88]">
            {map.author.charAt(0).toUpperCase()}
          </div>
          <a
            href={map.authorLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/40 hover:text-[#00ff88] transition-colors truncate"
          >
            {map.author}
          </a>
        </div>

        <div className="flex gap-2 pt-1">
          <Link
            href={`/map/${map.id}`}
            className="flex-1 text-center py-2 rounded-lg text-xs font-semibold bg-[#00ff88] text-black hover:bg-[#00ff70] transition-all hover:scale-[1.02] active:scale-95"
          >
            查閱策略
          </Link>
          <a
            href={map.steamWorkshopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-2 rounded-lg text-xs font-semibold border border-white/15 text-white/70 hover:bg-white/5 hover:border-white/25 transition-all"
          >
            Steam 訂閱
          </a>
        </div>
      </div>
    </div>
  );
}
