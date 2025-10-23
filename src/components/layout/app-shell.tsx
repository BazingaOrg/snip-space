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
        "relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-8 px-6 py-16 sm:px-10",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[36px] border border-white/10 bg-glass shadow-elevation-md backdrop-blur-[60px]" />
      <div className="relative flex flex-1 flex-col justify-between px-4 py-6 sm:px-10 sm:py-12">
        {children}
      </div>
    </div>
  );
}
