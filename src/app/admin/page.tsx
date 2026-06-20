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
        <div className="glass-card rounded-xl p-6 border border-white/5 text-center space-y-4">
          <div className="text-3xl">🔐</div>
          <h1 className="text-lg font-bold text-white">管理員後台</h1>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="請輸入管理密碼"
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/80 placeholder-white/30 outline-none focus:border-[#00ff88]/40 text-center"
            onKeyDown={(e) => e.key === "Enter" && password === ADMIN_PW && setAuthed(true)}
          />
          <button onClick={() => password === ADMIN_PW && setAuthed(true)}
            className="w-full px-4 py-2 rounded-lg text-sm font-semibold bg-[#00ff88] text-black hover:bg-[#00ff70] transition-all"
          >登入</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">管理後台</h1>
          <p className="text-sm text-white/40 mt-1">待審核 {pending.length} 筆 · 已核准 {approvedCount} 筆</p>
        </div>
        <Link href="/" className="text-xs text-white/30 hover:text-[#00ff88] transition-colors">&larr; 返回網站</Link>
      </div>

      {pending.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">✅</div>
          <p className="text-sm text-white/40">目前沒有待審核的躲藏點</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((spot) => (
            <div key={spot.id} className="glass-card rounded-xl overflow-hidden border border-yellow-400/20">
              <div className="p-4 md:p-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">{spot.name}</h3>
                    <p className="text-[11px] text-white/40 mt-0.5">
                      地圖：{spot.mapTitle} · 投稿者：{spot.discoveredBy}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-yellow-400/15 text-yellow-300/80 border border-yellow-400/20 flex-shrink-0">待審核</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {spot.seekerImage && (
                    <div className="space-y-1">
                      <div className="text-[10px] text-white/30 uppercase tracking-wider">抓人者視角 · 空景</div>
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-[#0a0a1a] border border-white/5">
                        <img src={spot.seekerImage} alt="空景" className="w-full h-full object-cover" />
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/70 text-[#00ff88]">
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
                      <div className="text-[10px] text-white/30 uppercase tracking-wider">躲藏者視角 · 已著色</div>
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-[#0a0a1a] border border-white/5">
                        <img src={spot.hiderImage} alt="著色" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="text-[10px] text-white/30 uppercase tracking-wider">色彩配方</div>
                    {spot.colors.map((c, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded border border-white/10 flex-shrink-0" style={{ backgroundColor: c.hex }} />
                        <span className="text-xs text-white/60">{c.label}:</span>
                        <code className="text-xs font-mono text-white/80">{c.hex}</code>
                      </div>
                    ))}
                    {spot.styleNote && <div className="text-[10px] text-white/40 italic mt-2">🎨 {spot.styleNote}</div>}
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] text-white/30 uppercase tracking-wider">描述</div>
                    <p className="text-xs text-white/50">{spot.description || "無描述"}</p>
                    <div className="text-[10px] text-white/30">投稿時間：{new Date(spot.submittedAt).toLocaleString("zh-TW")}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <button onClick={() => handleApprove(spot.id)}
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#00ff88] text-black hover:bg-[#00ff70] transition-all"
                  >✓ 核准發布</button>
                  <button onClick={() => handleReject(spot.id)}
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold border border-red-400/30 text-red-400/70 hover:bg-red-400/10 transition-all"
                  >✕ 拒絕刪除</button>
                  <a href={spot.discovererLink || "#"} target="_blank" rel="noopener noreferrer"
                    className="ml-auto text-[10px] text-white/30 hover:text-white/50"
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
