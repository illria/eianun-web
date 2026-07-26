import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "泥伏雷闯关记 · 出海金融第一站",
  description: "把跨境金融、海外账户、加密资产与通讯工具整理成一张可执行的路线图。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
