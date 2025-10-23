import type { LucideIcon } from "lucide-react";
import {
  CalendarClock,
  ListChecks,
  PanelLeftOpen,
  Search,
  Settings,
} from "lucide-react";

export interface DockItem {
  readonly id: string;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly intent: "primary" | "secondary";
}

export const dockItems: DockItem[] = [
  { id: "today", label: "Today", icon: CalendarClock, intent: "primary" },
  { id: "timeline", label: "Timeline", icon: ListChecks, intent: "secondary" },
  { id: "types", label: "Types", icon: PanelLeftOpen, intent: "secondary" },
  { id: "search", label: "Search", icon: Search, intent: "primary" },
  { id: "settings", label: "Settings", icon: Settings, intent: "secondary" },
];
