"use client";

import { ChevronDown } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { format, isToday, isYesterday, parseISO } from "date-fns";

import type { EntryType, GroupedEntries } from "@/lib/data/fixtures";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import SyntaxHighlighter from "react-syntax-highlighter";
import { github } from "react-syntax-highlighter/dist/esm/styles/hljs";

type ImagePreviewPayload = { src: string; title?: string };
type LinkPreviewPayload = { href: string; title?: string };

const TYPE_LABELS: Record<EntryType | "all", string> = {
  all: "全部类型",
  text: "文本",
  link: "链接",
  image: "图片",
  video: "视频",
  snippet: "代码片段",
  mixed: "混合",
};

function getTypeLabel(type: EntryType | "all") {
  return TYPE_LABELS[type] ?? type;
}

function EntryCard({
  title,
  content,
  type,
  sourceUrl,
  onPreviewImage,
  onPreviewLink,
}: {
  title?: string;
  content: string;
  type: string;
  sourceUrl?: string;
  onPreviewImage?: (payload: ImagePreviewPayload) => void;
  onPreviewLink?: (payload: LinkPreviewPayload) => void;
}) {
  const isImage = type === "image";
  const isLink = type === "link";
  const isSnippet = type === "snippet";
  const resolvedUrl = sourceUrl ?? (isLink ? content : undefined);
  const typeLabel = getTypeLabel(type as EntryType);
  const [isExpanded, setIsExpanded] = useState(false);

  const isExpandableText = !isImage && !isLink && !isSnippet && (content.length > 140 || content.includes("\n"));
  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <article className="group w-full min-w-0 rounded-2xl border border-border/60 bg-card/90 p-4 transition-all duration-200 ease-mac hover:border-border hover:bg-card supports-[backdrop-filter]:bg-card/70">
      <div className="flex items-center justify-center gap-3">
        <span className="rounded-full border border-border/55 bg-subtle/90 px-3 py-1 text-xs uppercase tracking-[0.24em] text-foreground/60 supports-[backdrop-filter]:bg-subtle/70">
          {typeLabel}
        </span>
      </div>

      {title ? <h3 className="mt-3 text-center text-base font-semibold text-foreground">{title}</h3> : null}

      {isImage ? (
        <button
          type="button"
          onClick={() => onPreviewImage?.({ src: content, title })}
          className="group/image relative mt-3 flex w-full overflow-hidden rounded-2xl border border-border/70 bg-subtle/60 shadow-elevation-xs transition-transform duration-300 ease-mac hover:-translate-y-0.5 supports-[backdrop-filter]:bg-subtle/50"
        >
          <img
            src={content}
            alt={title ?? "剪藏图片"}
            loading="lazy"
            className="h-56 w-full min-w-0 object-cover transition-transform duration-500 ease-mac group-hover/image:scale-[1.02] sm:h-64"
          />
        </button>
      ) : null}

      {isLink ? (
        <div className="mt-3 flex flex-col items-center gap-2 text-center">
          {resolvedUrl ? (
            <a
              href={resolvedUrl}
              className="break-words rounded-2xl border border-border/50 bg-subtle/60 px-4 py-3 text-sm text-primary transition-colors hover:border-primary/45 hover:bg-subtle/70 hover:text-primary/80 supports-[backdrop-filter]:bg-subtle/50"
              rel="noreferrer"
            >
              {resolvedUrl}
            </a>
          ) : null}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => resolvedUrl && onPreviewLink?.({ href: resolvedUrl, title })}
              className="rounded-full border border-primary/40 bg-primary/12 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/18"
            >
              预览
            </button>
          </div>
        </div>
      ) : null}

      {isSnippet ? (
        <div className="mt-3 overflow-hidden rounded-2xl border border-border/60 bg-subtle/60 shadow-elevation-xs supports-[backdrop-filter]:bg-subtle/45">
          <div className="flex items-center justify-between border-b border-border/60 bg-background/60 px-4 py-2 text-xs text-foreground/60">
            <span>代码片段</span>
            <span className="font-mono text-foreground/45">TS</span>
          </div>
          <SyntaxHighlighter
            language="tsx"
            style={github}
            customStyle={{
              margin: 0,
              padding: "1rem",
              fontSize: "0.875rem",
              maxHeight: "16rem",
              background: "transparent",
            }}
            codeTagProps={{ className: "whitespace-pre-wrap break-words" }}
          >
            {content.trim()}
          </SyntaxHighlighter>
        </div>
      ) : null}

      {!isImage && !isLink && !isSnippet ? (
        <>
          <p
            className={cn(
              "mt-3 whitespace-pre-wrap break-words text-sm text-foreground/75 transition-all",
              !isExpanded && "line-clamp-3",
            )}
          >
            {content}
          </p>
          {isExpandableText ? (
            <div className="mt-2 flex justify-center">
              <button
                type="button"
                onClick={handleToggleExpand}
                className="rounded-full border border-border/60 bg-subtle/70 px-3 py-1 text-xs text-foreground/60 transition-colors hover:border-primary/45 hover:text-primary"
              >
                {isExpanded ? "收起内容" : "展开全文"}
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </article>
  );
}

type TimelineVariant = "today" | "timeline";

export function TimelinePlaceholder({ groups, variant = "timeline" }: { groups: GroupedEntries[]; variant?: TimelineVariant }) {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<string>("all");
  const [imagePreview, setImagePreview] = useState<ImagePreviewPayload | null>(null);
  const [linkPreview, setLinkPreview] = useState<LinkPreviewPayload | null>(null);

  const handleOpenImagePreview = useCallback((payload: ImagePreviewPayload) => {
    setImagePreview(payload);
  }, []);

  const handleOpenLinkPreview = useCallback((payload: LinkPreviewPayload) => {
    setLinkPreview(payload);
  }, []);

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
    <section className="flex h-full min-h-0 w-full flex-col gap-6 overflow-x-hidden rounded-3xl border border-border/60 bg-surface/90 p-6 shadow-elevation-xs supports-[backdrop-filter]:bg-surface/70 sm:p-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">时间线</p>
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        </div>
        <span className="rounded-full border border-border/55 bg-subtle/90 px-4 py-1.5 text-xs text-foreground/65 supports-[backdrop-filter]:bg-subtle/70">
          {totalEntries} 条结果
        </span>
      </header>

      <div className="grid gap-2 rounded-2xl border border-border/60 bg-subtle/60 p-4 supports-[backdrop-filter]:bg-subtle/45 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-3">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索标题或内容"
          className="h-10 w-full"
        />
        <div className="relative w-full sm:w-56">
          <select
            value={activeType}
            onChange={(event) => setActiveType(event.target.value)}
            className="h-10 w-full appearance-none rounded-2xl border border-border/60 bg-surface/95 px-4 pr-10 text-sm text-foreground shadow-elevation-xs transition-all duration-200 ease-mac focus-visible:border-primary/55 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background supports-[backdrop-filter]:bg-surface/70"
            aria-label="类型筛选"
          >
            {filters.map((filter) => {
              const isAll = filter === "all";
              const label = getTypeLabel(filter as EntryType | "all");
              return (
                <option key={filter} value={filter} className="bg-surface text-foreground">
                  {label}
                </option>
              );
            })}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/45" aria-hidden />
        </div>
      </div>

      <div className="scroll-elegant flex-1 min-h-0 overflow-y-auto overflow-x-hidden pb-16 sm:pb-20 lg:pb-24 lg:pr-1">
        {totalEntries === 0 ? (
          <p className="rounded-2xl border border-border/60 bg-surface/80 px-5 py-6 text-center text-sm text-foreground/60 supports-[backdrop-filter]:bg-surface/60">
            暂无匹配的剪藏，试试调整搜索或类型筛选。
          </p>
        ) : (
          <div className="relative space-y-10 pb-6 sm:space-y-10 lg:space-y-12">
            <span className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-border/55 lg:block" aria-hidden />
            {filteredGroups.map((group, index) => {
              const isRightAligned = index % 2 === 0;
              const dayDate = parseISO(`${group.day}T00:00:00`);
              const dayLabel = isToday(dayDate)
                ? "今天"
                : isYesterday(dayDate)
                  ? "昨天"
                  : format(dayDate, "M月d日");
              const fullDateLabel = format(dayDate, "yyyy 年 M 月 d 日");

              const desktopLeftColumnClasses = isRightAligned
                ? "hidden lg:hidden"
                : "hidden lg:col-start-1 lg:flex lg:flex-col lg:items-end lg:gap-3 lg:pr-6";
              const desktopRightColumnClasses = isRightAligned
                ? "hidden lg:col-start-3 lg:flex lg:flex-col lg:items-start lg:gap-3 lg:pl-6"
                : "hidden lg:hidden";

              return (
                <div
                  key={group.day}
                  className="relative grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_max-content_minmax(0,1fr)] lg:items-stretch"
                >
                  <div className="space-y-3 min-w-0 lg:hidden">
                    <span className="inline-flex w-fit rounded-full border border-border/60 bg-surface/90 px-3 py-1 text-xs font-medium text-foreground/70 shadow-elevation-xs supports-[backdrop-filter]:bg-surface/70">
                      {dayLabel}
                    </span>
                    {group.entries.map((entry) => (
                      <EntryCard
                        key={`mobile-${group.day}-${entry.id}`}
                        title={entry.title}
                        content={entry.content}
                        type={entry.type}
                        sourceUrl={entry.sourceUrl}
                        onPreviewImage={handleOpenImagePreview}
                        onPreviewLink={handleOpenLinkPreview}
                      />
                    ))}
                  </div>

                  <div className={desktopLeftColumnClasses}>
                    {group.entries.map((entry) => (
                      <div key={`left-${group.day}-${entry.id}`} className="w-full min-w-0 lg:ml-auto lg:max-w-[24rem] xl:w-[24rem]">
                        <EntryCard
                          title={entry.title}
                          content={entry.content}
                          type={entry.type}
                          sourceUrl={entry.sourceUrl}
                          onPreviewImage={handleOpenImagePreview}
                          onPreviewLink={handleOpenLinkPreview}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="relative hidden lg:col-start-2 lg:flex lg:flex-col lg:items-center lg:justify-center lg:gap-3">
                    <span className="z-10 rounded-full border border-border/60 bg-surface/95 px-3 py-1 text-xs font-medium text-foreground shadow-elevation-xs supports-[backdrop-filter]:bg-surface/75" title={fullDateLabel}>
                      {dayLabel}
                    </span>
                    <span
                      className="z-10 flex h-3 w-3 items-center justify-center rounded-full border border-primary bg-background shadow-[0_0_0_4px_rgba(59,130,246,0.16)]"
                      aria-hidden
                    />
                  </div>

                  <div className={desktopRightColumnClasses}>
                    {group.entries.map((entry) => (
                      <div key={`right-${group.day}-${entry.id}`} className="w-full min-w-0 lg:mr-auto lg:max-w-[24rem] xl:w-[24rem]">
                        <EntryCard
                          title={entry.title}
                          content={entry.content}
                          type={entry.type}
                          sourceUrl={entry.sourceUrl}
                          onPreviewImage={handleOpenImagePreview}
                          onPreviewLink={handleOpenLinkPreview}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog
        open={imagePreview !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setImagePreview(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl overflow-hidden border border-border/60 bg-surface/95 p-6 shadow-elevation-md supports-[backdrop-filter]:bg-surface/70">
          {imagePreview ? (
            <div className="flex max-h-[70vh] w-full items-center justify-center">
              <img
                src={imagePreview.src}
                alt={imagePreview.title ?? "剪藏图片"}
                className="max-h-[68vh] w-full rounded-[28px] object-contain"
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={linkPreview !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setLinkPreview(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl overflow-hidden border border-border/60 bg-surface/95 p-0 shadow-elevation-md supports-[backdrop-filter]:bg-surface/70">
          {linkPreview ? (
            <div className="flex h-[70vh] w-full flex-col">
              <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-[0.32em] text-foreground/45">链接预览</span>
                  <h3 className="text-base font-semibold text-foreground">{linkPreview.title ?? "Captured Link"}</h3>
                </div>
                <a
                  href={linkPreview.href}
                  className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  rel="noreferrer"
                >
                  在当前标签打开
                </a>
              </div>
              <iframe
                src={linkPreview.href}
                title={linkPreview.title ?? linkPreview.href}
                className="h-full w-full flex-1 bg-white"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="px-6 py-16 text-center text-sm text-foreground/60">未找到可预览的链接。</div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
