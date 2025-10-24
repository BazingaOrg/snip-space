import type { LucideIcon } from "lucide-react";
import { CalendarClock, ListChecks, NotebookPen } from "lucide-react";

import type { ViewId } from "@/stores/view-store";

export interface DockItem {
  readonly id: ViewId;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly intent: "primary" | "secondary";
}

export const dockItems: DockItem[] = [
  { id: "today", label: "Today", icon: CalendarClock, intent: "secondary" },
  { id: "capture", label: "Capture", icon: NotebookPen, intent: "primary" },
  { id: "timeline", label: "Timeline", icon: ListChecks, intent: "secondary" },
];
