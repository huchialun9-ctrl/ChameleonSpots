"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🦎</span>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-[#00ff88]">Chameleon</span>
              <span className="text-white/70">Spots</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-white/60 hover:text-[#00ff88] transition-colors"
            >
              地圖牆
            </Link>
            <Link
              href="/"
              className="text-sm text-white/60 hover:text-[#00ff88] transition-colors"
            >
              投稿地圖
            </Link>
            <Link
              href="/"
              className="text-sm text-white/60 hover:text-[#00ff88] transition-colors"
            >
              聯絡我們
            </Link>
            <Link
              href="/admin"
              className="text-[10px] text-white/20 hover:text-white/40 transition-colors"
            >
              Admin
            </Link>
            <select
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/70 cursor-pointer"
              defaultValue="zh"
            >
              <option value="zh">中文</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          <button
            className="md:hidden text-white/60 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            <Link href="/" className="text-sm text-white/60 hover:text-[#00ff88]">地圖牆</Link>
            <Link href="/" className="text-sm text-white/60 hover:text-[#00ff88]">投稿地圖</Link>
            <Link href="/" className="text-sm text-white/60 hover:text-[#00ff88]">聯絡我們</Link>
            <Link href="/admin" className="text-xs text-white/30 hover:text-white/50">Admin</Link>
            <select
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/70 w-fit"
              defaultValue="zh"
            >
              <option value="zh">中文</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
          </div>
        )}
      </div>
    </nav>
  );
}
