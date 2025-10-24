"use client";

import { Plus } from "lucide-react";

import { CaptureEntryTrigger } from "@/components/capture/capture-modal";
import { dockItems } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useViewStore } from "@/stores/view-store";

export function Dock() {
  const activeView = useViewStore((state) => state.activeView);
  const setActiveView = useViewStore((state) => state.setActiveView);

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4 sm:bottom-8">
      <div className="pointer-events-auto dock-blur flex w-full max-w-[640px] items-center justify-center gap-2 rounded-[28px] px-3 py-2 animate-fade-up sm:max-w-[720px] sm:gap-3 sm:rounded-[32px] sm:px-4 sm:py-3">
        {dockItems.map((item) => {
          const isActive = item.id === activeView;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveView(item.id)}
              className={cn(
                "group flex flex-col items-center gap-0.5 rounded-2xl px-2.5 py-1.5 text-[10px] font-medium transition-all duration-200 ease-mac sm:px-3 sm:py-2 sm:text-xs",
                "hover:-translate-y-1",
                isActive
                  ? "bg-white/55 text-foreground shadow-elevation-xs"
                  : "text-foreground/65 hover:text-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 transition-colors sm:h-5 sm:w-5",
                  isActive ? "text-foreground" : "text-foreground/60 group-hover:text-foreground",
                )}
                strokeWidth={1.75}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
        <CaptureEntryTrigger
          trigger={
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/85 text-primary-foreground shadow-elevation-xs transition-transform duration-200 ease-mac hover:-translate-y-1 hover:from-primary/95 hover:to-primary/70 sm:h-12 sm:w-12"
            >
              <Plus className="h-5 w-5" />
              <span className="sr-only">打开新建剪藏面板</span>
            </button>
          }
        />
      </div>
    </nav>
  );
}
