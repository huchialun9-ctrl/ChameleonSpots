"use client";

import { useState, useMemo } from "react";
import { realMaps, realMapTags } from "@/data/real-maps";
import { SortMode } from "@/types";
import FilterPanel from "@/components/FilterPanel";
import MapCard from "@/components/MapCard";
import OverlayToggle from "@/components/OverlayToggle";
import { useOverlay } from "@/lib/overlay-context";

export default function Home() {
  const { overlay } = useOverlay();
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sort, setSort] = useState<SortMode>("popularity");

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filtered = useMemo(() => {
    let result = [...realMaps];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((m) =>
        m.title.toLowerCase().includes(q) || m.author.toLowerCase().includes(q)
      );
    }
    if (selectedTags.length > 0) {
      result = result.filter((m) => selectedTags.some((tag) => m.tags.includes(tag)));
    }
    switch (sort) {
      case "popularity": result.sort((a, b) => b.popularity - a.popularity); break;
      case "newest": result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case "spots": result.sort((a, b) => b.spotCount - a.spotCount); break;
    }
    return result;
  }, [search, selectedTags, sort]);

  const totalSpots = realMaps.reduce((s, m) => s + m.spots.length, 0);

  if (overlay) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] gap-4">
        <OverlayToggle />
        <div className="text-5xl">🗺️</div>
        <p className="text-sm text-white/40">開台模式中 — 請先選擇一張地圖</p>
        <p className="text-xs text-white/20">點擊右上角按鈕離開開台模式</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OverlayToggle />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">社群工作坊地圖牆</h1>
          <p className="text-sm text-white/40 mt-1">
            已收錄 {realMaps.length} 張 Steam 真實地圖，共 {totalSpots} 個黃金躲藏點
          </p>
        </div>
      </div>

      <FilterPanel
        search={search} onSearchChange={setSearch}
        selectedTags={selectedTags} onTagToggle={toggleTag}
        sort={sort} onSortChange={setSort}
        availableTags={realMapTags}
      />

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-white/40 text-sm">沒有符合條件的地圖</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((map) => <MapCard key={map.id} map={map} />)}
        </div>
      )}
    </div>
  );
}
