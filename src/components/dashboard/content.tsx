"use client";

import { useMemo } from "react";

import { CaptureEntryPanel } from "@/components/capture/capture-panel";
import { TimelinePlaceholder } from "@/components/timeline/placeholder";
import { useViewStore } from "@/stores/view-store";
import type { GroupedEntries } from "@/lib/data/fixtures";

export function DashboardContent({ groups }: { groups: GroupedEntries[] }) {
  const activeView = useViewStore((state) => state.activeView);

  const timelineGroups = useMemo(() => groups, [groups]);
  const todayGroups = useMemo(() => (timelineGroups.length > 0 ? [timelineGroups[0]] : []), [timelineGroups]);

  const panel = activeView === "capture"
    ? <CaptureEntryPanel />
    : (
        <TimelinePlaceholder
          groups={activeView === "today" ? todayGroups : timelineGroups}
          variant={activeView === "today" ? "today" : "timeline"}
        />
      );

  return (
    <section className="mx-auto flex w-full max-w-[1400px] flex-col gap-6">
      <div key={activeView} className="motion-safe:animate-view-enter">
        {panel}
      </div>
    </section>
  );
}
