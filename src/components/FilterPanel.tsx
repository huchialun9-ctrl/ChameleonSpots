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

export default function FilterPanel({
  search,
  onSearchChange,
  selectedTags,
  onTagToggle,
  sort,
  onSortChange,
  availableTags,
}: FilterPanelProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"
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
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white/80 placeholder-white/30 outline-none focus:border-[#00ff88]/40 focus:bg-white/[0.07] transition-all"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => {
          const active = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                active
                  ? "bg-[#00ff88]/15 border-[#00ff88]/40 text-[#00ff88]"
                  : "bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-white/40">排序：</span>
        <div className="flex gap-1">
          {([
            { value: "popularity", label: "熱門度" },
            { value: "newest", label: "最新上架" },
            { value: "spots", label: "躲藏點數量" },
          ] as { value: SortMode; label: string }[]).map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSortChange(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                sort === opt.value
                  ? "bg-[#00ff88]/15 border-[#00ff88]/40 text-[#00ff88]"
                  : "bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
