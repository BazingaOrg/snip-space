"use client";

import { create } from "zustand";

type ViewId = "capture" | "today" | "timeline";

interface ViewState {
  activeView: ViewId;
  setActiveView: (view: ViewId) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  activeView: "capture",
  setActiveView: (view) => set({ activeView: view }),
}));

export const viewLabels: Record<ViewId, string> = {
  capture: "快速剪藏",
  today: "今日摘要",
  timeline: "时间轴",
};

export type { ViewId };
