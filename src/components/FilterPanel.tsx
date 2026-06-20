"use client";

import { SortMode } from "@/types";

interface FilterPanelProps {
  search: string;
  onSearchChange: (v: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  sort: SortMode;
  onSortChange: (v: SortMode) => void;
  availableTags: string[];
}

const tagColors: Record<string, string> = {
  "官方內建": "var(--accent-yellow)",
  "室內": "var(--accent-pink)",
  "室外": "var(--accent-green)",
  "迷宮": "var(--accent-purple)",
};

export default function FilterPanel({
  search, onSearchChange, selectedTags, onTagToggle, sort, onSortChange, availableTags,
}: FilterPanelProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: "var(--text-muted)" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="搜尋地圖名稱或作者..."
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "var(--text-primary)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "rgba(244,114,182,0.3)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
          }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => {
          const active = selectedTags.includes(tag);
          const color = tagColors[tag] || "var(--accent-pink)";
          return (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className="tag-badge transition-all"
              style={{
                background: active ? `${color}20` : "rgba(255,255,255,0.04)",
                color: active ? color : "var(--text-muted)",
                border: `1px solid ${active ? `${color}40` : "rgba(255,255,255,0.06)"}`,
              }}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>排序：</span>
        <div className="flex gap-1">
          {([
            { value: "popularity", label: "熱門度" },
            { value: "newest", label: "最新上架" },
            { value: "spots", label: "躲藏點數量" },
          ] as { value: SortMode; label: string }[]).map((opt) => {
            const active = sort === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onSortChange(opt.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: active ? "rgba(244,114,182,0.15)" : "rgba(255,255,255,0.04)",
                  color: active ? "var(--accent-pink)" : "var(--text-muted)",
                  border: `1px solid ${active ? "rgba(244,114,182,0.3)" : "rgba(255,255,255,0.06)"}`,
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
