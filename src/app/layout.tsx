import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "sonner";

import { cn } from "@/lib/utils";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Snipspace",
  description: "Snipspace 是一款融入 macOS 2026 风格的知识 Dock，随手收集文字、链接与媒体。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased transition-colors duration-300",
          inter.variable,
        )}
      >
        <div className="relative flex min-h-screen flex-col">{children}</div>
        <Toaster position="top-right" richColors toastOptions={{ className: "backdrop-blur-[18px] bg-white/80 text-foreground" }} />
      </body>
    </html>
  );
}
