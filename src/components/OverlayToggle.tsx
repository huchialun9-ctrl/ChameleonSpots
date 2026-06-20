"use client";

import { useOverlay } from "@/lib/overlay-context";

export default function OverlayToggle() {
  const { overlay, setOverlay } = useOverlay();

  return (
    <button
      onClick={() => setOverlay(!overlay)}
      className={`fixed z-[60] flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
        overlay
          ? "top-4 right-4 bg-red-500/20 border-red-400/30 text-red-400"
          : "top-20 right-4 bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
      }`}
      title={overlay ? "離開開台模式" : "開台模式 / 第二螢幕"}
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
      {overlay ? "離開開台模式" : "開台模式"}
    </button>
  );
}
