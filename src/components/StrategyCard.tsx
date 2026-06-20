"use client";

import { StrategySpot } from "@/types";
import { useState, useRef, useEffect } from "react";

interface StrategyCardProps {
  spot: StrategySpot;
}

function StarRating({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-white/40 w-16">{label}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-3.5 h-3.5 ${star <= value ? "text-[#00ff88]" : "text-white/10"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </div>
  );
}

function CopyButton({ text, label, large }: { text: string; label?: string; large?: boolean }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className={`font-medium border transition-all ${
        large
          ? "px-6 py-3 rounded-xl text-base bg-[#00ff88] text-black hover:bg-[#00ff70] shadow-lg shadow-[#00ff88]/20"
          : "px-2.5 py-1.5 rounded-lg text-xs bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
      } ${copied ? "!bg-[#00ff88] !text-black" : ""}`}
    >
      {copied ? "✓ 已複製！" : (label || (large ? "一鍵複製色碼" : "一鍵複製"))}
    </button>
  );
}

export default function StrategyCard({ spot }: StrategyCardProps) {
  const multiLineCopy = spot.colors.map((c) => `${c.label}: ${c.hex}`).join("\n");

  return (
    <div className={`glass-card rounded-xl overflow-hidden border ${
      spot.isAuthorPick ? "border-[#00ff88]/40" : "border-white/5"
    }`}>
      <div className="p-4 md:p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">{spot.name}</h3>
            {spot.isAuthorPick && (
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30 flex items-center gap-1">
                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                作者推薦
              </span>
            )}
          </div>
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#00ff88]/15 text-[#00ff88]">
            成功率 {spot.successRate}%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="text-[10px] text-white/30 uppercase tracking-wider flex items-center gap-2">
              <span>躲藏者視角</span>
              <span className="text-[#00ff88]/60">● 已著色</span>
            </div>
            <div className="aspect-video rounded-lg bg-[#0a0a1a] flex items-center justify-center border border-white/5 overflow-hidden">
              {spot.hiderImage ? (
                <img src={spot.hiderImage} alt="躲藏者視角" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <div className="text-3xl mb-1">🦎</div>
                  <div className="text-[10px] text-white/30">{spot.colors[0]?.hex}</div>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] text-white/30 uppercase tracking-wider flex items-center gap-2">
              <span>抓人者視角</span>
              <span className="text-red-400/60">● 尋找中</span>
            </div>
            <div className="aspect-video rounded-lg bg-[#0a0a1a] flex items-center justify-center border border-white/5 overflow-hidden">
              {spot.seekerImage ? (
                <img src={spot.seekerImage} alt="抓人者視角" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <div className="text-3xl mb-1">🔍</div>
                  <div className="text-[10px] text-white/30">尋找破綻</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-xs text-white/50 leading-relaxed">{spot.description}</div>

          <div className="p-3 rounded-lg bg-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">
                色彩配方（{spot.colors.length} 層）
              </span>
              <CopyButton text={multiLineCopy} label="複製全部" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {spot.colors.map((c, i) => (
                <div key={i} className="flex items-center gap-2 bg-black/30 rounded-lg p-2">
                  <div className="w-7 h-7 rounded border border-white/10 flex-shrink-0" style={{ backgroundColor: c.hex }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-white/30">{c.label}</div>
                    <div className="text-xs font-mono font-bold text-white">{c.hex}</div>
                    <div className="text-[9px] font-mono text-white/30 truncate">RGB({c.rgb})</div>
                  </div>
                  <CopyButton text={c.hex} />
                </div>
              ))}
            </div>
          </div>

          {spot.styleNote && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-[#00ff88]/5 border border-[#00ff88]/10">
              <span className="text-sm mt-0.5">🎨</span>
              <div>
                <div className="text-[10px] text-[#00ff88]/60 uppercase tracking-wider font-semibold mb-1">筆刷模式建議</div>
                <div className="text-xs text-white/60">{spot.styleNote}</div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StarRating value={spot.stealthRating} label="隱匿性" />
          <StarRating value={spot.difficultyRating} label="畫工難度" />
        </div>

        <div className="flex items-center gap-2 pt-1 border-t border-white/5">
          <span className="text-[10px] text-white/30">發現者：</span>
          <a href={spot.discovererLink || "#"} target="_blank" rel="noopener noreferrer" className="text-xs text-[#00ff88] hover:underline">
            {spot.discoveredBy}
          </a>
        </div>
      </div>
    </div>
  );
}
