import Link from "next/link";

import type { GroupedEntries } from "@/lib/data/fixtures";

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
    <article className="group rounded-[28px] border border-white/24 bg-white/55 p-5 shadow-elevation-xs transition-all duration-200 ease-mac hover:border-white/32 hover:bg-white/65">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-white/30 bg-white/60 px-3 py-1 text-xs uppercase tracking-[0.24em] text-foreground/60">
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

export function TimelinePlaceholder({ groups }: { groups: GroupedEntries[] }) {
  if (groups.length === 0) {
    return (
      <section className="glass-panel flex flex-col gap-4 rounded-[32px] p-6 text-sm text-foreground/70 shadow-elevation-sm sm:p-8">
        <h3 className="text-base font-semibold text-foreground">暂无剪藏</h3>
        <p>点击 Dock 中的加号或直接粘贴内容，即可创建第一条笔记。</p>
      </section>
    );
  }

  return (
    <section className="grid w-full gap-5 sm:gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="glass-panel flex min-w-0 flex-col gap-5 rounded-[32px] p-6 shadow-elevation-sm sm:gap-6 sm:rounded-[36px] sm:p-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">时间线</p>
            <h2 className="text-xl font-semibold text-foreground">最近剪藏</h2>
          </div>
          <span className="rounded-full border border-white/30 bg-white/55 px-4 py-1.5 text-xs text-foreground/65">
            类型筛选即将上线
          </span>
        </header>
        <div className="space-y-4 sm:space-y-5">
          {groups.map((group) => (
            <div
              key={group.day}
              className="rounded-[24px] border border-white/22 bg-white/50 p-4 shadow-elevation-xs sm:rounded-[28px] sm:p-5"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-foreground/45">{group.day}</p>
              <div className="mt-4 grid gap-3">
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
      </div>
      <aside className="glass-panel flex min-w-0 flex-col gap-4 rounded-[32px] p-6 shadow-elevation-sm sm:rounded-[36px] sm:p-8">
        <h3 className="text-lg font-semibold text-foreground">条目详情</h3>
        <p className="text-sm text-foreground/70">
          未来点击时间线条目后，会在此展示元信息、快捷操作与预览内容。
        </p>
        <div className="rounded-2xl border border-white/18 bg-white/8 p-4 text-xs text-foreground/60">
          这里将用于展示置顶备注、快捷标签以及右上角通知的上下文。
        </div>
        <Link
          href="/docs/requirements"
          className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-primary transition-colors hover:text-primary/80"
        >
          查看完整需求文档 →
        </Link>
      </aside>
    </section>
  );
}
