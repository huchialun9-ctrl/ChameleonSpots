"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { getRealMapById } from "@/data/real-maps";
import Link from "next/link";
import SpotPin from "@/components/SpotPin";
import StrategyCard from "@/components/StrategyCard";
import SpotSubmitter from "@/components/SpotSubmitter";
import OverlayToggle from "@/components/OverlayToggle";
import { useOverlay } from "@/lib/overlay-context";
import { StrategySpot } from "@/types";

export default function MapDetailPage() {
  const params = useParams();
  const map = getRealMapById(params.id as string);
  const { overlay } = useOverlay();
  const [activeSpot, setActiveSpot] = useState<string | null>(null);
  const [hoveredSpot, setHoveredSpot] = useState<StrategySpot | null>(null);
  const [showSubmitter, setShowSubmitter] = useState(false);
  const [isVerifiedAuthor, setIsVerifiedAuthor] = useState(() => {
    if (!map) return false;
    try { return !!localStorage.getItem(`author_${map.id}`); } catch { return false; }
  });
  const [authorPicks, setAuthorPicks] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem("authorPicks");
      if (stored) return new Set(JSON.parse(stored));
    } catch { /* ignore */ }
    return new Set();
  });

  if (!map) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🗺️</div>
        <h1 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>地圖不存在</h1>
        <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>請確認連結是否正確</p>
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold btn-primary">返回地圖牆</Link>
      </div>
    );
  }

  const handleSpotClick = (spotId: string) => {
    setActiveSpot((prev) => (prev === spotId ? null : spotId));
  };

  const handleAuthorVerify = () => {
    setIsVerifiedAuthor(true);
    localStorage.setItem(`author_${map.id}`, "true");
  };

  const toggleAuthorPick = (spotId: string) => {
    const next = new Set(authorPicks);
    if (next.has(spotId)) {
      next.delete(spotId);
    } else {
      if (next.size >= 3) { alert("最多只能選 3 個作者推薦點"); return; }
      next.add(spotId);
    }
    setAuthorPicks(next);
    localStorage.setItem("authorPicks", JSON.stringify([...next]));
  };

  const approvedSpots = map.spots.filter((s) => s.isApproved);

  const displayedSpots = approvedSpots.map((s) => ({
    ...s,
    isAuthorPick: authorPicks.has(s.id) || s.isAuthorPick,
  }));

  const activeSpotData = displayedSpots.find((s) => s.id === activeSpot) ?? null;

  if (overlay) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-deep)" }}>
        <OverlayToggle />
        <div className="flex-1 relative">
          <img src={map.overviewImage} alt={map.title} className="w-full h-full object-contain absolute inset-0" draggable={false} />
          {displayedSpots.map((spot) => (
            <SpotPin
              key={spot.id} spot={spot}
              isActive={activeSpot === spot.id}
              onClick={() => handleSpotClick(spot.id)}
              onHover={setHoveredSpot}
            />
          ))}
        </div>
        {activeSpotData && (
          <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6" style={{ background: "rgba(15,10,26,0.95)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="max-w-3xl mx-auto flex items-center gap-4 md:gap-6">
              <div className="flex-1 min-w-0">
                <h2 className="text-sm md:text-base font-bold text-white">{activeSpotData.name}</h2>
                <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "var(--text-secondary)" }}>{activeSpotData.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {activeSpotData.colors.map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <div className="w-3 h-3 rounded border border-white/10" style={{ backgroundColor: c.hex }} />
                      <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>{c.label}</span>
                      <code className="text-xs font-mono text-white font-bold">{c.hex}</code>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 flex flex-col gap-2">
                {activeSpotData.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => navigator.clipboard.writeText(c.hex).catch(() => {})}
                    className="px-6 py-3 rounded-xl text-sm font-bold btn-primary whitespace-nowrap"
                  >
                    複製 {c.hex}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OverlayToggle />

      <div className="flex items-center gap-3">
        <Link href="/" className="text-xs transition-colors" style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-pink)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
        >&larr; 地圖牆</Link>
        <span style={{ color: "rgba(255,255,255,0.08)" }}>/</span>
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{map.title}</span>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{map.title}</h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ background: "var(--accent-pink)", color: "#fff", boxShadow: "0 0 8px var(--glow-pink)" }}>{map.author.charAt(0).toUpperCase()}</div>
              <a href={map.authorLink} target="_blank" rel="noopener noreferrer"
                className="text-xs transition-colors"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-pink)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
              >{map.author}</a>
            </div>
            <span style={{ color: "rgba(255,255,255,0.08)" }}>|</span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{approvedSpots.length} 個躲藏點</span>
            <span style={{ color: "rgba(255,255,255,0.08)" }}>|</span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{map.subscribers.toLocaleString()} 人訂閱</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {map.tags.map((tag) => (
              <span key={tag} className="tag-badge" style={{ background: "rgba(255,255,255,0.04)", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.06)" }}>{tag}</span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isVerifiedAuthor && (
            <button onClick={handleAuthorVerify}
              className="px-3 py-2 rounded-lg text-xs font-semibold btn-secondary"
            >我是此地圖作者</button>
          )}
          {isVerifiedAuthor && (
            <span className="px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1"
              style={{ background: "rgba(244,114,182,0.15)", color: "var(--accent-pink)", border: "1px solid rgba(244,114,182,0.3)" }}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              已驗證作者
            </span>
          )}
          <a href={map.steamWorkshopUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold btn-primary"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
            前往 Steam 訂閱
          </a>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9]" style={{ background: "var(--bg-deep)" }}>
          <img src={map.overviewImage} alt={map.title} className="w-full h-full object-cover select-none" draggable={false} />
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg" style={{ background: "rgba(15,10,26,0.7)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="text-[10px] font-semibold" style={{ color: "var(--text-secondary)" }}>共 {displayedSpots.length} 個躲藏點 · 點擊紅點查看策略</span>
          </div>
          {displayedSpots.map((spot) => (
            <SpotPin key={spot.id} spot={spot} isActive={activeSpot === spot.id} onClick={() => handleSpotClick(spot.id)} onHover={setHoveredSpot} />
          ))}
          {hoveredSpot && !activeSpot && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-center max-w-xs"
              style={{ background: "rgba(15,10,26,0.85)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-sm font-semibold text-white">{hoveredSpot.name}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{hoveredSpot.description}</div>
            </div>
          )}
        </div>
      </div>

      {activeSpotData && (
        <div id="strategy-section">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>策略資料卡</h2>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{activeSpotData.name}</span>
            {isVerifiedAuthor && (
              <button onClick={() => toggleAuthorPick(activeSpotData.id)}
                className="ml-auto px-3 py-1 rounded-lg text-[10px] font-semibold transition-all"
                style={{
                  background: activeSpotData.isAuthorPick ? "rgba(244,114,182,0.15)" : "rgba(255,255,255,0.04)",
                  color: activeSpotData.isAuthorPick ? "var(--accent-pink)" : "var(--text-muted)",
                  border: `1px solid ${activeSpotData.isAuthorPick ? "rgba(244,114,182,0.3)" : "rgba(255,255,255,0.06)"}`,
                }}
              >
                {activeSpotData.isAuthorPick ? "★ 已選為作者推薦" : "☆ 設為作者推薦"}
              </button>
            )}
          </div>
          <StrategyCard spot={activeSpotData} />
        </div>
      )}

      {isVerifiedAuthor && (
        <div className="p-3 rounded-lg text-xs" style={{ background: "rgba(244,114,182,0.05)", border: "1px solid rgba(244,114,182,0.1)", color: "var(--text-secondary)" }}>
          您已驗證為此地圖作者。可在每個躲藏點點擊「設為作者推薦」來選出最多 3 個官方隱身點。
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedSpots.filter((s) => s.id !== activeSpot).map((spot) => (
          <button key={spot.id} onClick={() => handleSpotClick(spot.id)}
            className="text-left game-card rounded-xl p-4 transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-white">{spot.name}</span>
                {spot.isAuthorPick && <span className="text-[9px]" style={{ color: "var(--accent-pink)" }}>★</span>}
              </div>
              <span className="text-[10px] font-bold" style={{ color: "var(--accent-green)" }}>{spot.successRate}%</span>
            </div>
            <p className="text-xs line-clamp-2" style={{ color: "var(--text-secondary)" }}>{spot.description}</p>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => setShowSubmitter(!showSubmitter)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold btn-secondary"
        >{showSubmitter ? "收起投稿表單" : "📌 提交新躲藏點"}</button>
      </div>

      {showSubmitter && <SpotSubmitter mapTitle={map.title} mapId={map.id} />}

      <div className="fixed bottom-4 right-4 z-40 hidden md:block">
        <a href="https://store.steampowered.com" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition-all shadow-lg"
          style={{ background: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.06)", color: "var(--text-muted)" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(244,114,182,0.3)"; e.currentTarget.style.color = "var(--text-primary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "var(--text-muted)"; }}
        >
          <span className="w-5 h-5 rounded flex items-center justify-center text-[10px]"
            style={{ background: "rgba(244,114,182,0.2)" }}>🎮</span>
          <span>Project Spectrum 願望清單 <span style={{ color: "var(--accent-pink)" }}>+122</span></span>
        </a>
      </div>
    </div>
  );
}
