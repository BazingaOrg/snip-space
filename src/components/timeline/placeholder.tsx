"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { GroupedEntries } from "@/lib/data/fixtures";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

function EntryCard({
  title,
  content,
  type,
  sourceUrl,
}: {
  title?: string;
  content: string;
  type: string;
  sourceUrl?: string;
}) {
  return (
    <article className="group rounded-2xl border border-border/60 bg-card/90 p-4 transition-all duration-200 ease-mac hover:border-border hover:bg-card supports-[backdrop-filter]:bg-card/70">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-border/55 bg-subtle/90 px-3 py-1 text-xs uppercase tracking-[0.24em] text-foreground/60 supports-[backdrop-filter]:bg-subtle/70">
          {type}
        </span>
        {sourceUrl ? (
          <Link
            href={sourceUrl}
            className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
            target="_blank"
            rel="noreferrer"
          >
            打开原链接
          </Link>
        ) : null}
      </div>
      {title ? <h3 className="mt-3 text-base font-semibold text-foreground">{title}</h3> : null}
      <p className="mt-2 break-words text-sm text-foreground/75 line-clamp-3">{content}</p>
    </article>
  );
}

type TimelineVariant = "today" | "timeline";

export function TimelinePlaceholder({ groups, variant = "timeline" }: { groups: GroupedEntries[]; variant?: TimelineVariant }) {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<string>("all");

  const uniqueTypes = useMemo(() => {
    const types = new Set<string>();
    for (const group of groups) {
      for (const entry of group.entries) {
        types.add(entry.type);
      }
    }
    return Array.from(types);
  }, [groups]);

  const filters = useMemo(() => ["all", ...uniqueTypes], [uniqueTypes]);

  const filteredGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return groups
      .map((group) => {
        const entries = group.entries.filter((entry) => {
          const matchesType = activeType === "all" || entry.type === activeType;
          if (!matchesType) return false;

          if (!normalizedQuery) return true;

          const titleMatch = entry.title?.toLowerCase().includes(normalizedQuery) ?? false;
          const contentMatch = entry.content.toLowerCase().includes(normalizedQuery);
          return titleMatch || contentMatch;
        });
        return { ...group, entries };
      })
      .filter((group) => group.entries.length > 0);
  }, [groups, query, activeType]);

  const totalEntries = useMemo(
    () => filteredGroups.reduce((acc, group) => acc + group.entries.length, 0),
    [filteredGroups],
  );

  if (groups.length === 0) {
    return (
      <section className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-surface/90 p-6 text-sm text-foreground/70 shadow-elevation-xs supports-[backdrop-filter]:bg-surface/70 sm:p-8">
        <h3 className="text-base font-semibold text-foreground">暂无剪藏</h3>
        <p>点击 Dock 中的加号或直接粘贴内容，即可创建第一条笔记。</p>
      </section>
    );
  }

  const title = variant === "today" ? "今日剪藏" : "最近剪藏";

  return (
    <section className="flex w-full flex-col gap-6 rounded-3xl border border-border/60 bg-surface/90 p-6 shadow-elevation-xs supports-[backdrop-filter]:bg-surface/70 sm:p-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">时间线</p>
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        </div>
        <span className="rounded-full border border-border/55 bg-subtle/90 px-4 py-1.5 text-xs text-foreground/65 supports-[backdrop-filter]:bg-subtle/70">
          {totalEntries} 条结果
        </span>
      </header>

      <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-subtle/60 p-4 supports-[backdrop-filter]:bg-subtle/45 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索标题或内容"
          className="h-10 w-full sm:max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const isAll = filter === "all";
            const isActive = filter === activeType;
            const label = isAll ? "全部类型" : filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveType(filter)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-elevation-xs"
                    : "border-border/60 bg-transparent text-foreground/60 hover:text-foreground",
                )}
                aria-pressed={isActive}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {totalEntries === 0 ? (
        <p className="rounded-2xl border border-border/60 bg-surface/80 px-5 py-6 text-center text-sm text-foreground/60 supports-[backdrop-filter]:bg-surface/60">
          暂无匹配的剪藏，试试调整搜索或类型筛选。
        </p>
      ) : (
        <div className="space-y-6">
          {filteredGroups.map((group) => (
            <div key={group.day} className="space-y-3">
              <p className="text-xs uppercase tracking-[0.24em] text-foreground/45">{group.day}</p>
              <div className="grid gap-4 md:grid-cols-2">
                {group.entries.map((entry) => (
                  <EntryCard
                    key={entry.id}
                    title={entry.title}
                    content={entry.content}
                    type={entry.type}
                    sourceUrl={entry.sourceUrl}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
