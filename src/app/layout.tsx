import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { OverlayProvider } from "@/lib/overlay-context";
import SiteShell from "@/components/SiteShell";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChameleonSpots — MECCHA CHAMELEON 社群工作坊圖鑑",
  description: "收錄 MECCHA CHAMELEON Steam 工作坊自訂地圖的黃金躲藏點位、色碼配方與策略指南。",
  keywords: ["MECCHA CHAMELEON", "Steam 工作坊", "變色龍", "躲貓貓", "色碼", "遊戲攻略"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col scrollbar-thin">
        <OverlayProvider>
          <SiteShell>{children}</SiteShell>
        </OverlayProvider>
      </body>
    </html>
  );
}
