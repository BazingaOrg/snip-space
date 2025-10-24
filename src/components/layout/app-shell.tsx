import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AppShellProps {
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * High-level layout wrapper that applies the macOS-inspired background layering.
 */
export function AppShell({ children, className }: AppShellProps) {
  return (
    <div
      className={cn(
        "relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-8 px-4 py-14 pb-24 sm:gap-10 sm:px-10 sm:py-16 lg:px-12",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[40px] border border-white/18 bg-glass shadow-elevation-md backdrop-blur-[48px]" />
      <div className="pointer-events-none absolute inset-0 rounded-[40px] bg-gradient-to-br from-white/55 via-white/20 to-white/6" />
      <div className="relative flex flex-1 flex-col justify-between px-4 py-6 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
        {children}
      </div>
    </div>
  );
}
