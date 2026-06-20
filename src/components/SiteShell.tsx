"use client";

import { useOverlay } from "@/lib/overlay-context";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const { overlay } = useOverlay();

  if (overlay) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <HeroBanner />
          {children}
        </div>
      </main>
      <footer className="py-6 mt-12" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg drop-shadow-[0_0_8px_rgba(244,114,182,0.3)]">🦎</span>
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>ChameleonSpots &mdash; 非官方社群策略圖鑑</span>
            </div>
            <div className="flex items-center gap-4 text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>
              <span>本網站與 MECCHA CHAMELEON 開發團隊無關聯</span>
              <span>|</span>
              <a href="/admin" className="transition-colors" style={{ color: "rgba(255,255,255,0.15)" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-pink)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.15)"}
              >管理後台</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
