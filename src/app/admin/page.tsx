"use client";

import { useState } from "react";
import { PendingSpot } from "@/types";
import Link from "next/link";

export default function AdminPage() {
  const [spots, setSpots] = useState<PendingSpot[]>(() => {
    try {
      const raw = localStorage.getItem("pendingSpots");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch { /* ignore */ }
    return [];
  });
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);

  const ADMIN_PW = "chameleon2026";

  const handleApprove = (id: string) => {
    setSpots((prev) => {
      const updated = prev.map((s) => s.id === id ? { ...s, isApproved: true } : s);
      try { localStorage.setItem("pendingSpots", JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const handleReject = (id: string) => {
    setSpots((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      try { localStorage.setItem("pendingSpots", JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const pending = spots.filter((s) => !s.isApproved);
  const approvedCount = spots.filter((s) => s.isApproved).length;

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto py-20">
        <div className="game-card rounded-xl p-6 text-center space-y-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="text-3xl">🔐</div>
          <h1 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>管理員後台</h1>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="請輸入管理密碼"
            className="w-full px-3 py-2 rounded-lg text-sm text-center outline-none transition-all"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "var(--text-primary)",
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = "rgba(244,114,182,0.3)"}
            onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
            onKeyDown={(e) => e.key === "Enter" && password === ADMIN_PW && setAuthed(true)}
          />
          <button onClick={() => password === ADMIN_PW && setAuthed(true)}
            className="w-full px-4 py-2 rounded-xl text-sm font-semibold btn-primary"
          >登入</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>管理後台</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>待審核 {pending.length} 筆 · 已核准 {approvedCount} 筆</p>
        </div>
        <Link href="/" className="text-xs transition-colors"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-pink)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
        >&larr; 返回網站</Link>
      </div>

      {pending.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">✅</div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>目前沒有待審核的躲藏點</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((spot) => (
            <div key={spot.id} className="game-card rounded-xl overflow-hidden" style={{ borderColor: "rgba(251,191,36,0.2)" }}>
              <div className="p-4 md:p-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">{spot.name}</h3>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
                      地圖：{spot.mapTitle} · 投稿者：{spot.discoveredBy}
                    </p>
                  </div>
                  <span className="tag-badge flex-shrink-0"
                    style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.2)" }}
                  >待審核</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {spot.seekerImage && (
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>抓人者視角 · 空景</div>
                      <div className="relative aspect-video rounded-lg overflow-hidden" style={{ background: "var(--bg-deep)", border: "1px solid rgba(255,255,255,0.04)" }}>
                        <img src={spot.seekerImage} alt="空景" className="w-full h-full object-cover" />
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-mono" style={{ background: "rgba(15,10,26,0.8)", color: "var(--accent-green)" }}>
                          x:{spot.position.x}% y:{spot.position.y}%
                        </div>
                        <div className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-red-400 bg-red-500/50 pointer-events-none"
                          style={{ left: `${spot.position.x}%`, top: `${spot.position.y}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {spot.hiderImage && (
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>躲藏者視角 · 已著色</div>
                      <div className="relative aspect-video rounded-lg overflow-hidden" style={{ background: "var(--bg-deep)", border: "1px solid rgba(255,255,255,0.04)" }}>
                        <img src={spot.hiderImage} alt="著色" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>色彩配方</div>
                    {spot.colors.map((c, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded border border-white/10 flex-shrink-0" style={{ backgroundColor: c.hex }} />
                        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{c.label}:</span>
                        <code className="text-xs font-mono" style={{ color: "var(--text-primary)" }}>{c.hex}</code>
                      </div>
                    ))}
                    {spot.styleNote && <div className="text-[10px] italic mt-2" style={{ color: "var(--text-muted)" }}>🎨 {spot.styleNote}</div>}
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>描述</div>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{spot.description || "無描述"}</p>
                    <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>投稿時間：{new Date(spot.submittedAt).toLocaleString("zh-TW")}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  <button onClick={() => handleApprove(spot.id)}
                    className="px-4 py-1.5 rounded-xl text-xs font-semibold btn-primary"
                  >✓ 核准發布</button>
                  <button onClick={() => handleReject(spot.id)}
                    className="px-4 py-1.5 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}
                  >✕ 拒絕刪除</button>
                  <a href={spot.discovererLink || "#"} target="_blank" rel="noopener noreferrer"
                    className="ml-auto text-[10px] transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                  >{spot.discovererLink ? "投稿者連結 →" : "無連結"}</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
