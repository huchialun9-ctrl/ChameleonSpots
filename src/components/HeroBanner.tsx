export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-xl border border-[#2a3a4a] bg-gradient-to-r from-[#1b2838] to-[#1f3345]">
      <div className="flex flex-col md:flex-row items-stretch">
        <div className="flex items-center gap-4 p-4 md:p-5 flex-1">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border border-white/10 bg-[#0f1a24] flex-shrink-0">
            <div className="w-full h-full flex items-center justify-center text-3xl">
              🦎
            </div>
          </div>

          <div className="flex items-center justify-center text-2xl text-white/20 font-bold flex-shrink-0 px-2">
            +
          </div>

          <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border border-white/10 bg-[#0f1a24] flex-shrink-0">
            <div className="w-full h-full flex items-center justify-center text-3xl">
              🎮
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-[#66c0f4] font-semibold tracking-wider uppercase mb-0.5">
              社群自製同捆包推廣
            </div>
            <h2 className="text-sm md:text-base font-bold text-white leading-tight">
              Project Spectrum + MECCHA CHAMELEON
            </h2>
            <p className="text-xs text-white/40 mt-1 line-clamp-2">
              購買組合包即享 10% 折扣！同一開發團隊的兩款色彩機制遊戲一次收藏。
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://store.steampowered.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#66c0f4] text-[#1b2838] text-xs font-bold hover:bg-[#7ac5f5] transition-all"
              >
                加入願望清單
              </a>
              <span className="text-[10px] text-white/20">
                即將推出
              </span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 px-5 border-l border-[#2a3a4a] bg-[#1b2838]/50">
          <div className="text-right">
            <div className="text-[10px] text-white/30">MECCHA CHAMELEON</div>
            <div className="text-[10px] text-white/50 font-semibold">4704690</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#66c0f4]/10 border border-[#66c0f4]/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#66c0f4]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
