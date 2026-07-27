import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EIANUN · 出海金融行动指南",
  description: "从网络、海外账户、港美股、加密 Web3 到资产保管的完整行动路线与工具库。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
