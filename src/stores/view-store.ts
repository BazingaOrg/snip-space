"use client";

import { create } from "zustand";

type ViewId = "today" | "timeline" | "types" | "search" | "settings";

interface ViewState {
  activeView: ViewId;
  setActiveView: (view: ViewId) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  activeView: "today",
  setActiveView: (view) => set({ activeView: view }),
}));

export const viewLabels: Record<ViewId, string> = {
  today: "今日摘要",
  timeline: "时间轴",
  types: "类型筛选",
  search: "搜索",
  settings: "偏好设置",
};

export type { ViewId };
