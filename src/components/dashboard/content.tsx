"use client";

import { useEffect, useMemo } from "react";

import { CaptureEntryPanel } from "@/components/capture/capture-panel";
import { TimelinePlaceholder } from "@/components/timeline/placeholder";
import { useViewStore } from "@/stores/view-store";
import type { GroupedEntries } from "@/lib/data/fixtures";

export function DashboardContent({ groups }: { groups: GroupedEntries[] }) {
  const activeView = useViewStore((state) => state.activeView);
  const setActiveView = useViewStore((state) => state.setActiveView);

  useEffect(() => {
    setActiveView("capture");
  }, [setActiveView]);

  const timelineGroups = useMemo(() => groups, [groups]);
  const todayGroups = useMemo(() => (timelineGroups.length > 0 ? [timelineGroups[0]] : []), [timelineGroups]);

  const panel = activeView === "capture"
    ? (
      <div className="scroll-elegant flex h-full w-full flex-1 flex-col overflow-y-auto min-h-0 pb-20 sm:pb-24">
        <CaptureEntryPanel />
      </div>
    )
    : (
      <div className="flex h-full w-full flex-1 flex-col overflow-hidden min-h-0 pb-20 sm:pb-24">
        <TimelinePlaceholder
          groups={activeView === "today" ? todayGroups : timelineGroups}
          variant={activeView === "today" ? "today" : "timeline"}
        />
      </div>
    );

  return (
    <section className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-6 min-h-0 lg:h-[calc(100vh-200px)] lg:min-h-[calc(100vh-200px)] lg:max-h-[calc(100vh-200px)] lg:flex-none">
      <div key={activeView} className="flex h-full min-h-0 flex-1 motion-safe:animate-view-enter lg:h-full">
        {panel}
      </div>
    </section>
  );
}
