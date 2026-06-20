"use client";

import { useRef, useState, useEffect } from "react";
import { PendingSpot, ColorLayer } from "@/types";

interface SpotSubmitterProps {
  mapTitle: string;
  mapId: string;
}

export default function SpotSubmitter({ mapTitle, mapId }: SpotSubmitterProps) {
  const [clickCoord, setClickCoord] = useState<{ x: number; y: number } | null>(null);
  const [seekerFile, setSeekerFile] = useState<File | null>(null);
  const [seekerPreview, setSeekerPreview] = useState<string | null>(null);
  const [hiderFile, setHiderFile] = useState<File | null>(null);
  const [hiderPreview, setHiderPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    discoveredBy: "",
    discovererLink: "",
    description: "",
    styleNote: "",
  });
  const [colorLayers, setColorLayers] = useState<ColorLayer[]>([
    { label: "底色", hex: "", rgb: "" },
  ]);
  const [submitted, setSubmitted] = useState(false);
  const seekerInputRef = useRef<HTMLInputElement>(null);
  const hiderInputRef = useRef<HTMLInputElement>(null);
  const submittedRef = useRef(false);

  useEffect(() => {
    return () => { submittedRef.current = true; };
  }, []);

  const validateFile = (file: File): boolean => {
    if (file.size > 10 * 1024 * 1024) { alert("圖片不能超過 10MB"); return false; }
    if (!file.type.startsWith("image/")) { alert("請上傳圖片檔案"); return false; }
    return true;
  };

  const handleSeekerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSeekerFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setSeekerPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleHiderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setHiderFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setHiderPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addColorLayer = () => {
    setColorLayers((prev) => [...prev, { label: `圖層 ${prev.length + 1}`, hex: "", rgb: "" }]);
  };

  const updateColorLayer = (index: number, field: keyof ColorLayer, value: string) => {
    setColorLayers((prev) => {
      const next = [...prev];
      if (field === "hex") {
        const cleaned = value.replace("#", "").toUpperCase();
        next[index] = { ...next[index], hex: `#${cleaned}` };
        if (cleaned.length === 6) {
          const r = parseInt(cleaned.slice(0, 2), 16);
          const g = parseInt(cleaned.slice(2, 4), 16);
          const b = parseInt(cleaned.slice(4, 6), 16);
          if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
            next[index].rgb = `${r}, ${g}, ${b}`;
          }
        } else {
          next[index].rgb = "";
        }
      } else {
        next[index] = { ...next[index], [field]: value };
      }
      return next;
    });
  };

  const removeColorLayer = (index: number) => {
    setColorLayers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clickCoord) { alert("請先在地圖上點擊標記位置"); return; }
    if (!seekerFile) { alert("請上傳抓人者看到的空景截圖"); return; }
    if (!hiderFile) { alert("請上傳你著色後的隱身截圖"); return; }

    const spot: PendingSpot = {
      id: `pending-${crypto.randomUUID()}`,
      mapId,
      mapTitle,
      name: formData.name,
      position: clickCoord,
      colors: colorLayers.filter((c) => c.hex.length > 1),
      styleNote: formData.styleNote,
      description: formData.description,
      discoveredBy: formData.discoveredBy || "匿名玩家",
      discovererLink: formData.discovererLink,
      hiderImage: hiderPreview || undefined,
      seekerImage: seekerPreview || undefined,
      submittedAt: new Date().toISOString(),
      isApproved: false,
    };

    let existing: PendingSpot[] = [];
    try {
      const raw = localStorage.getItem("pendingSpots");
      if (raw) existing = JSON.parse(raw);
      if (!Array.isArray(existing)) existing = [];
    } catch {
      existing = [];
    }

    existing.push(spot);
    try {
      localStorage.setItem("pendingSpots", JSON.stringify(existing));
    } catch {
      alert("儲存空間已滿，請先清理後台審核過的項目再提交");
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      if (!submittedRef.current) setSubmitted(false);
    }, 3000);
    resetForm();
  };

  const resetForm = () => {
    setClickCoord(null);
    setSeekerFile(null);
    setSeekerPreview(null);
    setHiderFile(null);
    setHiderPreview(null);
    setFormData({ name: "", discoveredBy: "", discovererLink: "", description: "", styleNote: "" });
    setColorLayers([{ label: "底色", hex: "", rgb: "" }]);
  };

  return (
    <div className="game-card rounded-xl overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
      <div className="p-4 md:p-5 space-y-4">
        <div>
          <h3 className="text-base font-bold text-white">📌 提交新躲藏點</h3>
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
            上傳你在遊戲中的真實截圖，標記位置後送出。提交後需經管理員審核。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="relative aspect-video rounded-lg border-2 border-dashed transition-all cursor-pointer overflow-hidden"
            style={{
              borderColor: seekerPreview ? "rgba(244,114,182,0.4)" : "rgba(255,255,255,0.1)",
            }}
            onClick={() => seekerInputRef.current?.click()}
          >
            {seekerPreview ? (
              <>
                <img src={seekerPreview} alt="抓人者空景" className="w-full h-full object-cover" />
                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px]" style={{ background: "rgba(15,10,26,0.8)", color: "var(--text-secondary)" }}>
                  抓人者視角 · 空景
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setSeekerFile(null); setSeekerPreview(null); }}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center"
                  style={{ background: "rgba(15,10,26,0.6)", color: "var(--text-muted)" }}
                >
                  ✕
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <svg className="w-8 h-8 mb-2" style={{ color: "rgba(255,255,255,0.15)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>上傳抓人者看到的空景.jpg</div>
                <div className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.15)" }}>遊戲內截圖，無人、無 UI</div>
              </div>
            )}
            <input ref={seekerInputRef} type="file" accept="image/*" className="hidden" onChange={handleSeekerUpload} />
          </div>

          <div
            className="relative aspect-video rounded-lg border-2 border-dashed transition-all cursor-pointer overflow-hidden"
            style={{
              borderColor: hiderPreview ? "rgba(244,114,182,0.4)" : "rgba(255,255,255,0.1)",
            }}
            onClick={() => hiderInputRef.current?.click()}
          >
            {hiderPreview ? (
              <>
                <img src={hiderPreview} alt="躲藏者著色" className="w-full h-full object-cover" />
                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px]" style={{ background: "rgba(15,10,26,0.8)", color: "var(--text-secondary)" }}>
                  躲藏者視角 · 已著色
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setHiderFile(null); setHiderPreview(null); }}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center"
                  style={{ background: "rgba(15,10,26,0.6)", color: "var(--text-muted)" }}
                >
                  ✕
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <svg className="w-8 h-8 mb-2" style={{ color: "rgba(255,255,255,0.15)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>上傳你著色隱身後的截圖.jpg</div>
                <div className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.15)" }}>遊戲內截圖，已融入背景</div>
              </div>
            )}
            <input ref={hiderInputRef} type="file" accept="image/*" className="hidden" onChange={handleHiderUpload} />
          </div>
        </div>

        <hr style={{ borderColor: "rgba(255,255,255,0.04)" }} />

        <div
          className="relative w-full aspect-[16/7] rounded-lg overflow-hidden cursor-crosshair"
          style={{ background: "var(--bg-deep)", border: "1px solid rgba(255,255,255,0.06)" }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = Math.round(((e.clientX - rect.left) / rect.width) * 1000) / 10;
            const y = Math.round(((e.clientY - rect.top) / rect.height) * 1000) / 10;
            setClickCoord({ x, y });
          }}
        >
          {seekerPreview && (
            <img src={seekerPreview} alt="標記底圖" className="w-full h-full object-cover pointer-events-none select-none" draggable={false} />
          )}
          {!seekerPreview && (
            <div className="absolute inset-0 flex items-center justify-center text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>
              請先上傳空景截圖作為標記底圖
            </div>
          )}
          {clickCoord && (
            <div className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ left: `${clickCoord.x}%`, top: `${clickCoord.y}%` }}>
              <div className="w-full h-full rounded-full border-2 animate-pulse"
                style={{ borderColor: "var(--accent-pink)", background: "rgba(244,114,182,0.3)" }}
              />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono px-1.5 py-0.5 rounded"
                style={{ background: "rgba(15,10,26,0.8)", color: "var(--accent-green)" }}
              >
                x:{clickCoord.x}% y:{clickCoord.y}%
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.04)" }}>
            <span style={{ color: "var(--text-muted)" }}>座標</span>
            <code className="font-mono" style={{ color: "var(--accent-green)" }}>{clickCoord ? `x: ${clickCoord.x}%  y: ${clickCoord.y}%` : "尚未標記"}</code>
            {clickCoord && (
              <button type="button" onClick={() => setClickCoord(null)} className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>重新標記</button>
            )}
          </div>

          <input
            type="text" placeholder="躲藏點名稱（如：沙發後方角落）"
            value={formData.name}
            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "var(--text-primary)",
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = "rgba(244,114,182,0.3)"}
            onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
            required
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)" }}>色彩配方（多色圖層）</span>
              <button type="button" onClick={addColorLayer} className="text-[10px] transition-colors" style={{ color: "var(--accent-pink)" }}>+ 新增圖層</button>
            </div>
            {colorLayers.map((layer, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="text" placeholder="名稱" value={layer.label} onChange={(e) => updateColorLayer(i, "label", e.target.value)}
                  className="w-20 px-2 py-1.5 rounded-lg text-xs outline-none transition-all"
                  style={{ background: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "rgba(244,114,182,0.3)"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"} />
                <input type="text" placeholder="#HEX" value={layer.hex} onChange={(e) => updateColorLayer(i, "hex", e.target.value)}
                  className="w-24 px-2 py-1.5 rounded-lg text-xs font-mono outline-none transition-all"
                  style={{ background: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.06)", color: "var(--text-primary)" }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "rgba(244,114,182,0.3)"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"} />
                {layer.hex && layer.hex.length > 1 && <div className="w-6 h-6 rounded border border-white/10 flex-shrink-0" style={{ backgroundColor: layer.hex }} />}
                {colorLayers.length > 1 && (
                  <button type="button" onClick={() => removeColorLayer(i)} className="text-xs flex-shrink-0" style={{ color: "rgba(255,255,255,0.15)" }}>✕</button>
                )}
              </div>
            ))}
          </div>

          <textarea placeholder="筆刷模式建議（例如：使用 3 號畫筆以 45 度斜角畫出木紋條紋）"
            value={formData.styleNote} onChange={(e) => setFormData((p) => ({ ...p, styleNote: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all resize-none h-16"
            style={{ background: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.06)", color: "var(--text-primary)" }}
            onFocus={(e) => e.currentTarget.style.borderColor = "rgba(244,114,182,0.3)"}
            onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="你的暱稱（顯示於貢獻者欄）" value={formData.discoveredBy}
              onChange={(e) => setFormData((p) => ({ ...p, discoveredBy: e.target.value }))}
              className="px-3 py-2 rounded-lg text-sm outline-none transition-all"
              style={{ background: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.06)", color: "var(--text-primary)" }}
              onFocus={(e) => e.currentTarget.style.borderColor = "rgba(244,114,182,0.3)"}
              onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"} required />
            <input type="url" placeholder="社群連結（Twitch / YouTube / X）" value={formData.discovererLink}
              onChange={(e) => setFormData((p) => ({ ...p, discovererLink: e.target.value }))}
              className="px-3 py-2 rounded-lg text-sm outline-none transition-all"
              style={{ background: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.06)", color: "var(--text-primary)" }}
              onFocus={(e) => e.currentTarget.style.borderColor = "rgba(244,114,182,0.3)"}
              onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"} />
          </div>

          <textarea placeholder="躲藏策略描述..."
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all resize-none h-20"
            style={{ background: "var(--bg-elevated)", border: "1px solid rgba(255,255,255,0.06)", color: "var(--text-primary)" }}
            onFocus={(e) => e.currentTarget.style.borderColor = "rgba(244,114,182,0.3)"}
            onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
          />

          <div className="flex items-center gap-3">
            <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-semibold btn-primary">提交待審核</button>
            <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "var(--text-muted)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent-yellow)" }} />提交後需管理員核准
            </div>
          </div>

          {submitted && (
            <div className="flex items-center gap-2 p-3 rounded-lg text-xs"
              style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", color: "#fbbf24" }}
            >
              <span>⏳</span><span>提交成功！管理員審核通過後將顯示在地圖上。</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
