"use client";

import { useMemo } from "react";

import type { GroupedEntries } from "@/lib/data/fixtures";
import { TimelinePlaceholder } from "@/components/timeline/placeholder";
import { useViewStore, viewLabels, type ViewId } from "@/stores/view-store";

const viewDescriptions: Record<ViewId, string> = {
  today: "聚焦当日收集的所有素材，随后会展示今日新增的文字、链接与图片条目。",
  timeline: "浏览完整的时间线，按日期分组的所有历史剪藏会在此集中展示。",
  types: "类型筛选器即将上线，可按文字、图片、视频、片段等维度过滤并组合视图。",
  search: "全局搜索支持关键字、日期与标签过滤，未来会由 Supabase 全文索引驱动。",
  settings: "偏好设置面板将用于管理访问密码、主题、动画与同步策略。",
};

export function DashboardContent({ groups }: { groups: GroupedEntries[] }) {
  const activeView = useViewStore((state) => state.activeView);

  const description = useMemo(() => viewDescriptions[activeView], [activeView]);
  const timelineGroups = useMemo(() => groups, [groups]);
  const todayGroups = useMemo(() => (timelineGroups.length > 0 ? [timelineGroups[0]] : []), [timelineGroups]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-foreground/55">{viewLabels[activeView]}</p>
        <h2 className="text-2xl font-semibold text-foreground">
          {activeView === "today" ? "今天的剪藏快照" : viewLabels[activeView]}
        </h2>
        <p className="text-sm text-foreground/60">{description}</p>
      </header>

      {activeView === "timeline" || activeView === "today" ? (
        <TimelinePlaceholder groups={activeView === "today" ? todayGroups : timelineGroups} />
      ) : (
        <div className="glass-panel flex flex-col gap-4 rounded-[36px] p-10 text-sm text-foreground/70 shadow-elevation-sm">
          <p className="text-base font-medium text-foreground/80">敬请期待</p>
          <p className="text-foreground/60">
            该视图的交互与数据流将在后续迭代中实现。当前页面仅保留布局占位，确保 Dock 状态与内容区保持同步。
          </p>
        </div>
      )}
    </div>
  );
}
