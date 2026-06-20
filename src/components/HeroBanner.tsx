import Image from "next/image";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2d1b4e] via-[#1a1040] to-[#0f0a2a] border border-[var(--accent-purple)]/20">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-[var(--accent-pink)] blur-3xl" />
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-[var(--accent-green)] blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[var(--accent-purple)] blur-3xl" />
      </div>
      <div className="relative flex flex-col md:flex-row items-stretch">
        <div className="flex items-center gap-4 p-4 md:p-6 flex-1">
          <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-xl overflow-hidden border-2 border-[var(--accent-pink)]/30 flex-shrink-0 shadow-lg shadow-[var(--glow-pink)]">
            <Image
              src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4704690/18d14b8bd834e30a6a25df5ccd7f0a6e644f1577/capsule_231x87.jpg"
              alt="MECCHA CHAMELEON"
              width={231}
              height={87}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-[var(--accent-yellow)] tracking-wider uppercase bg-[var(--accent-yellow)]/10 px-2 py-0.5 rounded-full">
                Steam 工作坊策略圖鑑
              </span>
              <span className="text-[10px] text-[var(--accent-green)] font-semibold">v1.0</span>
            </div>
            <h1 className="text-base md:text-xl font-bold text-white leading-tight drop-shadow-[0_0_10px_rgba(244,114,182,0.3)]">
              MECCHA CHAMELEON
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              收錄 20 張 Steam 工作坊地圖、超過 100 個黃金躲藏點位與色碼配方
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://store.steampowered.com/app/4704690"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg btn-primary text-xs"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                在 Steam 上查看
              </a>
              <a
                href="https://steamcommunity.com/app/4704690/workshop/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg btn-secondary text-xs"
              >
                瀏覽工作坊
              </a>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 px-5 border-l border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20 flex items-center justify-center">
              <span className="text-xs">🦎</span>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-[var(--text-muted)]">已收錄地圖</div>
              <div className="text-sm font-bold text-[var(--accent-green)]">20</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
