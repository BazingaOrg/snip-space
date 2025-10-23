"use client";

import { dockItems } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useViewStore } from "@/stores/view-store";

export function Dock() {
  const activeView = useViewStore((state) => state.activeView);
  const setActiveView = useViewStore((state) => state.setActiveView);

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-8 z-40 flex justify-center px-4">
      <div className="pointer-events-auto dock-blur flex w-[min(720px,90vw)] items-center justify-center gap-2 rounded-[28px] px-3 py-2 shadow-elevation-sm backdrop-blur-glass animate-fade-up">
        {dockItems.map((item) => {
          const isActive = item.id === activeView;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveView(item.id)}
              className={cn(
                "group flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-medium transition-all duration-200 ease-mac",
                "hover:-translate-y-1",
                isActive ? "bg-white/30 text-foreground shadow-elevation-xs" : "text-foreground/70",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-foreground" : "text-foreground/75 group-hover:text-foreground",
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
