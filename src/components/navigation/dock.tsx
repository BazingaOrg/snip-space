"use client";
import { dockItems } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useViewStore } from "@/stores/view-store";

export function Dock() {
  const activeView = useViewStore((state) => state.activeView);
  const setActiveView = useViewStore((state) => state.setActiveView);

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-3 sm:bottom-8 sm:px-4">
      <div className="pointer-events-auto flex w-full max-w-[760px] flex-wrap items-center justify-center gap-2 rounded-[28px] border border-border/60 bg-surface/90 px-3 py-3 shadow-elevation-sm backdrop-blur-[32px] backdrop-saturate-[180%] animate-fade-up supports-[backdrop-filter]:bg-surface/70 sm:flex-nowrap sm:gap-3 sm:rounded-[32px] sm:px-5">
        {dockItems.map((item) => {
          const isActive = item.id === activeView;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveView(item.id)}
              className={cn(
                "group flex min-w-[88px] flex-1 items-center justify-center gap-2 rounded-2xl px-3 py-2 text-[11px] font-medium transition-all duration-200 ease-mac focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/65 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-w-[104px] sm:text-sm",
                isActive
                  ? "bg-foreground text-background shadow-elevation-xs"
                  : "bg-transparent text-foreground/70 hover:bg-subtle/75 hover:text-foreground",
              )}
              aria-pressed={isActive}
              aria-label={item.label}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 transition-colors duration-200 ease-mac sm:h-5 sm:w-5",
                  isActive ? "text-background" : "text-foreground/60 group-hover:text-foreground",
                )}
                strokeWidth={1.75}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
