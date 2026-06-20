"use client";

import { useOverlay } from "@/lib/overlay-context";

export default function OverlayToggle() {
  const { overlay, setOverlay } = useOverlay();

  return (
    <button
      onClick={() => setOverlay(!overlay)}
      className="fixed z-[60] flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
      style={{
        background: overlay ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${overlay ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.06)"}`,
        color: overlay ? "#ef4444" : "var(--text-muted)",
        top: overlay ? "1rem" : "5rem",
        right: "1rem",
      }}
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
