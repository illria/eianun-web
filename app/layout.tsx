import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EIANUN Field Guide · 出海行动指南",
  description: "把海外账户、支付、资产与通讯拆成清晰、可执行的下一步。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
